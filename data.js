// ============ Product data ============
// Each product has no photo by default: a coloured SVG garment is drawn instead.
// To use a real photo, add:  image: "images/my-photo.jpg"  to any product.

const PRODUCTS = [
  { id: 1,  name: "Classic White Tee",      category: "men",         type: "tshirt", color: "#f9fafb", price: 599,  oldPrice: 799,  rating: 4.5, badge: "Bestseller", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp6zWWVontzej29gZKrlCjwR9ogPCWk7OSl1ay954kbI7PZMdzXl5p4mCr&s=10" },
  { id: 2,  name: "Urban Black Hoodie",     category: "men",         type: "hoodie", color: "#1f2937", price: 1499, oldPrice: 1999, rating: 4.7, badge: "New", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsf5QlvySdhW8Cgf1m5GA3OgIWjbhAMCaaUTQa84mJLOJ2j76euUwcA3o&s=10" },
  { id: 3,  name: "Slim Fit Blue Jeans",    category: "men",         type: "jeans",  color: "#3b82f6", price: 1299, oldPrice: 1699, rating: 4.3, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2AL8MJwM_br6OCBe8dnPvtm3E6nsQdKqtEUYqLAYjTDzg_ot5Iq19_c_u&s=10" },
  { id: 4,  name: "Olive Bomber Jacket",    category: "men",         type: "jacket", color: "#657a4a", price: 2299, oldPrice: 2999, rating: 4.6, badge: "-25%", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNTY7NnhYZVlgFYTzy1zRSJ-6rEnqfVRDH4OIoIS3Ow2M3DdhGDuxw97Y&s=10" },
  { id: 5,  name: "Floral Summer Dress",    category: "women",       type: "dress",  color: "#f472b6", price: 1599, oldPrice: 2099, rating: 4.8, badge: "Trending", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwn8XItxazso9ugUNbnSgv5D4MWo9ebhPtY3O78UGGU5mCv_-jo11c_acl&s=10" },
  { id: 6,  name: "Rose Pink Hoodie",       category: "women",       type: "hoodie", color: "#fda4af", price: 1399, oldPrice: 1799, rating: 4.4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6lGyiCRiQ-YFBFN47xAC95YlTpkLREPpPiMCi5kJdB9IY6IGqqiCiO1n3&s=10" },
  { id: 7,  name: "High-Rise Denim",        category: "women",       type: "jeans",  color: "#60a5fa", price: 1399, oldPrice: 1899, rating: 4.5, image: "https://www.only.in/cdn/shop/files/902180501_g0_a8a486d4-283a-4049-aa36-83f0a1431055.jpg?v=1755595153&width=2048"},
  { id: 8,  name: "Mustard Crop Tee",       category: "women",       type: "tshirt", color: "#fbbf24", price: 549,  oldPrice: 749,  rating: 4.2, badge: "New", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQYb8ujleaS5FqvBtKnftO8kKIOQWeLC120iGjnzkKTZHG4xhOtN_I62wX&s=10" },
  { id: 9,  name: "Kids Dino Tee",          category: "kids",        type: "tshirt", color: "#34d399", price: 399,  oldPrice: 549,  rating: 4.6 , image: "https://m.media-amazon.com/images/I/718QmIN257L.jpg"},
  { id: 10, name: "Kids Rainbow Hoodie",    category: "kids",        type: "hoodie", color: "#a78bfa", price: 899,  oldPrice: 1199, rating: 4.7, badge: "Cute", image: "https://m.media-amazon.com/images/I/711hARfyVTL._AC_UY1100_.jpg" },
  { id: 11, name: "Street Snapback Cap",    category: "accessories", type: "cap",    color: "#ef4444", price: 449,  oldPrice: 649,  rating: 4.1, image: "https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2025/JULY/7/2n0YOrXc_484366fe1a854d46a451f28b4302df77.jpg" },
  { id: 12, name: "Denim Bucket Cap",       category: "accessories", type: "cap",    color: "#6366f1", price: 499,  oldPrice: 699,  rating: 4.3, badge: "-30%", image: "https://www.ownd.in/cdn/shop/files/8909429649666_1_34b16d4e-7dbb-4eda-a194-ac3614dfbfd3.jpg?v=1782981027&width=1200" },
  { id: 13, name: "Navy Casual Tee",        category: "men",         type: "tshirt", color: "#1e3a8a", price: 649,  oldPrice: 849,  rating: 4.4, image: "https://assets.ajio.com/medias/sys_master/root/20250328/2zf2/67e5ab877a6cd4182f8cd57b/-473Wx593H-701384568-navy-MODEL.jpg" },
  { id: 14, name: "Wine Party Dress",       category: "women",       type: "dress",  color: "#9f1239", price: 2199, oldPrice: 2899, rating: 4.9, badge: "Premium", image: "https://images.meesho.com/images/products/844022647/3dszb_512.webp?width=512" },
  { id: 15, name: "Grey Zip Jacket",        category: "women",       type: "jacket", color: "#9ca3af", price: 1899, oldPrice: 2499, rating: 4.5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCPugWoydlz3qJ7QbeL99m-_O_k-Jd9D4cgQtRVUyyVMtjBfKcmo9VqT0&s=10" },
  { id: 16, name: "Kids Denim Jeans",       category: "kids",        type: "jeans",  color: "#38bdf8", price: 799,  oldPrice: 999,  rating: 4.2, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBwFmUuCV1gYB11WY4L0wOgOuoUk2HRDSU8cnvRM_3Ux07vtAxfhwskro&s=10" }
];

const CATEGORIES = [
  { key: "men",         label: "Men",         emoji: "👔" },
  { key: "women",       label: "Women",       emoji: "👗" },
  { key: "kids",        label: "Kids",        emoji: "🧒" },
  { key: "accessories", label: "Accessories", emoji: "🧢" }
];

const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off applied" },
  STYLE20: { type: "percent", value: 20, label: "20% off applied" },
  FLAT200: { type: "flat", value: 200, label: "₹200 off applied" }
};

const FREE_SHIPPING_ABOVE = 1999;
const SHIPPING_FEE = 79;
