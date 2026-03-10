import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════

const BRAND = "MONOLITH";
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const PRODUCTS = [
  {
    id: "p1", name: "Oxford Dress Shirt", category: "SHIRTS",
    price: 2499, was: 3299,
    desc: "Crafted from premium 120-count Egyptian cotton with a semi-spread collar and hand-sewn mother-of-pearl buttons. The flawless foundation for a formal or smart-casual ensemble.",
    details: ["100% Egyptian Cotton","Mother-of-pearl buttons","Semi-spread collar","Machine washable 30°C"],
    bg: "linear-gradient(145deg,#e8ddd0 0%,#c4b4a4 55%,#a89888 100%)",
    sizes: [{ s:"XS",q:2 },{ s:"S",q:5 },{ s:"M",q:0 },{ s:"L",q:3 },{ s:"XL",q:1 },{ s:"XXL",q:0 }],
  },
  {
    id: "p2", name: "Slim Fit Chinos", category: "TROUSERS",
    price: 3299, was: null,
    desc: "Tailored from stretch-cotton twill for an impeccable fit that moves with you through every moment. Refined style meets all-day comfort in one essential cut.",
    details: ["98% Cotton, 2% Elastane","Slim fit silhouette","Four-pocket design","Machine washable"],
    bg: "linear-gradient(145deg,#c8b890 0%,#a89868 55%,#887848 100%)",
    sizes: [{ s:"28",q:3 },{ s:"30",q:4 },{ s:"32",q:0 },{ s:"34",q:2 },{ s:"36",q:0 },{ s:"38",q:1 }],
  },
  {
    id: "p3", name: "Merino Wool Crewneck", category: "KNITWEAR",
    price: 4999, was: 6499,
    desc: "Spun from ultra-fine 18.5-micron Merino wool for exceptional softness and natural temperature regulation. A timeless silhouette built for the discerning gentleman.",
    details: ["100% Merino Wool (18.5 micron)","Ribbed collar, cuffs & hem","Regular fit","Dry clean recommended"],
    bg: "linear-gradient(145deg,#2c3e5a 0%,#1a2840 55%,#0d1828 100%)",
    sizes: [{ s:"S",q:0 },{ s:"M",q:3 },{ s:"L",q:2 },{ s:"XL",q:4 },{ s:"XXL",q:1 }],
  },
  {
    id: "p4", name: "Tailored Wool Blazer", category: "JACKETS",
    price: 8499, was: null,
    desc: "Classic single-breasted silhouette in fine wool-blend fabric. Fully canvassed with hand-stitched lapels. The pinnacle of understated, enduring elegance.",
    details: ["70% Wool, 30% Polyester","Fully canvassed construction","Hand-stitched lapels","Dry clean only"],
    bg: "linear-gradient(145deg,#3a3a3a 0%,#252525 55%,#141414 100%)",
    sizes: [{ s:"38R",q:1 },{ s:"40R",q:2 },{ s:"42R",q:0 },{ s:"44R",q:3 },{ s:"46R",q:0 }],
  },
  {
    id: "p5", name: "Linen Casual Shirt", category: "SHIRTS",
    price: 1999, was: 2499,
    desc: "Woven from premium Belgian linen that breathes beautifully in warm weather. A relaxed fit with subtle texture that only deepens in character with every wash.",
    details: ["100% Belgian Linen","Relaxed fit","Mother-of-pearl buttons","Machine washable"],
    bg: "linear-gradient(145deg,#d4c8b0 0%,#b8a888 55%,#9c8a6a 100%)",
    sizes: [{ s:"S",q:4 },{ s:"M",q:6 },{ s:"L",q:0 },{ s:"XL",q:2 },{ s:"XXL",q:0 }],
  },
  {
    id: "p6", name: "Selvedge Denim Jacket", category: "JACKETS",
    price: 5499, was: null,
    desc: "Crafted from 12oz Japanese selvedge denim with a vintage-inspired fade. Features solid copper rivets and a custom-woven lining. A piece that grows more beautiful with age.",
    details: ["12oz Japanese Selvedge Denim","Copper rivets","Custom woven lining","Machine wash cold"],
    bg: "linear-gradient(145deg,#3a4a6a 0%,#2a3858 55%,#1a2844 100%)",
    sizes: [{ s:"S",q:0 },{ s:"M",q:2 },{ s:"L",q:3 },{ s:"XL",q:1 },{ s:"XXL",q:2 }],
  },
];

const SHIPPING_DB = {
  "India":                 { cost:99,   label:"Standard Delivery",   days:"3–5 business days" },
  "Bangladesh":            { cost:399,  label:"South Asia Express",   days:"5–8 business days" },
  "Sri Lanka":             { cost:399,  label:"South Asia Express",   days:"5–8 business days" },
  "Nepal":                 { cost:399,  label:"South Asia Express",   days:"5–8 business days" },
  "Pakistan":              { cost:399,  label:"South Asia Express",   days:"5–8 business days" },
  "Maldives":              { cost:499,  label:"Island Express",       days:"7–10 business days" },
  "Bhutan":                { cost:399,  label:"South Asia Express",   days:"5–8 business days" },
  "United Arab Emirates":  { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Saudi Arabia":          { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Qatar":                 { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Kuwait":                { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Bahrain":               { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Oman":                  { cost:799,  label:"Gulf Express",         days:"5–7 business days" },
  "Singapore":             { cost:999,  label:"Asia Pacific",         days:"5–10 business days" },
  "Malaysia":              { cost:999,  label:"Asia Pacific",         days:"5–10 business days" },
  "Japan":                 { cost:1099, label:"Asia Pacific",         days:"7–12 business days" },
  "Hong Kong":             { cost:999,  label:"Asia Pacific",         days:"5–10 business days" },
  "Thailand":              { cost:999,  label:"Asia Pacific",         days:"6–11 business days" },
  "Indonesia":             { cost:1099, label:"Asia Pacific",         days:"7–12 business days" },
  "Philippines":           { cost:1099, label:"Asia Pacific",         days:"7–12 business days" },
  "United States":         { cost:1499, label:"International DHL",    days:"7–14 business days" },
  "United Kingdom":        { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "Canada":                { cost:1499, label:"International DHL",    days:"7–14 business days" },
  "Australia":             { cost:1399, label:"International DHL",    days:"8–14 business days" },
  "New Zealand":           { cost:1499, label:"International DHL",    days:"9–15 business days" },
  "Germany":               { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "France":                { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "Italy":                 { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "Spain":                 { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "Netherlands":           { cost:1299, label:"International DHL",    days:"7–12 business days" },
  "Switzerland":           { cost:1399, label:"International DHL",    days:"7–12 business days" },
  "Rest of World":         { cost:1499, label:"International Freight", days:"10–18 business days" },
};
const COUNTRY_LIST = Object.keys(SHIPPING_DB).sort();

// ═══════════════════════════════════════════════════════════
//  STORAGE HELPERS
// ═══════════════════════════════════════════════════════════

function defaultInv() {
  const inv = {};
  PRODUCTS.forEach(p => { inv[p.id] = {}; p.sizes.forEach(sz => { inv[p.id][sz.s] = sz.q; }); });
  return inv;
}
async function loadInv() {
  try { const r = await window.storage.get("mn_inv_v1"); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function saveInv(inv) {
  try { await window.storage.set("mn_inv_v1", JSON.stringify(inv)); } catch {}
}

// ═══════════════════════════════════════════════════════════
//  PALETTE
// ═══════════════════════════════════════════════════════════

const C = {
  bg:"#090909", surface:"#111", card:"#161616", border:"#232323",
  gold:"#c9a84c", goldLight:"rgba(201,168,76,0.12)",
  text:"#f0e8d8", muted:"#666", dim:"#3a3a3a",
  error:"#d95f5f", success:"#5aaa7a",
};

// ═══════════════════════════════════════════════════════════
//  SHARED STYLES
// ═══════════════════════════════════════════════════════════

const labelSt = { display:"block", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.muted, marginBottom:8, fontWeight:400 };
const inputSt = { width:"100%", background:"#0c0c0c", border:`1px solid ${C.border}`, color:C.text, padding:"11px 14px", fontSize:13, outline:"none", fontFamily:"'Jost',sans-serif", transition:"border-color 0.2s" };
const summRow = { display:"flex", justifyContent:"space-between", alignItems:"center", color:C.text };
const goldBtnSt = { background:C.gold, color:C.bg, border:"none", cursor:"pointer", padding:"14px 32px", fontSize:10, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" };
const qtyBtnSt = { width:30, height:30, background:"transparent", border:`1px solid ${C.border}`, color:C.text, cursor:"pointer", fontSize:14, lineHeight:1, fontFamily:"'Jost',sans-serif" };
const navLinkSt = { background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:11, fontWeight:400, letterSpacing:"0.14em", textTransform:"uppercase", padding:"4px 0", fontFamily:"'Jost',sans-serif" };

// ═══════════════════════════════════════════════════════════
//  SECTION WRAPPER
// ═══════════════════════════════════════════════════════════

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:36 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:400, color:C.text, marginBottom:20, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════

function HomePage({ inv, onOpen }) {
  return (
    <div>
      {/* Hero */}
      <div style={{
        height:"58vh", position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#0d0d0d 0%,#14110a 60%,#1a1510 100%)",
        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
        borderBottom:`1px solid ${C.border}`, textAlign:"center",
      }}>
        {/* grid lines */}
        {[...Array(9)].map((_,i) => (
          <div key={i} style={{ position:"absolute", top:0, bottom:0, left:`${(i+1)*10}%`, width:1, background:C.gold, opacity:0.03 }} />
        ))}
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:"0.55em", color:C.gold, marginBottom:22, textTransform:"uppercase", animation:"fadeUp 0.7s ease both" }}>
          Autumn — Winter 2025
        </p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:78, fontWeight:300, letterSpacing:"0.12em", color:C.text, lineHeight:1.0, textTransform:"uppercase", animation:"fadeUp 0.7s 0.1s ease both" }}>
          The New<br /><em style={{ fontStyle:"italic", color:C.gold }}>Collection</em>
        </h1>
        <p style={{ marginTop:28, fontSize:11, letterSpacing:"0.28em", color:C.muted, textTransform:"uppercase", animation:"fadeUp 0.7s 0.2s ease both" }}>
          Refined Menswear — Uncompromising Quality
        </p>
        {/* decorative corner marks */}
        {["topLeft","topRight","bottomLeft","bottomRight"].map((pos,i) => (
          <div key={i} style={{
            position:"absolute",
            ...(pos.includes("top") ? { top:24 } : { bottom:24 }),
            ...(pos.includes("Left") ? { left:32 } : { right:32 }),
            width:20, height:20,
            borderTop: pos.includes("top") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderBottom: pos.includes("bottom") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderLeft: pos.includes("Left") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderRight: pos.includes("Right") ? `1px solid rgba(201,168,76,0.3)` : "none",
          }} />
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"72px 32px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:40 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, color:C.text }}>
            All Products
          </h2>
          <span style={{ fontSize:11, color:C.muted, letterSpacing:"0.15em" }}>
            {PRODUCTS.length} PIECES
          </span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {PRODUCTS.map((p, idx) => {
            const hasAny = p.sizes.some(sz => (inv[p.id]?.[sz.s] ?? sz.q) > 0);
            return (
              <ProductCard key={p.id} product={p} hasAny={hasAny} idx={idx} onClick={() => onOpen(p)} />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"36px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:48 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, letterSpacing:"0.35em", color:C.gold }}>{BRAND}</span>
        <p style={{ fontSize:11, color:C.dim, letterSpacing:"0.08em" }}>© 2025 Monolith Menswear. All rights reserved.</p>
        <p style={{ fontSize:11, color:C.dim }}>Free returns on all domestic orders</p>
      </footer>
    </div>
  );
}

function ProductCard({ product: p, hasAny, idx, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor:"pointer", background:C.card,
        border:`1px solid ${hov ? C.gold : C.border}`,
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition:"all 0.35s ease",
        animation:`fadeUp 0.5s ${idx*0.07}s ease both`,
        overflow:"hidden",
      }}
    >
      <div style={{ height:240, background:p.bg, position:"relative", overflow:"hidden" }}>
        {!hasAny && (
          <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.85)", color:C.error, fontSize:9, fontWeight:600, letterSpacing:"0.18em", padding:"5px 10px", textTransform:"uppercase" }}>
            Sold Out
          </div>
        )}
        {p.was && hasAny && (
          <div style={{ position:"absolute", top:12, left:12, background:C.gold, color:C.bg, fontSize:9, fontWeight:700, letterSpacing:"0.12em", padding:"5px 10px", textTransform:"uppercase" }}>
            Sale
          </div>
        )}
        {/* Decorative circle */}
        <div style={{ position:"absolute", bottom:16, right:16, width:44, height:44, border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", transition:"transform 0.4s", transform: hov ? "scale(1.2)" : "scale(1)" }} />
      </div>
      <div style={{ padding:"18px 20px 22px" }}>
        <p style={{ fontSize:9, letterSpacing:"0.3em", color:C.gold, textTransform:"uppercase", marginBottom:7 }}>{p.category}</p>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:400, color:C.text, marginBottom:10 }}>{p.name}</h3>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:15, fontWeight:500, color:C.text }}>{fmt(p.price)}</span>
          {p.was && <span style={{ fontSize:12, color:C.muted, textDecoration:"line-through" }}>{fmt(p.was)}</span>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PRODUCT PAGE
// ═══════════════════════════════════════════════════════════

function ProductPage({ product: p, inv, size, setSize, onAdd, onBack }) {
  return (
    <div style={{ maxWidth:1080, margin:"0 auto", padding:"44px 32px", animation:"fadeUp 0.4s ease" }}>
      <button onClick={onBack} style={{ ...navLinkSt, display:"flex", alignItems:"center", gap:8, marginBottom:40, fontSize:11 }}>
        ← Back to Collection
      </button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
        {/* Product Image */}
        <div style={{ position:"relative" }}>
          <div style={{ height:520, background:p.bg, border:`1px solid ${C.border}`, position:"relative" }}>
            {p.was && (
              <div style={{ position:"absolute", top:20, left:20, background:C.gold, color:C.bg, fontSize:10, fontWeight:700, letterSpacing:"0.12em", padding:"6px 12px", textTransform:"uppercase" }}>
                Sale — Save {fmt(p.was - p.price)}
              </div>
            )}
            <div style={{ position:"absolute", bottom:20, right:20, width:60, height:60, border:"1px solid rgba(255,255,255,0.12)", borderRadius:"50%" }} />
            <div style={{ position:"absolute", top:20, right:20, width:30, height:30, border:"1px solid rgba(255,255,255,0.12)" }} />
          </div>
          <p style={{ marginTop:14, fontSize:11, color:C.muted, letterSpacing:"0.12em", textAlign:"center" }}>
            MONOLITH — AW25
          </p>
        </div>

        {/* Product Details */}
        <div style={{ paddingTop:6 }}>
          <p style={{ fontSize:10, letterSpacing:"0.32em", color:C.gold, textTransform:"uppercase", marginBottom:12 }}>{p.category}</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:400, color:C.text, lineHeight:1.05, marginBottom:22 }}>
            {p.name}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:26 }}>
            <span style={{ fontSize:24, fontWeight:500, color:C.text }}>{fmt(p.price)}</span>
            {p.was && <span style={{ fontSize:15, color:C.muted, textDecoration:"line-through" }}>{fmt(p.was)}</span>}
          </div>
          <p style={{ fontSize:13, color:"#aaa", lineHeight:1.75, marginBottom:32, fontWeight:300 }}>{p.desc}</p>

          {/* Size Selector */}
          <div style={{ marginBottom:32 }}>
            <p style={{ fontSize:10, letterSpacing:"0.22em", color:C.muted, textTransform:"uppercase", marginBottom:14 }}>
              Select Size {size && <span style={{ color:C.gold }}>— {size} selected</span>}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {p.sizes.map(sz => {
                const stock = inv[p.id]?.[sz.s] ?? sz.q;
                const soldOut = stock === 0;
                const sel = size === sz.s;
                return (
                  <SizeButton key={sz.s} label={sz.s} soldOut={soldOut} selected={sel}
                    onClick={() => !soldOut && setSize(sz.s)} />
                );
              })}
            </div>
            <p style={{ fontSize:11, color:C.muted, marginTop:10 }}>
              {size ? `${(inv[p.id]?.[size] ?? 0)} unit(s) available in ${size}` : "Select a size to check availability"}
            </p>
          </div>

          {/* Add to Bag */}
          <AddToBagButton onAdd={onAdd} />

          {/* Details */}
          <div style={{ marginTop:36, borderTop:`1px solid ${C.border}`, paddingTop:26 }}>
            <p style={{ fontSize:10, letterSpacing:"0.22em", color:C.muted, textTransform:"uppercase", marginBottom:16 }}>Product Details</p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {p.details.map((d,i) => (
                <li key={i} style={{ fontSize:13, color:"#999", fontWeight:300, display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:C.gold, flexShrink:0 }} />{d}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop:24, padding:"14px 18px", border:`1px solid ${C.border}`, background:C.goldLight }}>
            <p style={{ fontSize:11, color:C.gold, letterSpacing:"0.12em" }}>🚚 Free shipping on orders above ₹5,000 within India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeButton({ label, soldOut, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={soldOut}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:54, height:46, position:"relative", cursor: soldOut ? "default" : "pointer",
        border: selected ? `2px solid ${C.gold}` : `1px solid ${soldOut ? C.dim : (hov ? "#555" : "#2e2e2e")}`,
        background: selected ? C.goldLight : "transparent",
        color: soldOut ? "#3a3a3a" : selected ? C.gold : C.text,
        fontSize:12, fontWeight: selected ? 500 : 300, letterSpacing:"0.06em",
        transition:"all 0.2s", fontFamily:"'Jost',sans-serif",
      }}
    >
      {label}
      {soldOut && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(9,9,9,0.75)", fontSize:7, letterSpacing:"0.12em", color:C.error, fontWeight:600,
        }}>
          SOLD OUT
        </div>
      )}
    </button>
  );
}

function AddToBagButton({ onAdd }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onAdd}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:"100%", height:52, background: hov ? "#b89030" : C.gold, color:C.bg,
        border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
        letterSpacing:"0.28em", textTransform:"uppercase", transition:"background 0.2s",
        fontFamily:"'Jost',sans-serif",
      }}
    >
      Add to Bag
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
//  CART PAGE
// ═══════════════════════════════════════════════════════════

function CartPage({ cart, subtotal, shipping, total, country, onRemove, onQty, onCheckout, onShop }) {
  if (!cart.length) return (
    <div style={{ textAlign:"center", padding:"120px 32px", animation:"fadeUp 0.4s ease" }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, color:C.muted, marginBottom:10 }}>Your bag is empty</p>
      <p style={{ fontSize:13, color:C.dim, marginBottom:32 }}>Add some pieces to get started.</p>
      <button onClick={onShop} style={goldBtnSt}>Explore Collection</button>
    </div>
  );

  return (
    <div style={{ maxWidth:920, margin:"0 auto", padding:"48px 32px", animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:300, marginBottom:44 }}>
        Shopping Bag <span style={{ fontSize:18, color:C.muted }}>({cart.reduce((s,i)=>s+i.qty,0)})</span>
      </h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 350px", gap:52 }}>
        {/* Items */}
        <div>
          {cart.map(item => (
            <div key={`${item.pid}-${item.size}`} style={{ display:"flex", gap:18, padding:"22px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:88, height:88, background:item.bg, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, marginBottom:3 }}>{item.name}</p>
                <p style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", marginBottom:14 }}>Size: {item.size}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <button onClick={() => onQty(item.pid, item.size, -1)} style={qtyBtnSt}>−</button>
                    <span style={{ width:34, textAlign:"center", fontSize:13 }}>{item.qty}</span>
                    <button onClick={() => onQty(item.pid, item.size, +1)} style={qtyBtnSt}>+</button>
                  </div>
                  <span style={{ fontSize:15, fontWeight:500 }}>{fmt(item.price * item.qty)}</span>
                  <button onClick={() => onRemove(item.pid, item.size)} style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:26, height:"fit-content" }}>
          <p style={{ fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color:C.muted, marginBottom:22 }}>Order Summary</p>
          <div style={{ display:"flex", flexDirection:"column", gap:13, marginBottom:16 }}>
            <div style={summRow}><span style={{ fontSize:13 }}>Subtotal</span><span style={{ fontSize:13 }}>{fmt(subtotal)}</span></div>
            <div style={{ ...summRow }}>
              <div>
                <p style={{ fontSize:13 }}>Shipping</p>
                <p style={{ fontSize:11, color:C.gold, marginTop:2 }}>{country}</p>
              </div>
              <span style={{ fontSize:13, color:C.gold }}>{fmt(shipping.cost)}</span>
            </div>
            <div style={{ fontSize:11, color:C.dim }}>{shipping.label} · {shipping.days}</div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18, marginBottom:22, ...summRow, fontSize:17, fontWeight:600 }}>
            <span>Total</span><span style={{ color:C.gold }}>{fmt(total)}</span>
          </div>
          <button onClick={onCheckout} style={{ ...goldBtnSt, width:"100%", padding:"15px 0" }}>
            Proceed to Checkout
          </button>
          <p style={{ fontSize:10, color:C.dim, textAlign:"center", marginTop:12, letterSpacing:"0.08em" }}>
            Secure checkout · Free returns
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════

function CheckoutPage({ info, setInfo, pay, setPay, errors, setErrors, cart, subtotal, shipping, total, busy, onPlace, formatCard, formatExpiry, onBack }) {
  const field = (key, label, span2 = false, type = "text") => (
    <div style={{ gridColumn: span2 ? "span 2" : "span 1" }}>
      <label style={labelSt}>{label}</label>
      <input
        type={type}
        value={info[key]}
        onChange={e => { setInfo(p => ({...p, [key]:e.target.value})); setErrors(p => ({...p, [key]:""})); }}
        style={{ ...inputSt, borderColor: errors[key] ? C.error : C.border }}
      />
      {errors[key] && <p style={{ color:C.error, fontSize:11, marginTop:4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth:1040, margin:"0 auto", padding:"44px 32px", animation:"fadeUp 0.4s ease" }}>
      <button onClick={onBack} style={{ ...navLinkSt, display:"flex", alignItems:"center", gap:8, marginBottom:30, fontSize:11 }}>
        ← Back to Bag
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:52, alignItems:"start" }}>
        {/* Left: Forms */}
        <div>
          <Section title="Delivery Information">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {field("firstName","First Name",false)}
              {field("lastName","Last Name",false)}
              {field("email","Email Address",true,"email")}
              {field("phone","Phone Number",true,"tel")}
              {field("address","Street Address",true)}
              {field("city","City",false)}
              {field("state","State / Province",false)}
              {field("pincode","PIN / ZIP Code",false)}
              <div>
                <label style={labelSt}>Country</label>
                <select
                  value={info.country}
                  onChange={e => setInfo(p => ({...p, country:e.target.value}))}
                  style={{ ...inputSt, cursor:"pointer" }}
                >
                  {COUNTRY_LIST.map(c => <option key={c} value={c} style={{ background:"#1a1a1a" }}>{c}</option>)}
                </select>
              </div>
            </div>
            {/* Shipping banner */}
            <div style={{ marginTop:16, padding:"12px 16px", border:`1px solid rgba(201,168,76,0.25)`, background:C.goldLight, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ fontSize:12, color:C.gold, fontWeight:500 }}>{shipping.label}</p>
                <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{shipping.days}</p>
              </div>
              <span style={{ fontSize:14, color:C.gold, fontWeight:600 }}>{fmt(shipping.cost)}</span>
            </div>
          </Section>

          <Section title="Payment Details">
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {["VISA","MC","AMEX","RUPAY"].map(card => (
                <div key={card} style={{ padding:"5px 10px", border:`1px solid ${C.border}`, fontSize:9, letterSpacing:"0.1em", color:C.dim }}>{card}</div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ gridColumn:"span 2" }}>
                <label style={labelSt}>Name on Card</label>
                <input value={pay.name} onChange={e => { setPay(p => ({...p,name:e.target.value})); setErrors(p => ({...p,payName:""})); }}
                  style={{ ...inputSt, borderColor: errors.payName ? C.error : C.border }} />
                {errors.payName && <p style={{ color:C.error, fontSize:11, marginTop:4 }}>{errors.payName}</p>}
              </div>
              <div style={{ gridColumn:"span 2" }}>
                <label style={labelSt}>Card Number</label>
                <input
                  value={pay.number}
                  onChange={e => { setPay(p => ({...p,number:formatCard(e.target.value)})); setErrors(p => ({...p,payNum:""})); }}
                  placeholder="1234  5678  9012  3456"
                  maxLength={19}
                  style={{ ...inputSt, borderColor: errors.payNum ? C.error : C.border, letterSpacing:"0.12em" }}
                />
                {errors.payNum && <p style={{ color:C.error, fontSize:11, marginTop:4 }}>{errors.payNum}</p>}
              </div>
              <div>
                <label style={labelSt}>Expiry Date</label>
                <input
                  value={pay.expiry}
                  onChange={e => { setPay(p => ({...p,expiry:formatExpiry(e.target.value)})); setErrors(p => ({...p,payExp:""})); }}
                  placeholder="MM / YY" maxLength={5}
                  style={{ ...inputSt, borderColor: errors.payExp ? C.error : C.border }}
                />
                {errors.payExp && <p style={{ color:C.error, fontSize:11, marginTop:4 }}>{errors.payExp}</p>}
              </div>
              <div>
                <label style={labelSt}>CVV / CVC</label>
                <input
                  value={pay.cvv}
                  onChange={e => { setPay(p => ({...p,cvv:e.target.value.replace(/\D/g,"").slice(0,4)})); setErrors(p => ({...p,payCvv:""})); }}
                  type="password" placeholder="•••" maxLength={4}
                  style={{ ...inputSt, borderColor: errors.payCvv ? C.error : C.border }}
                />
                {errors.payCvv && <p style={{ color:C.error, fontSize:11, marginTop:4 }}>{errors.payCvv}</p>}
              </div>
            </div>
            <p style={{ fontSize:11, color:C.dim, marginTop:14, letterSpacing:"0.06em" }}>
              🔒 256-bit SSL encrypted · Your payment information is never stored
            </p>
          </Section>
        </div>

        {/* Right: Summary */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:26, position:"sticky", top:80 }}>
          <p style={{ fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color:C.muted, marginBottom:20 }}>Order Summary</p>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {cart.map(item => (
              <div key={`${item.pid}-${item.size}`} style={{ display:"flex", justifyContent:"space-between", marginBottom:14, alignItems:"start" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13 }}>{item.name}</p>
                  <p style={{ fontSize:10, color:C.dim, marginTop:2 }}>Size {item.size} × {item.qty}</p>
                </div>
                <span style={{ fontSize:13, marginLeft:12, flexShrink:0 }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, marginTop:4, display:"flex", flexDirection:"column", gap:11 }}>
            <div style={summRow}><span style={{ fontSize:13, color:C.muted }}>Subtotal</span><span style={{ fontSize:13 }}>{fmt(subtotal)}</span></div>
            <div style={{ ...summRow }}>
              <div>
                <p style={{ fontSize:13, color:C.muted }}>Shipping</p>
                <p style={{ fontSize:10, color:C.gold, marginTop:2 }}>{shipping.label}</p>
              </div>
              <span style={{ fontSize:13, color:C.gold }}>{fmt(shipping.cost)}</span>
            </div>
            <div style={{ ...summRow, fontSize:18, fontWeight:600, paddingTop:12, marginTop:2, borderTop:`1px solid ${C.border}` }}>
              <span>Total</span><span style={{ color:C.gold }}>{fmt(total)}</span>
            </div>
          </div>
          <button
            onClick={onPlace}
            disabled={busy}
            style={{ ...goldBtnSt, width:"100%", padding:"16px 0", marginTop:24, opacity: busy ? 0.72 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontSize:10 }}
          >
            {busy ? (
              <>
                <span style={{ width:13, height:13, border:`2px solid ${C.bg}`, borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.75s linear infinite" }} />
                Processing Payment…
              </>
            ) : `Pay ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONFIRM PAGE
// ═══════════════════════════════════════════════════════════

function ConfirmPage({ order, onHome }) {
  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:"64px 32px", animation:"fadeUp 0.5s ease" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ width:68, height:68, borderRadius:"50%", border:`2px solid ${C.success}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:C.success, fontSize:30 }}>
          ✓
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, marginBottom:10 }}>Order Confirmed</h2>
        <p style={{ color:C.muted, fontSize:14 }}>Thank you, {order.info.firstName}. Your order has been placed successfully.</p>
        <div style={{ marginTop:12, display:"inline-flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:C.dim, letterSpacing:"0.1em" }}>ORDER</span>
          <span style={{ fontSize:13, color:C.gold, letterSpacing:"0.15em", fontWeight:500 }}>#{order.id}</span>
        </div>
      </div>

      {/* Email Preview Card */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:36 }}>
        {/* Email meta bar */}
        <div style={{ background:"#0c0c0c", borderBottom:`1px solid ${C.border}`, padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.success }} />
          <div>
            <p style={{ fontSize:10, color:C.dim, marginBottom:2 }}>Confirmation email sent to</p>
            <p style={{ fontSize:13, color:C.gold }}>{order.info.email}</p>
          </div>
          <span style={{ marginLeft:"auto", fontSize:10, color:C.dim }}>{order.date} · {order.time}</span>
        </div>

        <div style={{ padding:"28px 32px" }}>
          {/* Email brand header */}
          <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:20, marginBottom:22 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, letterSpacing:"0.25em", color:C.gold }}>{BRAND}</p>
            <p style={{ fontSize:11, color:C.muted, marginTop:4, letterSpacing:"0.08em" }}>Order Confirmation — {order.date}</p>
          </div>

          <p style={{ fontSize:13, color:"#bbb", lineHeight:1.75, marginBottom:22, fontWeight:300 }}>
            Dear {order.info.firstName},<br /><br />
            Your order has been confirmed and will be prepared for dispatch shortly. Please find your order summary below.
          </p>

          {/* Order items */}
          {order.items.map(item => (
            <div key={`${item.pid}-${item.size}`} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:44, height:44, background:item.bg, flexShrink:0 }} />
                <div>
                  <p style={{ fontSize:13, color:C.text }}>{item.name}</p>
                  <p style={{ fontSize:11, color:C.dim, marginTop:2 }}>Size {item.size} · Qty {item.qty}</p>
                </div>
              </div>
              <span style={{ fontSize:13, color:C.text }}>{fmt(item.price * item.qty)}</span>
            </div>
          ))}

          {/* Totals */}
          <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:10 }}>
            <div style={summRow}><span style={{ fontSize:13, color:C.muted }}>Subtotal</span><span style={{ fontSize:13 }}>{fmt(order.subtotal)}</span></div>
            <div style={summRow}>
              <span style={{ fontSize:13, color:C.muted }}>Shipping — {order.shipping.label}</span>
              <span style={{ fontSize:13 }}>{fmt(order.shipping.cost)}</span>
            </div>
            <div style={{ ...summRow, fontSize:16, fontWeight:600, paddingTop:14, marginTop:4, borderTop:`1px solid ${C.border}` }}>
              <span>Total Charged</span><span style={{ color:C.gold }}>{fmt(order.total)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div style={{ marginTop:24, padding:"16px 18px", background:"#0c0c0c", border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.muted, marginBottom:10 }}>Delivery Address</p>
            <p style={{ fontSize:13, color:"#bbb", lineHeight:1.7, fontWeight:300 }}>
              {order.info.firstName} {order.info.lastName}<br />
              {order.info.address}<br />
              {order.info.city}{order.info.state ? `, ${order.info.state}` : ""} — {order.info.pincode}<br />
              {order.info.country}
            </p>
          </div>

          {/* Estimated delivery */}
          <div style={{ marginTop:16, padding:"14px 18px", background:C.goldLight, border:`1px solid rgba(201,168,76,0.2)` }}>
            <p style={{ fontSize:12, color:"#ccc", fontWeight:300 }}>
              ✦ Estimated delivery: <span style={{ color:C.gold, fontWeight:500 }}>{order.shipping.days}</span><br />
              <span style={{ fontSize:11, color:C.muted }}>A tracking number will be sent once your order ships.</span>
            </p>
          </div>

          <p style={{ marginTop:22, fontSize:12, color:C.muted, borderTop:`1px solid ${C.border}`, paddingTop:18, lineHeight:1.6 }}>
            For any queries, contact us at <span style={{ color:C.gold }}>support@monolith.in</span> quoting your order ID <span style={{ color:C.gold }}>#{order.id}</span>.
          </p>
        </div>
      </div>

      <div style={{ textAlign:"center" }}>
        <button onClick={onHome} style={goldBtnSt}>Continue Shopping</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("home");
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [cart, setCart] = useState([]);
  const [inv, setInv] = useState(defaultInv());
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState({ firstName:"", lastName:"", email:"", phone:"", address:"", city:"", state:"", pincode:"", country:"India" });
  const [pay, setPay] = useState({ name:"", number:"", expiry:"", cvv:"" });

  useEffect(() => {
    loadInv().then(stored => { if (stored) setInv(stored); });
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const toast_ = (msg, type="ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const cartCount = cart.reduce((s,i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const shipping  = SHIPPING_DB[info.country] || { cost:1499, label:"International Freight", days:"10–18 business days" };
  const total     = subtotal + shipping.cost;

  const openProduct = (p) => { setProduct(p); setSize(null); setPage("product"); window.scrollTo(0,0); };

  const addToCart = () => {
    if (!size) { toast_("Please select a size","err"); return; }
    if ((inv[product.id]?.[size] ?? 0) === 0) { toast_("This size is sold out","err"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.pid === product.id && i.size === size);
      if (ex) {
        if (ex.qty >= (inv[product.id]?.[size] ?? 0)) { toast_("No more stock available","err"); return prev; }
        return prev.map(i => i.pid === product.id && i.size === size ? { ...i, qty: i.qty+1 } : i);
      }
      return [...prev, { pid: product.id, name: product.name, price: product.price, size, qty:1, bg: product.bg }];
    });
    toast_(`${product.name} (${size}) added to bag`);
  };

  const removeItem = (pid, sz) => setCart(prev => prev.filter(i => !(i.pid===pid && i.size===sz)));

  const changeQty = (pid, sz, d) => {
    setCart(prev => prev.flatMap(i => {
      if (!(i.pid===pid && i.size===sz)) return [i];
      const nq = i.qty + d;
      if (nq < 1) return [];
      if (nq > (inv[pid]?.[sz] ?? 0)) { toast_("Not enough stock","err"); return [i]; }
      return [{ ...i, qty:nq }];
    }));
  };

  const validate = () => {
    const e = {};
    if (!info.firstName.trim())              e.firstName = "Required";
    if (!info.lastName.trim())               e.lastName  = "Required";
    if (!/\S+@\S+\.\S+/.test(info.email))   e.email     = "Enter a valid email address";
    if (info.phone.replace(/\D/g,"").length < 10) e.phone = "Enter a valid phone number";
    if (!info.address.trim())                e.address   = "Required";
    if (!info.city.trim())                   e.city      = "Required";
    if (!info.pincode.trim())                e.pincode   = "Required";
    if (!pay.name.trim())                    e.payName   = "Required";
    if (pay.number.replace(/\s/g,"").length !== 16) e.payNum = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(pay.expiry)) e.payExp    = "Enter in MM/YY format";
    if (pay.cvv.length < 3)                  e.payCvv    = "Enter a 3–4 digit CVV";
    return e;
  };

  const placeOrder = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) { toast_("Please fix the highlighted errors","err"); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 2600));

    // Decrement inventory
    const newInv = JSON.parse(JSON.stringify(inv));
    cart.forEach(item => {
      if (newInv[item.pid]?.[item.size] !== undefined)
        newInv[item.pid][item.size] = Math.max(0, newInv[item.pid][item.size] - item.qty);
    });
    setInv(newInv);
    await saveInv(newInv);

    const orderId = `MN${Date.now().toString().slice(-8)}`;
    setConfirmedOrder({
      id: orderId, items:[...cart], info:{...info},
      subtotal, shipping, total,
      date: new Date().toLocaleDateString("en-IN",{ day:"numeric", month:"long", year:"numeric" }),
      time: new Date().toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" }),
    });
    setCart([]); setBusy(false); setPage("confirm"); window.scrollTo(0,0);
  };

  const formatCard   = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  return (
    <div style={{ fontFamily:"'Jost',sans-serif", background:C.bg, color:C.text, minHeight:"100vh" }}>
      {/* ── Header ────────────────────────────────── */}
      {page !== "confirm" && (
        <header style={{
          position:"sticky", top:0, zIndex:200,
          background:"rgba(9,9,9,0.96)", backdropFilter:"blur(14px)",
          borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:60,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <button onClick={() => setPage("home")} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:300, letterSpacing:"0.38em", color:C.gold, background:"none", border:"none", cursor:"pointer", textTransform:"uppercase" }}>
            {BRAND}
          </button>
          <nav style={{ display:"flex", gap:32, alignItems:"center" }}>
            <button onClick={() => setPage("home")} style={navLinkSt}>Collection</button>
            <button onClick={() => { setPage("cart"); window.scrollTo(0,0); }} style={{ ...navLinkSt, display:"flex", alignItems:"center", gap:7 }}>
              <span>Bag</span>
              {cartCount > 0 && (
                <span style={{ background:C.gold, color:C.bg, borderRadius:"50%", width:18, height:18, fontSize:9, fontWeight:700, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </header>
      )}

      {/* ── Page Router ───────────────────────────── */}
      {page === "home"     && <HomePage inv={inv} onOpen={openProduct} />}
      {page === "product"  && product && (
        <ProductPage product={product} inv={inv} size={size} setSize={setSize} onAdd={addToCart} onBack={() => { setPage("home"); window.scrollTo(0,0); }} />
      )}
      {page === "cart"     && (
        <CartPage cart={cart} subtotal={subtotal} shipping={shipping} total={total} country={info.country}
          onRemove={removeItem} onQty={changeQty} onCheckout={() => { setPage("checkout"); window.scrollTo(0,0); }} onShop={() => setPage("home")} />
      )}
      {page === "checkout" && (
        <CheckoutPage info={info} setInfo={setInfo} pay={pay} setPay={setPay} errors={errors} setErrors={setErrors}
          cart={cart} subtotal={subtotal} shipping={shipping} total={total}
          busy={busy} onPlace={placeOrder} formatCard={formatCard} formatExpiry={formatExpiry}
          onBack={() => setPage("cart")} />
      )}
      {page === "confirm" && confirmedOrder && (
        <ConfirmPage order={confirmedOrder} onHome={() => { setPage("home"); setConfirmedOrder(null); window.scrollTo(0,0); }} />
      )}

      {/* ── Toast ─────────────────────────────────── */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:999,
          background: toast.type === "err" ? C.error : C.success,
          color:"#fff", padding:"12px 20px", fontSize:12, letterSpacing:"0.06em",
          boxShadow:"0 8px 28px rgba(0,0,0,0.5)", animation:"slideIn 0.3s ease",
          maxWidth:300, lineHeight:1.4,
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#090909; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#090909; }
        ::-webkit-scrollbar-thumb { background:#2a2a2a; }
        input:focus, select:focus { border-color:#c9a84c !important; outline:none; }
        button:focus { outline:none; }
      `}</style>
    </div>
  );
}
