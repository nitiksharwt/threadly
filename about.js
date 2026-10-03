// ============ About page ============
document.addEventListener("DOMContentLoaded", () => {
  /* Decorative garments */
const photos = [
  { src: "https://static.vecteezy.com/system/resources/thumbnails/034/969/304/small/ai-generated-t-shirt-mockup-clip-art-free-png.png", alt: "T-shirt" },
  { src: "https://png.pngtree.com/png-clipart/20250820/original/pngtree-men-s-straight-leg-blue-jeans-isolated-on-transparent-background-png-image_21273189.png",  alt: "Jeans" },
  { src: "https://png.pngtree.com/png-vector/20230430/ourmid/pngtree-dress-styling-creative-clothing-png-image_6747137.png",  alt: "Dress" },
  { src: "https://png.pngtree.com/png-vector/20250104/ourmid/pngtree-navy-blue-hoodie-blank-mockup-transparent-background-png-image_15044905.png", alt: "Hoodie" }
];

document.getElementById("about-art").innerHTML = photos
  .map(p => `<img src="${p.src}" alt="${p.alt}" loading="lazy">`)
  .join("");

  /* Animated counters – start when scrolled into view */
  const counters = document.querySelectorAll("[data-count]");
  function animate(el) {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * t).toLocaleString("en-IN") + (t === 1 && target >= 1000 ? "+" : "");
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = Number(c.dataset.count).toLocaleString("en-IN")));
  }
});
