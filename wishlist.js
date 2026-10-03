// ============ Wishlist page ============
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wish-grid");

  function render() {
    const list = Wishlist.get().map(findProduct).filter(Boolean);
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty"><div class="emoji">♡</div><h3>Your wishlist is empty</h3>
         <p style="margin-bottom:16px">Tap the heart on any product to save it here.</p>
         <a href="shop.html" class="btn btn-accent">Browse Products</a></div>`;
    observeReveals();
  }

  // main.js fires this after a heart is toggled, so removed items disappear
  document.addEventListener("wishlist:changed", () => setTimeout(render, 150));
  render();
});
