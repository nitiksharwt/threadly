// ============ Home page ============
document.addEventListener("DOMContentLoaded", () => {
  /* Hero garments */
  document.getElementById("hero-g1").innerHTML = '<img src="https://png.pngtree.com/png-clipart/20241223/original/pngtree-light-gray-hoodie-on-transparent-background-png-image_18136825.png">';
  document.getElementById("hero-g2").innerHTML =  '<img src="https://png.pngtree.com/png-vector/20230430/ourmid/pngtree-dress-styling-creative-clothing-png-image_6747137.png">';
  document.getElementById("hero-g3").innerHTML = '<img src="https://pngimg.com/uploads/cap/cap_PNG5673.png">';


  /* Categories */
  const catGrid = document.getElementById("cat-grid");
  catGrid.innerHTML = CATEGORIES.map((c) => {
    const n = PRODUCTS.filter((p) => p.category === c.key).length;
    return `<a class="cat-card reveal" href="shop.html?cat=${c.key}">
              <div class="emoji">${c.emoji}</div><h3>${c.label}</h3><small>${n} items</small>
            </a>`;
  }).join("");

  /* Featured products: top rated 8 */
  const featured = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  document.getElementById("featured-grid").innerHTML = featured.map(productCard).join("");

  /* Countdown (ends 7 days after the visitor's first visit, then restarts) */
  let end = Store.get("tl_sale_end", 0);
  if (!end || end < Date.now()) {
    end = Date.now() + 7 * 24 * 60 * 60 * 1000;
    Store.set("tl_sale_end", end);
  }
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = Math.max(0, end - Date.now());
    document.getElementById("cd-d").textContent = pad(Math.floor(diff / 86400000));
    document.getElementById("cd-h").textContent = pad(Math.floor(diff / 3600000) % 24);
    document.getElementById("cd-m").textContent = pad(Math.floor(diff / 60000) % 60);
    document.getElementById("cd-s").textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* Testimonials slider */
  const reviews = [
    { text: "The hoodie quality is unreal for the price. Fits perfectly and the colour hasn't faded after many washes!", who: "Aarav S., Delhi" },
    { text: "Ordered a dress for a wedding and got so many compliments. Delivery was quick too.", who: "Neha K., Dehradun" },
    { text: "My kids love their Threadly tees. Soft, bright and they last through all the playtime.", who: "Priya M., Mumbai" }
  ];
  const testi = document.getElementById("testi");
  const dots = document.getElementById("testi-dots");
  let current = 0;
  dots.innerHTML = reviews.map((_, i) => `<span data-i="${i}" role="button" aria-label="Review ${i + 1}"></span>`).join("");
  function showReview(i) {
    current = i;
    testi.innerHTML = `<p>"${reviews[i].text}"</p><h5>— ${reviews[i].who}</h5><div class="p-rating" style="margin-top:6px">★★★★★</div>`;
    [...dots.children].forEach((d, idx) => d.classList.toggle("on", idx === i));
  }
  dots.addEventListener("click", (e) => { if (e.target.dataset.i) showReview(Number(e.target.dataset.i)); });
  showReview(0);
  setInterval(() => showReview((current + 1) % reviews.length), 5000);

  /* Newsletter */
  document.getElementById("news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("news-email").value.trim();
    const msg = document.getElementById("news-msg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Please enter a valid email address.";
      return;
    }
    msg.textContent = "";
    Store.set("tl_newsletter", email);
    e.target.reset();
    toast("Subscribed! Check your inbox 🎉");
  });

  observeReveals();
});
