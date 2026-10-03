// ============ Threadly – shared logic (loaded on every page) ============
// Needs data.js loaded first.

/* ---------- Storage helpers ---------- */
const Store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
};

const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const findProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));

/* ---------- Cart ---------- */
const Cart = {
  get() { return Store.get("tl_cart", []); },
  save(items) { Store.set("tl_cart", items); updateBadges(); },
  add(id, qty = 1) {
    const items = this.get();
    const found = items.find((i) => i.id === id);
    if (found) found.qty += qty; else items.push({ id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    let items = this.get();
    items = items.map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0);
    this.save(items);
  },
  remove(id) { this.save(this.get().filter((i) => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  subtotal() {
    return this.get().reduce((s, i) => {
      const p = findProduct(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }
};

/* ---------- Wishlist ---------- */
const Wishlist = {
  get() { return Store.get("tl_wish", []); },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    let list = this.get();
    const added = !list.includes(id);
    list = added ? [...list, id] : list.filter((x) => x !== id);
    Store.set("tl_wish", list);
    updateBadges();
    return added;
  }
};

/* ---------- Garment drawing (SVG) ---------- */
function garmentSVG(type, color) {
  const stroke = "rgba(0,0,0,.25)";
  const shapes = {
    tshirt: `<path d="M30 15 L10 28 L20 42 L28 37 L28 88 L72 88 L72 37 L80 42 L90 28 L70 15 Q50 30 30 15Z"/>`,
    hoodie: `<path d="M32 14 Q50 2 68 14 L92 42 L82 54 L72 46 L72 90 L28 90 L28 46 L18 54 L8 42 Z"/>
             <path d="M38 14 Q50 34 62 14" fill="none"/><rect x="38" y="62" width="24" height="14" rx="4" fill="rgba(0,0,0,.08)"/>`,
    jacket: `<path d="M32 14 L50 22 L68 14 L92 42 L82 56 L72 48 L72 90 L28 90 L28 48 L18 56 L8 42 Z"/>
             <path d="M50 22 V90" fill="none"/>`,
    dress:  `<path d="M38 8 L62 8 L66 34 L86 92 L14 92 L34 34 Z"/><path d="M34 34 H66" fill="none"/>`,
    jeans:  `<path d="M28 8 L72 8 L77 92 L54 92 L50 40 L46 92 L23 92 Z"/><path d="M28 18 H72" fill="none"/>`,
    cap:    `<path d="M14 64 Q14 24 50 24 Q86 24 86 64 Z"/><path d="M62 64 L97 68 Q97 78 62 72 Z"/>`
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${shapes[type] || shapes.tshirt}</svg>`;
}

function productImage(p) {
  return p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" width="400" height="400">`
    : garmentSVG(p.type, p.color);
}

/* ---------- Product card ---------- */
function productCard(p) {
  const wished = Wishlist.has(p.id);
  const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
  return `
    <article class="product-card reveal">
      <div class="p-img">
        ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}
        <button class="wish-btn ${wished ? "on" : ""}" data-wish="${p.id}" aria-label="Add to wishlist">${wished ? "♥" : "♡"}</button>
        ${productImage(p)}
      </div>
      <div class="p-body">
        <span class="p-cat">${p.category}</span>
        <h3 class="p-name">${p.name}</h3>
        <span class="p-rating" title="${p.rating} out of 5">${stars} <small style="color:#6b7280">${p.rating}</small></span>
        <div class="p-price"><b>${money(p.price)}</b>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
        <button class="btn btn-sm" data-add="${p.id}">Add to Cart</button>
      </div>
    </article>`;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Header & footer (injected so every page stays in sync) ---------- */
function renderHeader() {
  const page = document.body.dataset.page || "";
  const link = (href, key, label) =>
    `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  const target = document.getElementById("site-header");
  if (!target) return;
  target.innerHTML = `
    <div class="announce">🎉 Free shipping on orders above ${money(FREE_SHIPPING_ABOVE)} · Use code <b>SAVE10</b></div>
    <header class="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="logo">Thread<span>ly</span></a>
        <nav class="nav-links" id="nav-links" aria-label="Main">
          ${link("index.html", "home", "Home")}
          ${link("shop.html", "shop", "Shop")}
          ${link("about.html", "about", "About")}
          ${link("contact.html", "contact", "Contact")}
        </nav>
        <div class="nav-actions">
          <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">♡<span class="badge" id="wish-count">0</span></a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">🛒<span class="badge" id="cart-count">0</span></a>
          <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu" aria-expanded="false">☰</button>
        </div>
      </div>
    </header>`;
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
}

function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;
  target.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="logo">Thread<span>ly</span></a>
            <p style="margin-top:10px;font-size:.92rem">Everyday fashion that feels as good as it looks. Designed in India, loved everywhere.</p>
          </div>
          <div><h4>Shop</h4><ul>
            <li><a href="shop.html?cat=men">Men</a></li><li><a href="shop.html?cat=women">Women</a></li>
            <li><a href="shop.html?cat=kids">Kids</a></li><li><a href="shop.html?cat=accessories">Accessories</a></li></ul></div>
          <div><h4>Company</h4><ul>
            <li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li>
            <li><a href="cart.html">Cart</a></li><li><a href="wishlist.html">Wishlist</a></li></ul></div>
          <div><h4>Contact</h4><ul>
            <li>📍 Dehradun, Uttarakhand</li><li>📞 +91 98765 43210</li><li>✉️ hello@threadly.example</li></ul></div>
        </div>
        <div class="footer-bottom">© <span id="year"></span> Threadly. All rights reserved.</div>
      </div>
    </footer>`;
  document.getElementById("year").textContent = new Date().getFullYear();
}

function updateBadges() {
  const c = document.getElementById("cart-count");
  const w = document.getElementById("wish-count");
  if (c) c.textContent = Cart.count();
  if (w) w.textContent = Wishlist.get().length;
}

/* ---------- Scroll reveal ---------- */
let revealObserver;
function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("visible")); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.1 });
  }
  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- Global click handling for add-to-cart & wishlist ---------- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const p = findProduct(add.dataset.add);
    Cart.add(p.id);
    toast(`${p.name} added to cart`);
    return;
  }
  const wish = e.target.closest("[data-wish]");
  if (wish) {
    const id = Number(wish.dataset.wish);
    const added = Wishlist.toggle(id);
    wish.classList.toggle("on", added);
    wish.textContent = added ? "♥" : "♡";
    toast(added ? "Saved to wishlist" : "Removed from wishlist");
    // Let page scripts react (e.g. wishlist page removes the card)
    document.dispatchEvent(new CustomEvent("wishlist:changed"));
  }
});

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  updateBadges();
  observeReveals();
});
