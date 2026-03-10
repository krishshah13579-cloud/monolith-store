import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════
//  UTILITIES & THEME
// ═══════════════════════════════════════════════════════════════════
const BRAND = "MONOLITH";
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const C = {
  bg: "#ffffff",
  border: "#e5e5e5",
  text: "#111111",
  muted: "#707070",
  accent: "#111111",
  sale: "#ba0d0d"
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function MonolithPro() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [curProduct, setCurProduct] = useState(null);
  const [search, setSearch] = useState("");

  // Sample data with valid image placeholders for testing
  const products = [
    {
      id: "s1", name: "Premium Oxford Shirt", category: "SHIRTS", price: 2499, was: 3299,
      img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&w=800&q=80",
      desc: "A timeless classic crafted from heavy-weight cotton. Features a button-down collar and a tailored fit.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "s2", name: "Slim Fit Chinos", category: "TROUSERS", price: 3499, was: null,
      img: "https://images.unsplash.com/photo-1624371414361-e6e8ea02c1e2?auto=format&fit=crop&w=800&q=80",
      desc: "Superior stretch-twill fabric designed for movement and style.",
      sizes: ["30", "32", "34", "36"]
    }
  ];

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* --- STICKY HEADER --- */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "#fff", borderBottom: `1px solid ${C.border}`, padding: "15px 5%" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 onClick={() => setPage("home")} style={{ cursor: "pointer", letterSpacing: "3px", fontSize: "22px", fontWeight: "900", margin: 0 }}>{BRAND}</h1>
          
          <div style={{ flex: 1, margin: "0 40px", maxWidth: "600px" }}>
            <input 
              placeholder="Search products..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 20px", borderRadius: "4px", border: `1px solid ${C.border}`, backgroundColor: "#f5f5f5" }}
            />
          </div>

          <div style={{ display: "flex", gap: "25px", fontWeight: "500", fontSize: "14px" }}>
            <span style={{ cursor: "pointer" }} onClick={() => setPage("cart")}>CART ({cart.length})</span>
          </div>
        </div>
      </header>

      {/* --- PAGE CONTENT --- */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 5%" }}>
        {page === "home" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px 25px" }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => { setCurProduct(p); setPage("detail"); }} style={{ cursor: "pointer" }}>
                <div style={{ aspectRatio: "3/4", backgroundColor: "#f0f0f0", overflow: "hidden", marginBottom: "15px" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "5px" }}>{p.name}</h3>
                <div style={{ display: "flex", gap: "10px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "700" }}>{fmt(p.price)}</span>
                  {p.was && <span style={{ color: C.muted, textDecoration: "line-through" }}>{fmt(p.was)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {page === "detail" && curProduct && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "60px", alignItems: "flex-start" }}>
            {/* Image Gallery Side */}
            <div style={{ flex: "1 1 500px" }}>
              <div style={{ aspectRatio: "3/4", backgroundColor: "#f0f0f0", border: `1px solid ${C.border}` }}>
                <img src={curProduct.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Info Side */}
            <div style={{ flex: "1 1 400px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>{curProduct.name}</h1>
              <p style={{ fontSize: "20px", fontWeight: "500", marginBottom: "30px" }}>{fmt(curProduct.price)}</p>
              
              <div style={{ marginBottom: "40px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>SELECT SIZE</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {curProduct.sizes.map(s => (
                    <button key={s} style={{ padding: "12px 20px", border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setCart([...cart, curProduct]); setPage("cart"); }}
                style={{ width: "100%", padding: "18px", backgroundColor: "#000", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", marginBottom: "30px" }}
              >
                ADD TO BAG
              </button>

              <p style={{ lineHeight: "1.6", color: C.muted, fontSize: "14px" }}>{curProduct.desc}</p>
            </div>
          </div>
        )}

        {page === "cart" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "40px" }}>Your Shopping Bag</h2>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
                <img src={item.img} style={{ width: "80px", height: "110px", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                  <p style={{ fontWeight: "700" }}>{fmt(item.price)}</p>
                </div>
                <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>Remove</button>
              </div>
            ))}
            <div style={{ marginTop: "40px", textAlign: "right" }}>
              <p style={{ fontSize: "20px", fontWeight: "700" }}>Total: {fmt(cart.reduce((a, b) => a + b.price, 0))}</p>
              <button style={{ marginTop: "20px", padding: "15px 40px", backgroundColor: "#000", color: "#fff", border: "none", fontWeight: "700" }}>CHECKOUT</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}