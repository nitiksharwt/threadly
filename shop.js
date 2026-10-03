// ============ Shop page: search, filter, sort ============
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("shop-grid");
  const search = document.getElementById("search");
  const sort = document.getElementById("sort");
  const price = document.getElementById("price");
  const priceLabel = document.getElementById("price-label");
  const count = document.getElementById("result-count");
  const filters = document.getElementById("filters");

  // Preselect category from the URL: shop.html?cat=women
  const urlCat = new URLSearchParams(location.search).get("cat");
  if (urlCat) {
    const radio = document.querySelector(`input[name="cat"][value="${urlCat}"]`);
    if (radio) radio.checked = true;
  }

  function render() {
    const cat = document.querySelector('input[name="cat"]:checked').value;
    const q = search.value.trim().toLowerCase();
    const max = Number(price.value);
    priceLabel.textContent = "₹" + max;

    let list = PRODUCTS.filter((p) =>
      (cat === "all" || p.category === cat) &&
      p.price <= max &&
      (p.name.toLowerCase().includes(q) || p.category.includes(q) || p.type.includes(q))
    );

    switch (sort.value) {
      case "low": list.sort((a, b) => a.price - b.price); break;
      case "high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    count.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty"><div class="emoji">🔍</div><h3>No products found</h3><p>Try changing your filters.</p></div>`;
    observeReveals();
  }

  document.querySelectorAll('input[name="cat"]').forEach((r) => r.addEventListener("change", render));
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  price.addEventListener("input", render);

  document.getElementById("reset").addEventListener("click", () => {
    document.querySelector('input[name="cat"][value="all"]').checked = true;
    search.value = ""; price.value = 3000; sort.value = "featured";
    render();
  });

  document.getElementById("filter-toggle").addEventListener("click", () => filters.classList.toggle("open"));

  render();
});
