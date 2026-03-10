import { useState, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════
//  CONFIG & PRO DATA SEEDING
// ═══════════════════════════════════════════════════════════════════
const BRAND = "MONOLITH";
const ADMIN_PASS = "admin123";
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const CATEGORIES = ["ALL", "SHIRTS", "TROUSERS", "KNITWEAR", "JACKETS"];

const SEED = [
  {
    id: "s1", name: "Oxford Dress Shirt", category: "SHIRTS", price: 2499, was: 3299,
    rating: 4.8, reviewCount: 124,
    desc: "Premium 120-count Egyptian cotton with a semi-spread collar and hand-sewn mother-of-pearl buttons.",
    details: ["100% Egyptian Cotton", "Mother-of-pearl buttons", "Semi-spread collar", "Machine washable 30°C"],
    bg: "linear-gradient(145deg,#e8ddd0,#c4b4a4,#a89888)",
    sizes: [{ s: "XS", q: 2 }, { s: "S", q: 5 }, { s: "M", q: 0 }, { s: "L", q: 3 }, { s: "XL", q: 1 }, { s: "XXL", q: 0 }],
  },
  {
    id: "s2", name: "Slim Fit Chinos", category: "TROUSERS", price: 3299, was: null,
    rating: 4.5, reviewCount: 89,
    desc: "Stretch-cotton twill for an impeccable fit that moves with you. Refined style meets all-day comfort.",
    details: ["98% Cotton 2% Elastane", "Slim fit", "Four-pocket design", "Machine washable"],
    bg: "linear-gradient(145deg,#c8b890,#a89868,#887848)",
    sizes: [{ s: "28", q: 3 }, { s: "30", q: 4 }, { s: "32", q: 0 }, { s: "34", q: 2 }, { s: "36", q: 0 }, { s: "38", q: 1 }],
  },
  {
    id: "s3", name: "Merino Crewneck", category: "KNITWEAR", price: 4999, was: 6499,
    rating: 4.9, reviewCount: 210,
    desc: "Ultra-fine 18.5-micron Merino wool. Exceptional softness and natural temperature regulation.",
    details: ["100% Merino Wool 18.5μ", "Ribbed collar & cuffs", "Regular fit", "Dry clean recommended"],
    bg: "linear-gradient(145deg,#2c3e5a,#1a2840,#0d1828)",
    sizes: [{ s: "S", q: 0 }, { s: "M", q: 3 }, { s: "L", q: 2 }, { s: "XL", q: 4 }],
  },
];

const SHIPPING = {
  "India": { cost: 0, label: "Free Standard Delivery", days: "3–5 business days" },
  "Rest of World": { cost: 1499, label: "DHL Express", days: "7–12 business days" },
};

// ═══════════════════════════════════════════════════════════════════
//  STYLING SYSTEM (H&M / AMAZON MINIMALISM)
// ═══════════════════════════════════════════════════════════════════
const C = {
  bg: "#ffffff", card: "#f9f9f9", border: "#e5e5e5", text: "#111111", 
  muted: "#707070", gold: "#222222", error: "#ba0d0d", success: "#008a00"
};

const goldBtn = (extra = {}) => ({
  background: "#111", color: "#fff", border: "none", cursor: "pointer",
  padding: "16px 32px", fontSize: "12px", fontWeight: "600",
  letterSpacing: "0.1em", textTransform: "uppercase", transition: "0.2s", ...extra
});

// ═══════════════════════════════════════════════════════════════════
//  CORE APPLICATION
// ═══════════════════════════════════════════════════════════════════
export default function ProStore() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState(SEED);
  const [cart, setCart] = useState([]);
  const [curProduct, setCurProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selSize, setSelSize] = useState(null);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === "ALL" || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory, products]);

  const addToCart = (product, size) => {
    if (!size) return alert("Please select a size");
    setCart(prev => [...prev, { ...product, size, cartId: Date.now() }]);
    setPage("cart");
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: C.text, backgroundColor: C.bg }}>
      <NavBar 
        cartCount={cart.length} 
        setPage={setPage} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {page === "home" && (
        <HomePage 
          products={filteredProducts} 
          setPage={setPage} 
          setCurProduct={setCurProduct} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
        />
      )}

      {page === "product" && (
        <ProductPage 
          p={curProduct} 
          selSize={selSize} 
          setSelSize={setSelSize} 
          onAdd={addToCart} 
        />
      )}

      {page === "cart" && (
        <CartPage cart={cart} setCart={setCart} setPage={setPage} />
      )}
      
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function NavBar({ cartCount, setPage, searchQuery, setSearchQuery }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "10px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 onClick={() => setPage("home")} style={{ cursor: "pointer", letterSpacing: "4px", fontSize: "24px", fontWeight: "800" }}>{BRAND}</h1>
        
        <div style={{ flex: 1, margin: "0 60px", position: "relative" }}>
          <input 
            type="text" 
            placeholder="Search for items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "12px 40px", borderRadius: "4px", border: `1px solid ${C.border}`, backgroundColor: "#f4f4f4", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <span style={{ cursor: "pointer", fontSize: "14px" }} onClick={() => setPage("home")}>Sign In</span>
          <div onClick={() => setPage("cart")} style={{ position: "relative", cursor: "pointer" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-10px", background: "#ff3f6c", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "10px" }}>{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}

function HomePage({ products, setPage, setCurProduct, activeCategory, setActiveCategory }) {
  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px" }}>
      {/* Category Pills */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "40px", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: "10px 24px", borderRadius: "20px", border: `1px solid ${activeCategory === cat ? "#000" : C.border}`,
              background: activeCategory === cat ? "#000" : "#fff", color: activeCategory === cat ? "#fff" : "#000",
              cursor: "pointer", fontSize: "13px", fontWeight: "500"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {products.map(p => (
          <div 
            key={p.id} 
            style={{ cursor: "pointer" }}
            onClick={() => { setCurProduct(p); setPage("product"); }}
          >
            <div style={{ height: "400px", backgroundColor: "#f0f0f0", backgroundImage: p.bg, marginBottom: "15px", position: "relative", overflow: "hidden" }}>
              {p.was && <span style={{ position: "absolute", top: "10px", left: "10px", background: "#fff", padding: "4px 8px", fontSize: "12px", fontWeight: "bold" }}>SALE</span>}
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "5px" }}>{p.name}</h3>
            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "8px" }}>{p.category}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "700" }}>{fmt(p.price)}</span>
              {p.was && <span style={{ color: C.muted, textDecoration: "line-through", fontSize: "13px" }}>{fmt(p.was)}</span>}
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#ffa41c" }}>
              {"★".repeat(Math.floor(p.rating))}{"☆".repeat(5 - Math.floor(p.rating))}
              <span style={{ color: C.muted, marginLeft: "5px" }}>({p.reviewCount})</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function ProductPage({ p, selSize, setSelSize, onAdd }) {
  return (
    <div style={{ maxWidth: "1200px", margin: "60px auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "80px", padding: "0 40px" }}>
      <div style={{ height: "700px", background: p.bg, border: `1px solid ${C.border}` }}></div>
      
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px" }}>{p.name}</h1>
        <p style={{ fontSize: "18px", color: C.muted, marginBottom: "20px" }}>{p.category}</p>
        
        <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "30px" }}>
          {fmt(p.price)}
          <span style={{ fontSize: "14px", color: C.success, marginLeft: "15px" }}>Inclusive of all taxes</span>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontWeight: "600", marginBottom: "15px" }}>SELECT SIZE</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {p.sizes.map(sz => (
              <button 
                key={sz.s}
                disabled={sz.q === 0}
                onClick={() => setSelSize(sz.s)}
                style={{
                  width: "60px", height: "45px", border: `1px solid ${selSize === sz.s ? "#000" : C.border}`,
                  background: selSize === sz.s ? "#000" : "#fff", color: selSize === sz.s ? "#fff" : "#000",
                  cursor: sz.q === 0 ? "not-allowed" : "pointer", opacity: sz.q === 0 ? 0.3 : 1
                }}
              >
                {sz.s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onAdd(p, selSize)} style={goldBtn({ width: "100%", marginBottom: "20px" })}>
          Add to Bag
        </button>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "30px", marginTop: "30px" }}>
          <p style={{ fontWeight: "700", marginBottom: "15px" }}>PRODUCT STORY</p>
          <p style={{ lineHeight: "1.8", color: C.muted }}>{p.desc}</p>
          <ul style={{ marginTop: "20px", paddingLeft: "20px" }}>
            {p.details.map((d, i) => <li key={i} style={{ marginBottom: "8px", color: C.muted }}>{d}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, setCart, setPage }) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div style={{ maxWidth: "1000px", margin: "60px auto", padding: "0 40px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "40px" }}>Shopping Bag ({cart.length})</h2>
      
      {cart.length === 0 ? (
        <p>Your bag is empty. <span onClick={() => setPage("home")} style={{ color: "blue", cursor: "pointer" }}>Shop now.</span></p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "50px" }}>
          <div>
            {cart.map(item => (
              <div key={item.cartId} style={{ display: "flex", gap: "20px", marginBottom: "30px", paddingBottom: "30px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: "120px", height: "150px", background: item.bg }}></div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: "600" }}>{item.name}</h3>
                  <p style={{ color: C.muted, fontSize: "14px", marginTop: "5px" }}>Size: {item.size}</p>
                  <p style={{ fontWeight: "700", marginTop: "15px" }}>{fmt(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ background: "#f9f9f9", padding: "30px", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Subtotal</span><span>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span>Shipping</span><span style={{ color: C.success }}>FREE</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "18px", borderTop: `1px solid ${C.border}`, paddingTop: "20px" }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
            <button style={goldBtn({ width: "100%", marginTop: "30px" })}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#111", color: "#fff", padding: "60px 40px", marginTop: "100px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px" }}>
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "14px" }}>SHOP</h4>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Men</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Women</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Kids</p>
        </div>
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "14px" }}>CORPORATE INFO</h4>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Career at Monolith</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>About Us</p>
        </div>
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "14px" }}>HELP</h4>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Customer Service</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Legal & Privacy</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Contact Us</p>
        </div>
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "14px" }}>NEWSLETTER</h4>
          <p style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.6" }}>Sign up now and be the first to know about new arrivals and exclusive offers.</p>
        </div>
      </div>
    </footer>
  );
}