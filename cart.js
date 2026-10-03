// ============ Cart page: quantities, coupon, totals, checkout ============
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("cart-root");
  const sub = document.getElementById("cart-sub");
  let coupon = Store.get("tl_coupon", null); // e.g. "SAVE10"

  function totals() {
    const subtotal = Cart.subtotal();
    const c = coupon ? COUPONS[coupon] : null;
    let discount = 0;
    if (c) discount = c.type === "percent" ? (subtotal * c.value) / 100 : Math.min(c.value, subtotal);
    const after = subtotal - discount;
    const shipping = after === 0 || after >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    return { subtotal, discount, shipping, total: after + shipping };
  }

  function render() {
    const items = Cart.get().filter((i) => findProduct(i.id));
    sub.textContent = items.length ? `${Cart.count()} item(s) in your cart` : "Your cart is waiting to be filled.";

    if (!items.length) {
      root.innerHTML = `<div class="empty"><div class="emoji">🛒</div><h3>Your cart is empty</h3>
        <p style="margin-bottom:16px">Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-accent">Start Shopping</a></div>`;
      return;
    }

    const rows = items.map((i) => {
      const p = findProduct(i.id);
      return `
        <div class="cart-item">
          <div class="cart-img">${productImage(p)}</div>
          <div class="cart-info">
            <h4>${p.name}</h4>
            <small>${p.category} · ${money(p.price)} each</small><br>
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
              <span>${i.qty}</span>
              <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-right">
            <b>${money(p.price * i.qty)}</b><br>
            <button class="remove-btn" data-remove="${p.id}">Remove</button>
          </div>
        </div>`;
    }).join("");

    const t = totals();
    const toFree = Math.max(0, FREE_SHIPPING_ABOVE - (t.subtotal - t.discount));
    root.innerHTML = `
      <div class="cart-layout">
        <div>
          ${rows}
          <button class="btn btn-outline btn-sm" id="clear-cart">Clear cart</button>
        </div>
        <aside class="summary">
          <h3>Order Summary</h3>
          <div class="coupon">
            <input id="coupon-input" placeholder="Coupon code" value="${coupon || ""}" aria-label="Coupon code">
            <button class="btn btn-sm" id="apply-coupon">Apply</button>
          </div>
          <div class="coupon-msg" id="coupon-msg" style="color:${coupon ? "#059669" : "#6b7280"}">${coupon ? "✔ " + COUPONS[coupon].label : "Try SAVE10, STYLE20 or FLAT200"}</div>
          <div class="sum-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          <div class="sum-row"><span>Discount</span><span>− ${money(t.discount)}</span></div>
          <div class="sum-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : "FREE"}</span></div>
          <div class="sum-row total"><span>Total</span><span>${money(t.total)}</span></div>
          ${toFree > 0 ? `<p style="font-size:.8rem;color:#6b7280;margin:8px 0">Add ${money(toFree)} more for free shipping 🚚</p>` : ""}
          <button class="btn btn-accent btn-block" id="checkout-btn" style="margin-top:12px">Proceed to Checkout</button>
        </aside>
      </div>`;
  }

  /* Cart actions */
  root.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc) { const id = Number(inc.dataset.inc); Cart.setQty(id, Cart.get().find((i) => i.id === id).qty + 1); render(); }
    else if (dec) { const id = Number(dec.dataset.dec); Cart.setQty(id, Cart.get().find((i) => i.id === id).qty - 1); render(); }
    else if (rem) { Cart.remove(Number(rem.dataset.remove)); toast("Item removed"); render(); }
    else if (e.target.id === "clear-cart") { Cart.clear(); render(); }
    else if (e.target.id === "apply-coupon") {
      const code = document.getElementById("coupon-input").value.trim().toUpperCase();
      if (COUPONS[code]) { coupon = code; Store.set("tl_coupon", code); render(); toast("Coupon applied!"); }
      else {
        coupon = null; Store.set("tl_coupon", null); render();
        const m = document.getElementById("coupon-msg");
        m.style.color = "#dc2626"; m.textContent = code ? "Invalid coupon code." : "Enter a coupon code.";
      }
    }
    else if (e.target.id === "checkout-btn") openModal();
  });

  /* Checkout modal */
  const modal = document.getElementById("checkout-modal");
  const form = document.getElementById("co-form");
  function openModal() {
    document.getElementById("co-total-btn").textContent = `Place Order · ${money(totals().total)}`;
    modal.classList.add("open");
  }
  function closeModal() { modal.classList.remove("open"); }
  document.getElementById("co-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  const rules = {
    "co-name":    (v) => (v.length >= 3 ? "" : "Enter your full name."),
    "co-email":   (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email."),
    "co-phone":   (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number."),
    "co-address": (v) => (v.length >= 8 ? "" : "Enter your full address."),
    "co-city":    (v) => (v.length >= 2 ? "" : "Enter your city."),
    "co-pin":     (v) => (/^\d{6}$/.test(v) ? "" : "Enter a 6-digit PIN code.")
  };
  function check(id) {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const msg = rules[id](input.value.trim());
    field.classList.toggle("invalid", Boolean(msg));
    field.querySelector(".error").textContent = msg;
    return !msg;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!Object.keys(rules).map(check).every(Boolean)) return;

    const t = totals();
    const orderId = "TL" + Date.now().toString().slice(-8);
    const orders = Store.get("tl_orders", []);
    orders.push({
      id: orderId, items: Cart.get(), total: t.total, coupon,
      customer: document.getElementById("co-name").value.trim(),
      payment: document.getElementById("co-pay").value, date: new Date().toISOString()
    });
    Store.set("tl_orders", orders);

    document.getElementById("done-name").textContent = document.getElementById("co-name").value.trim();
    document.getElementById("done-id").textContent = "#" + orderId;
    document.getElementById("co-form-wrap").style.display = "none";
    document.getElementById("co-done").style.display = "block";

    Cart.clear();
    coupon = null; Store.set("tl_coupon", null);
    render();
  });

  render();
});
