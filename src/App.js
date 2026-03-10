import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════
const BRAND        = "MONOLITH";
const ADMIN_PASS   = "admin123";          // change this to secure the admin panel
const fmt          = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const uid          = ()  => `p${Date.now()}${Math.random().toString(36).slice(2,6)}`;

// SIZE PRESETS — admin picks one when adding a product
const SIZE_PRESETS = {
  "XS–XXL":   ["XS","S","M","L","XL","XXL"],
  "S–XXL":    ["S","M","L","XL","XXL"],
  "S–XL":     ["S","M","L","XL"],
  "Waist (28–38)": ["28","30","32","34","36","38"],
  "Waist (28–34)": ["28","30","32","34"],
  "Blazer (R)":    ["36R","38R","40R","42R","44R","46R"],
  "Blazer (S/R/L)":["38S","38R","38L","40S","40R","40L","42R","42L","44R"],
  "One Size":  ["ONE SIZE"],
  "Custom":    [],   // free-text entry
};

// ═══════════════════════════════════════════════════════════
//  DEFAULT CATALOG (seeded if storage is empty)
// ═══════════════════════════════════════════════════════════
const SEED_PRODUCTS = [
  {
    id:"p_seed1", name:"Oxford Dress Shirt", category:"SHIRTS",
    price:2499, was:3299,
    desc:"Crafted from premium 120-count Egyptian cotton with a semi-spread collar and hand-sewn mother-of-pearl buttons.",
    details:["100% Egyptian Cotton","Mother-of-pearl buttons","Semi-spread collar","Machine washable 30°C"],
    bg:"linear-gradient(145deg,#e8ddd0,#c4b4a4,#a89888)",
    sizes:[{s:"XS",q:2},{s:"S",q:5},{s:"M",q:0},{s:"L",q:3},{s:"XL",q:1},{s:"XXL",q:0}],
  },
  {
    id:"p_seed2", name:"Slim Fit Chinos", category:"TROUSERS",
    price:3299, was:null,
    desc:"Tailored from stretch-cotton twill for an impeccable fit that moves with you through every moment.",
    details:["98% Cotton, 2% Elastane","Slim fit silhouette","Four-pocket design","Machine washable"],
    bg:"linear-gradient(145deg,#c8b890,#a89868,#887848)",
    sizes:[{s:"28",q:3},{s:"30",q:4},{s:"32",q:0},{s:"34",q:2},{s:"36",q:0},{s:"38",q:1}],
  },
  {
    id:"p_seed3", name:"Merino Wool Crewneck", category:"KNITWEAR",
    price:4999, was:6499,
    desc:"Spun from ultra-fine 18.5-micron Merino wool for exceptional softness and natural temperature regulation.",
    details:["100% Merino Wool","Ribbed collar, cuffs & hem","Regular fit","Dry clean recommended"],
    bg:"linear-gradient(145deg,#2c3e5a,#1a2840,#0d1828)",
    sizes:[{s:"S",q:0},{s:"M",q:3},{s:"L",q:2},{s:"XL",q:4},{s:"XXL",q:1}],
  },
  {
    id:"p_seed4", name:"Tailored Wool Blazer", category:"JACKETS",
    price:8499, was:null,
    desc:"Classic single-breasted silhouette in fine wool-blend. Fully canvassed with hand-stitched lapels.",
    details:["70% Wool, 30% Polyester","Fully canvassed","Hand-stitched lapels","Dry clean only"],
    bg:"linear-gradient(145deg,#3a3a3a,#252525,#141414)",
    sizes:[{s:"38R",q:1},{s:"40R",q:2},{s:"42R",q:0},{s:"44R",q:3},{s:"46R",q:0}],
  },
  {
    id:"p_seed5", name:"Linen Casual Shirt", category:"SHIRTS",
    price:1999, was:2499,
    desc:"Woven from premium Belgian linen. A relaxed fit with subtle texture that deepens in character with every wash.",
    details:["100% Belgian Linen","Relaxed fit","Mother-of-pearl buttons","Machine washable"],
    bg:"linear-gradient(145deg,#d4c8b0,#b8a888,#9c8a6a)",
    sizes:[{s:"S",q:4},{s:"M",q:6},{s:"L",q:0},{s:"XL",q:2},{s:"XXL",q:0}],
  },
  {
    id:"p_seed6", name:"Selvedge Denim Jacket", category:"JACKETS",
    price:5499, was:null,
    desc:"Crafted from 12oz Japanese selvedge denim with a vintage-inspired fade. Solid copper rivets and custom lining.",
    details:["12oz Japanese Selvedge","Copper rivets","Custom lining","Machine wash cold"],
    bg:"linear-gradient(145deg,#3a4a6a,#2a3858,#1a2844)",
    sizes:[{s:"S",q:0},{s:"M",q:2},{s:"L",q:3},{s:"XL",q:1},{s:"XXL",q:2}],
  },
];

// ═══════════════════════════════════════════════════════════
//  SHIPPING TABLE
// ═══════════════════════════════════════════════════════════
const SHIPPING_DB = {
  "India":                {cost:99,   label:"Standard Delivery",    days:"3–5 business days"},
  "Bangladesh":           {cost:399,  label:"South Asia Express",   days:"5–8 business days"},
  "Sri Lanka":            {cost:399,  label:"South Asia Express",   days:"5–8 business days"},
  "Nepal":                {cost:399,  label:"South Asia Express",   days:"5–8 business days"},
  "Pakistan":             {cost:399,  label:"South Asia Express",   days:"5–8 business days"},
  "Maldives":             {cost:499,  label:"Island Express",       days:"7–10 business days"},
  "United Arab Emirates": {cost:799,  label:"Gulf Express",         days:"5–7 business days"},
  "Saudi Arabia":         {cost:799,  label:"Gulf Express",         days:"5–7 business days"},
  "Qatar":                {cost:799,  label:"Gulf Express",         days:"5–7 business days"},
  "Kuwait":               {cost:799,  label:"Gulf Express",         days:"5–7 business days"},
  "Singapore":            {cost:999,  label:"Asia Pacific",         days:"5–10 business days"},
  "Malaysia":             {cost:999,  label:"Asia Pacific",         days:"5–10 business days"},
  "Japan":                {cost:1099, label:"Asia Pacific",         days:"7–12 business days"},
  "United States":        {cost:1499, label:"DHL International",    days:"7–14 business days"},
  "United Kingdom":       {cost:1299, label:"DHL International",    days:"7–12 business days"},
  "Canada":               {cost:1499, label:"DHL International",    days:"7–14 business days"},
  "Australia":            {cost:1399, label:"DHL International",    days:"8–14 business days"},
  "Germany":              {cost:1299, label:"DHL International",    days:"7–12 business days"},
  "France":               {cost:1299, label:"DHL International",    days:"7–12 business days"},
  "Rest of World":        {cost:1499, label:"International Freight",days:"10–18 business days"},
};
const COUNTRY_LIST = Object.keys(SHIPPING_DB).sort();

// ═══════════════════════════════════════════════════════════
//  STORAGE HELPERS  (all data lives in window.storage)
// ═══════════════════════════════════════════════════════════
const DB = {
  // ── Products ──────────────────────────────────────────
  async getProducts() {
    try { const r = await window.storage.get("mn_products_v1"); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async saveProducts(products) {
    try { await window.storage.set("mn_products_v1", JSON.stringify(products)); } catch {}
  },

  // ── Inventory (size → qty map per product) ────────────
  async getInv() {
    try { const r = await window.storage.get("mn_inv_v1"); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async saveInv(inv) {
    try { await window.storage.set("mn_inv_v1", JSON.stringify(inv)); } catch {}
  },

  // ── Orders ────────────────────────────────────────────
  async getOrders() {
    try { const r = await window.storage.get("mn_orders_v1"); return r ? JSON.parse(r.value) : []; }
    catch { return []; }
  },
  async saveOrders(orders) {
    try { await window.storage.set("mn_orders_v1", JSON.stringify(orders)); } catch {}
  },

  // ── Credentials (admin + users) ──────────────────────
  async getCredentials() {
    try { const r = await window.storage.get("mn_credentials_v1"); return r ? JSON.parse(r.value) : { users:[], admin:{ pass: ADMIN_PASS } }; }
    catch { return { users:[], admin:{ pass: ADMIN_PASS } }; }
  },
  async saveCredentials(creds) {
    try { await window.storage.set("mn_credentials_v1", JSON.stringify(creds)); } catch {}
  },

  // ── Append order to credentials record ───────────────
  async appendOrderToCredentials(email, orderId, orderSummary) {
    const creds = await DB.getCredentials();
    const idx   = creds.users.findIndex(u => u.email === email);
    const entry = { orderId, date: orderSummary.date, total: orderSummary.total, items: orderSummary.items.length };
    if (idx >= 0) {
      creds.users[idx].orders = [...(creds.users[idx].orders || []), entry];
    } else {
      creds.users.push({ email, orders: [entry] });
    }
    await DB.saveCredentials(creds);
  },
};

// build inventory map from products array
function buildInvFromProducts(products) {
  const inv = {};
  products.forEach(p => { inv[p.id] = {}; p.sizes.forEach(sz => { inv[p.id][sz.s] = sz.q; }); });
  return inv;
}

// ═══════════════════════════════════════════════════════════
//  PALETTE
// ═══════════════════════════════════════════════════════════
const C = {
  bg:"#090909", surface:"#111", card:"#161616", border:"#232323",
  gold:"#c9a84c", goldBg:"rgba(201,168,76,0.10)",
  text:"#f0e8d8", muted:"#666", dim:"#3a3a3a",
  error:"#d95f5f", success:"#5aaa7a", admin:"#7c6df0",
};
const labelSt  = { display:"block", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.muted, marginBottom:8, fontWeight:400 };
const inputSt  = { width:"100%", background:"#0c0c0c", border:`1px solid ${C.border}`, color:C.text, padding:"11px 14px", fontSize:13, outline:"none", fontFamily:"'Jost',sans-serif", transition:"border-color 0.2s" };
const goldBtn  = { background:C.gold, color:C.bg, border:"none", cursor:"pointer", padding:"13px 32px", fontSize:10, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" };
const ghostBtn = { background:"transparent", color:C.text, border:`1px solid ${C.border}`, cursor:"pointer", padding:"13px 32px", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" };

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]               = useState("home");
  const [products, setProducts]       = useState([]);
  const [inv, setInv]                 = useState({});
  const [orders, setOrders]           = useState([]);
  const [cart, setCart]               = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [selSize, setSelSize]         = useState(null);
  const [toast, setToast]             = useState(null);
  const [confirmed, setConfirmed]     = useState(null);
  const [busy, setBusy]               = useState(false);
  const [errors, setErrors]           = useState({});
  const [adminAuth, setAdminAuth]     = useState(false);
  const [info, setInfo] = useState({ firstName:"", lastName:"", email:"", phone:"", address:"", city:"", state:"", pin:"", country:"India" });
  const [pay,  setPay]  = useState({ name:"", number:"", expiry:"", cvv:"" });

  // ── Bootstrap ─────────────────────────────────────────
  useEffect(() => {
    const lnk = document.createElement("link");
    lnk.href  = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap";
    lnk.rel   = "stylesheet";
    document.head.appendChild(lnk);

    (async () => {
      let prods = await DB.getProducts();
      if (!prods || prods.length === 0) {
        prods = SEED_PRODUCTS;
        await DB.saveProducts(prods);
      }
      setProducts(prods);

      let storedInv = await DB.getInv();
      // Merge stored inv with any new products
      const freshInv = buildInvFromProducts(prods);
      const mergedInv = { ...freshInv };
      if (storedInv) {
        Object.keys(storedInv).forEach(pid => {
          if (mergedInv[pid]) mergedInv[pid] = { ...mergedInv[pid], ...storedInv[pid] };
        });
      }
      setInv(mergedInv);

      const storedOrders = await DB.getOrders();
      setOrders(storedOrders);
    })();
  }, []);

  // ── Helpers ───────────────────────────────────────────
  const showToast = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3200); };
  const nav       = (p) => { setPage(p); window.scrollTo(0,0); };
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal  = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipInfo  = SHIPPING_DB[info.country] || SHIPPING_DB["Rest of World"];
  const total     = subtotal + shipInfo.cost;

  // ── Product CRUD ──────────────────────────────────────
  const saveProductsAndInv = async (newProds, newInv) => {
    setProducts(newProds);
    setInv(newInv);
    await DB.saveProducts(newProds);
    await DB.saveInv(newInv);
  };

  const addProduct = async (prod) => {
    const newProds = [...products, prod];
    const newInv   = { ...inv, [prod.id]: {} };
    prod.sizes.forEach(sz => { newInv[prod.id][sz.s] = sz.q; });
    await saveProductsAndInv(newProds, newInv);
    showToast(`"${prod.name}" added to catalog`);
  };

  const updateProduct = async (prod) => {
    const newProds = products.map(p => p.id === prod.id ? prod : p);
    const newInv   = { ...inv, [prod.id]: {} };
    prod.sizes.forEach(sz => { newInv[prod.id][sz.s] = sz.q; });
    await saveProductsAndInv(newProds, newInv);
    showToast(`"${prod.name}" updated`);
  };

  const deleteProduct = async (pid) => {
    const newProds = products.filter(p => p.id !== pid);
    const newInv   = { ...inv };
    delete newInv[pid];
    await saveProductsAndInv(newProds, newInv);
    showToast("Product removed from catalog", "err");
  };

  // ── Cart ──────────────────────────────────────────────
  const addToCart = () => {
    if (!selSize) { showToast("Please select a size","err"); return; }
    if ((inv[openProduct.id]?.[selSize]??0)===0) { showToast("This size is sold out","err"); return; }
    setCart(prev => {
      const ex = prev.find(i=>i.pid===openProduct.id&&i.size===selSize);
      if (ex) {
        if (ex.qty>=(inv[openProduct.id]?.[selSize]??0)){showToast("No more stock","err");return prev;}
        return prev.map(i=>i.pid===openProduct.id&&i.size===selSize?{...i,qty:i.qty+1}:i);
      }
      return [...prev,{pid:openProduct.id,name:openProduct.name,price:openProduct.price,size:selSize,qty:1,bg:openProduct.bg}];
    });
    showToast(`${openProduct.name} (${selSize}) added`);
  };
  const removeItem = (pid,sz) => setCart(p=>p.filter(i=>!(i.pid===pid&&i.size===sz)));
  const changeQty  = (pid,sz,d) => {
    setCart(prev=>prev.flatMap(i=>{
      if(!(i.pid===pid&&i.size===sz))return[i];
      const nq=i.qty+d;
      if(nq<1)return[];
      if(nq>(inv[pid]?.[sz]??0)){showToast("Not enough stock","err");return[i];}
      return[{...i,qty:nq}];
    }));
  };

  // ── Checkout ──────────────────────────────────────────
  const validate = () => {
    const e={};
    if(!info.firstName.trim())             e.firstName="Required";
    if(!info.lastName.trim())              e.lastName="Required";
    if(!/\S+@\S+\.\S+/.test(info.email))  e.email="Invalid email";
    if(info.phone.replace(/\D/g,"").length<10) e.phone="Invalid phone";
    if(!info.address.trim())               e.address="Required";
    if(!info.city.trim())                  e.city="Required";
    if(!info.pin.trim())                   e.pin="Required";
    if(!pay.name.trim())                   e.payName="Required";
    if(pay.number.replace(/\s/g,"").length!==16) e.payNum="Enter 16 digits";
    if(!/^\d{2}\/\d{2}$/.test(pay.expiry))e.payExp="MM/YY format";
    if(pay.cvv.length<3)                   e.payCvv="3–4 digits";
    return e;
  };

  const placeOrder = async () => {
    const e=validate(); setErrors(e);
    if(Object.keys(e).length){showToast("Fix the highlighted errors","err");return;}
    setBusy(true);
    await new Promise(r=>setTimeout(r,2500));

    // Deduct inventory
    const newInv=JSON.parse(JSON.stringify(inv));
    cart.forEach(item=>{
      if(newInv[item.pid]?.[item.size]!==undefined)
        newInv[item.pid][item.size]=Math.max(0,newInv[item.pid][item.size]-item.qty);
    });
    setInv(newInv);
    await DB.saveInv(newInv);

    const orderId=`MN${Date.now().toString().slice(-8)}`;
    const order={
      id:orderId, items:[...cart], info:{...info},
      subtotal, shipping:shipInfo, total,
      date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),
      time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),
      status:"Confirmed",
    };

    const newOrders=[order,...orders];
    setOrders(newOrders);
    await DB.saveOrders(newOrders);

    // Append to credentials DB
    await DB.appendOrderToCredentials(info.email, orderId, order);

    setConfirmed(order);
    setCart([]);
    setBusy(false);
    nav("confirm");
  };

  const fmtCard   = v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};

  // ═══════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div style={{fontFamily:"'Jost',sans-serif",background:C.bg,color:C.text,minHeight:"100vh"}}>
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes slideIn {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin    {to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#2a2a2a}
        input:focus,select:focus,textarea:focus{border-color:#c9a84c !important;outline:none}
        button:focus{outline:none}
      `}</style>

      {/* HEADER */}
      {page!=="admin" && (
        <Header cartCount={cartCount} page={page} nav={nav} />
      )}

      {/* PAGES */}
      {page==="home"    && <HomePage     products={products} inv={inv} onOpen={p=>{setOpenProduct(p);setSelSize(null);nav("product");}} nav={nav} />}
      {page==="product" && openProduct  && <ProductPage product={openProduct} inv={inv} selSize={selSize} setSelSize={setSelSize} onAdd={addToCart} onBack={()=>nav("home")} />}
      {page==="cart"    && <CartPage     cart={cart} subtotal={subtotal} shipInfo={shipInfo} total={total} country={info.country} onRemove={removeItem} onQty={changeQty} onCheckout={()=>nav("checkout")} onShop={()=>nav("home")} />}
      {page==="checkout"&& <CheckoutPage info={info} setInfo={setInfo} pay={pay} setPay={setPay} errors={errors} setErrors={setErrors} cart={cart} subtotal={subtotal} shipInfo={shipInfo} total={total} busy={busy} onPlace={placeOrder} fmtCard={fmtCard} fmtExpiry={fmtExpiry} onBack={()=>nav("cart")} />}
      {page==="confirm" && confirmed    && <ConfirmPage order={confirmed} onHome={()=>{setConfirmed(null);nav("home");}} />}
      {page==="orders"  && <OrdersPage  orders={orders} />}
      {page==="admin"   && <AdminPage   products={products} inv={inv} orders={orders} adminAuth={adminAuth} setAdminAuth={setAdminAuth} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} showToast={showToast} nav={nav} />}

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:toast.type==="err"?C.error:"#1a1a1a",color:"#fff",padding:"12px 20px",fontSize:12,letterSpacing:"0.06em",boxShadow:"0 8px 28px rgba(0,0,0,0.5)",animation:"slideIn 0.3s ease",maxWidth:300,lineHeight:1.4,border:`1px solid ${toast.type==="err"?C.error:C.border}`}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════════
function Header({cartCount,page,nav}){
  return(
    <header style={{position:"sticky",top:0,zIndex:500,background:"rgba(9,9,9,0.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 48px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <button onClick={()=>nav("home")} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:300,letterSpacing:"0.38em",color:C.gold,background:"none",border:"none",cursor:"pointer",textTransform:"uppercase"}}>
        {BRAND}
      </button>
      <nav style={{display:"flex",gap:36,alignItems:"center"}}>
        {[["SHOP","home"],["ORDERS","orders"]].map(([l,p])=>(
          <button key={p} onClick={()=>nav(p)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.22em",textTransform:"uppercase",color:page===p?C.gold:C.muted,borderBottom:page===p?`1px solid ${C.gold}`:"1px solid transparent",paddingBottom:2}}>
            {l}
          </button>
        ))}
      </nav>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <button onClick={()=>nav("cart")} style={{...ghostBtn,padding:"7px 16px",display:"flex",alignItems:"center",gap:8,fontSize:11}}>
          <CartIcon/>{cartCount>0&&<span style={{background:C.gold,color:C.bg,borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
        </button>
        <button onClick={()=>nav("admin")} style={{...ghostBtn,padding:"7px 14px",fontSize:10,color:C.admin,borderColor:C.admin}}>
          ADMIN ⚙
        </button>
      </div>
    </header>
  );
}
function CartIcon(){return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1={3} y1={6} x2={21} y2={6}/><path d="M16 10a4 4 0 01-8 0"/></svg>;}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════
function HomePage({products,inv,onOpen,nav}){
  return(
    <div>
      {/* Hero */}
      <div style={{height:"56vh",position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#0d0d0d,#14110a,#1a1510)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
        {[...Array(9)].map((_,i)=><div key={i} style={{position:"absolute",top:0,bottom:0,left:`${(i+1)*10}%`,width:1,background:C.gold,opacity:0.03}}/>)}
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"0.55em",color:C.gold,marginBottom:22,textTransform:"uppercase",animation:"fadeUp 0.6s ease both"}}>AW 2025 — Collection</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:74,fontWeight:300,letterSpacing:"0.12em",color:C.text,lineHeight:1.0,textTransform:"uppercase",animation:"fadeUp 0.6s 0.1s ease both"}}>The New<br/><em style={{fontStyle:"italic",color:C.gold}}>Collection</em></h1>
        <p style={{marginTop:28,fontSize:11,letterSpacing:"0.28em",color:C.muted,textTransform:"uppercase",animation:"fadeUp 0.6s 0.2s ease both"}}>Refined Menswear — Uncompromising Quality</p>
        <div style={{marginTop:36,display:"flex",gap:16,animation:"fadeUp 0.6s 0.3s ease both"}}>
          <button onClick={()=>document.getElementById("grid")?.scrollIntoView({behavior:"smooth"})} style={goldBtn}>Shop Now</button>
          <button onClick={()=>nav("orders")} style={ghostBtn}>Track Orders</button>
        </div>
      </div>

      {/* Grid */}
      <div id="grid" style={{maxWidth:1240,margin:"0 auto",padding:"72px 40px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:40}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300}}>All Products</h2>
          <span style={{fontSize:11,color:C.muted,letterSpacing:"0.15em"}}>{products.length} PIECES</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {products.map((p,i)=>{
            const hasAny=p.sizes.some(sz=>(inv[p.id]?.[sz.s]??sz.q)>0);
            return <ProductCard key={p.id} p={p} hasAny={hasAny} idx={i} onClick={()=>onOpen(p)}/>;
          })}
        </div>
      </div>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"28px 48px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,letterSpacing:"0.35em",color:C.gold}}>{BRAND}</span>
        <p style={{fontSize:11,color:C.dim}}>© {new Date().getFullYear()} Monolith Menswear.</p>
        <p style={{fontSize:11,color:C.muted}}>Free returns · Worldwide shipping</p>
      </footer>
    </div>
  );
}

function ProductCard({p,hasAny,idx,onClick}){
  const[hov,setHov]=useState(false);
  const salePct=p.was?Math.round((1-p.price/p.was)*100):null;
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{cursor:"pointer",background:C.card,border:`1px solid ${hov?C.gold:C.border}`,transform:hov?"translateY(-5px)":"translateY(0)",transition:"all 0.3s ease",animation:`fadeUp 0.5s ${idx*0.06}s ease both`,overflow:"hidden"}}>
      <div style={{height:240,background:p.bg,position:"relative",overflow:"hidden"}}>
        {p.imageUrl&&<img src={p.imageUrl} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hov?"scale(1.05)":"scale(1)",transition:"transform 0.5s"}} onError={e=>e.target.style.display="none"}/>}
        {!hasAny&&<div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.88)",color:C.error,fontSize:9,fontWeight:700,letterSpacing:"0.18em",padding:"5px 10px",textTransform:"uppercase"}}>Sold Out</div>}
        {salePct&&hasAny&&<div style={{position:"absolute",top:12,left:12,background:C.gold,color:C.bg,fontSize:9,fontWeight:700,letterSpacing:"0.12em",padding:"5px 10px"}}>−{salePct}%</div>}
      </div>
      <div style={{padding:"18px 20px 22px"}}>
        <p style={{fontSize:9,letterSpacing:"0.3em",color:C.gold,textTransform:"uppercase",marginBottom:7}}>{p.category}</p>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:400,marginBottom:10}}>{p.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:15,fontWeight:500}}>{fmt(p.price)}</span>
          {p.was&&<span style={{fontSize:12,color:C.muted,textDecoration:"line-through"}}>{fmt(p.was)}</span>}
        </div>
        {/* Size availability dots */}
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:12}}>
          {p.sizes.map(sz=>{
            const avail=(sz.q)>0;
            return <span key={sz.s} style={{fontSize:9,padding:"2px 6px",border:`1px solid ${avail?C.border:C.dim}`,color:avail?C.muted:C.dim,letterSpacing:"0.06em",textDecoration:!avail?"line-through":"none"}}>{sz.s}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PRODUCT PAGE
// ═══════════════════════════════════════════════════════════
function ProductPage({product:p,inv,selSize,setSelSize,onAdd,onBack}){
  const stockForSel=selSize?(inv[p.id]?.[selSize]??0):null;
  return(
    <div style={{maxWidth:1080,margin:"0 auto",padding:"44px 40px 80px",animation:"fadeIn 0.35s ease"}}>
      <button onClick={onBack} style={{...ghostBtn,padding:"7px 16px",fontSize:10,marginBottom:40,display:"flex",alignItems:"center",gap:8}}>← Back</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
        {/* Image */}
        <div style={{height:520,background:p.bg,position:"relative",overflow:"hidden",border:`1px solid ${C.border}`}}>
          {p.imageUrl&&<img src={p.imageUrl} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
          {p.was&&<div style={{position:"absolute",top:20,left:20,background:C.gold,color:C.bg,fontSize:10,fontWeight:700,letterSpacing:"0.12em",padding:"6px 14px",textTransform:"uppercase"}}>SALE — Save {fmt(p.was-p.price)}</div>}
        </div>
        {/* Info */}
        <div style={{paddingTop:8}}>
          <p style={{fontSize:10,letterSpacing:"0.32em",color:C.gold,textTransform:"uppercase",marginBottom:12}}>{p.category}</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:46,fontWeight:400,lineHeight:1.0,marginBottom:22}}>{p.name}</h2>
          <div style={{display:"flex",alignItems:"baseline",gap:16,marginBottom:26}}>
            <span style={{fontSize:24,fontWeight:500}}>{fmt(p.price)}</span>
            {p.was&&<span style={{fontSize:15,color:C.muted,textDecoration:"line-through"}}>{fmt(p.was)}</span>}
          </div>
          <p style={{fontSize:13,color:"#aaa",lineHeight:1.75,marginBottom:32,fontWeight:300}}>{p.desc}</p>

          {/* Size picker */}
          <div style={{marginBottom:32}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <p style={{fontSize:10,letterSpacing:"0.22em",color:C.muted,textTransform:"uppercase"}}>Select Size</p>
              {selSize&&<span style={{fontSize:11,color:C.gold,fontWeight:500}}>{selSize} — {stockForSel} in stock</span>}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {p.sizes.map(sz=>{
                const stock=inv[p.id]?.[sz.s]??sz.q;
                const sold=stock===0;
                const sel=selSize===sz.s;
                return <SizeBtn key={sz.s} label={sz.s} soldOut={sold} selected={sel} onClick={()=>!sold&&setSelSize(sz.s)}/>;
              })}
            </div>
          </div>

          {/* CTA */}
          {selSize ? (
            stockForSel===0
              ? <div style={{background:C.dim,color:C.muted,padding:"14px 0",textAlign:"center",fontSize:11,fontWeight:600,letterSpacing:"0.28em",textTransform:"uppercase"}}>SOLD OUT</div>
              : <button onClick={onAdd} style={{...goldBtn,width:"100%",padding:"15px 0",fontSize:11}}>Add to Bag</button>
          ) : (
            <div style={{background:"#111",border:`1px solid ${C.dim}`,color:C.muted,padding:"14px 0",textAlign:"center",fontSize:11,fontWeight:600,letterSpacing:"0.24em",textTransform:"uppercase"}}>Select a Size</div>
          )}

          {/* Details */}
          <div style={{marginTop:36,borderTop:`1px solid ${C.border}`,paddingTop:26}}>
            <p style={{fontSize:10,letterSpacing:"0.22em",color:C.muted,textTransform:"uppercase",marginBottom:16}}>Product Details</p>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
              {(p.details||[]).map((d,i)=>(
                <li key={i} style={{fontSize:13,color:"#999",fontWeight:300,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{width:4,height:4,borderRadius:"50%",background:C.gold,flexShrink:0}}/>{d}
                </li>
              ))}
            </ul>
          </div>
          <div style={{marginTop:20,padding:"13px 16px",border:`1px solid ${C.border}`,background:C.goldBg}}>
            <p style={{fontSize:11,color:C.gold}}>🚚 Free shipping within India on orders above ₹5,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeBtn({label,soldOut,selected,onClick}){
  const[hov,setHov]=useState(false);
  return(
    <button onClick={onClick} disabled={soldOut} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{position:"relative",height:44,minWidth:52,padding:"0 12px",border:`1.5px solid ${selected?C.gold:soldOut?C.dim:hov?"#555":C.border}`,background:selected?C.goldBg:"transparent",color:soldOut?"#3a3a3a":selected?C.gold:C.text,fontSize:12,fontWeight:selected?600:300,letterSpacing:"0.06em",cursor:soldOut?"default":"pointer",transition:"all 0.15s",fontFamily:"'Jost',sans-serif"}}>
      {label}
      {soldOut&&<div style={{position:"absolute",inset:0,background:"rgba(9,9,9,0.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,letterSpacing:"0.14em",color:C.error,fontWeight:700}}>OUT</div>}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
//  CART
// ═══════════════════════════════════════════════════════════
function CartPage({cart,subtotal,shipInfo,total,country,onRemove,onQty,onCheckout,onShop}){
  if(!cart.length)return(
    <div style={{textAlign:"center",padding:"120px 40px",animation:"fadeUp 0.4s ease"}}>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,color:C.muted,marginBottom:12}}>Your bag is empty</p>
      <button onClick={onShop} style={{...goldBtn,marginTop:20}}>Explore Collection</button>
    </div>
  );
  return(
    <div style={{maxWidth:940,margin:"0 auto",padding:"48px 40px 80px",animation:"fadeUp 0.35s ease"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:300,marginBottom:44}}>Shopping Bag <span style={{fontSize:18,color:C.muted}}>({cart.reduce((s,i)=>s+i.qty,0)})</span></h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:52}}>
        <div>
          {cart.map(item=>(
            <div key={`${item.pid}-${item.size}`} style={{display:"flex",gap:18,padding:"22px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:84,height:84,background:item.bg,flexShrink:0,overflow:"hidden"}}>
                {item.imageUrl&&<img src={item.imageUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
              </div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,marginBottom:3}}>{item.name}</p>
                <p style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",marginBottom:14}}>Size: {item.size}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <QtyBtn onClick={()=>onQty(item.pid,item.size,-1)}>−</QtyBtn>
                    <span style={{width:32,textAlign:"center",fontSize:13}}>{item.qty}</span>
                    <QtyBtn onClick={()=>onQty(item.pid,item.size,+1)}>+</QtyBtn>
                  </div>
                  <span style={{fontSize:15,fontWeight:500}}>{fmt(item.price*item.qty)}</span>
                  <button onClick={()=>onRemove(item.pid,item.size)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif"}}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <SummaryBox subtotal={subtotal} shipInfo={shipInfo} total={total} country={country}>
          <button onClick={onCheckout} style={{...goldBtn,width:"100%",padding:"14px 0"}}>Proceed to Checkout</button>
        </SummaryBox>
      </div>
    </div>
  );
}
function QtyBtn({onClick,children}){return<button onClick={onClick} style={{width:30,height:30,background:"transparent",border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"'Jost',sans-serif"}}>{children}</button>;}

// ═══════════════════════════════════════════════════════════
//  CHECKOUT
// ═══════════════════════════════════════════════════════════
function CheckoutPage({info,setInfo,pay,setPay,errors,setErrors,cart,subtotal,shipInfo,total,busy,onPlace,fmtCard,fmtExpiry,onBack}){
  const fi=(key,label,col2=false,type="text")=>(
    <div style={{gridColumn:col2?"span 2":"span 1"}}>
      <label style={labelSt}>{label}</label>
      <input type={type} value={info[key]} onChange={e=>{setInfo(p=>({...p,[key]:e.target.value}));setErrors(p=>({...p,[key]:""}))} } style={{...inputSt,borderColor:errors[key]?C.error:C.border}}/>
      {errors[key]&&<p style={{color:C.error,fontSize:11,marginTop:4}}>{errors[key]}</p>}
    </div>
  );
  return(
    <div style={{maxWidth:1060,margin:"0 auto",padding:"44px 40px 80px",animation:"fadeUp 0.35s ease"}}>
      <button onClick={onBack} style={{...ghostBtn,padding:"7px 16px",fontSize:10,marginBottom:32,display:"flex",alignItems:"center",gap:8}}>← Back to Bag</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:52,alignItems:"start"}}>
        <div>
          <Section title="Delivery Information">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {fi("firstName","First Name")}{fi("lastName","Last Name")}
              {fi("email","Email Address",true,"email")}{fi("phone","Phone",true,"tel")}
              {fi("address","Street Address",true)}
              {fi("city","City")}{fi("state","State")}{fi("pin","PIN / ZIP")}
              <div>
                <label style={labelSt}>Country</label>
                <select value={info.country} onChange={e=>setInfo(p=>({...p,country:e.target.value}))} style={{...inputSt,cursor:"pointer"}}>
                  {COUNTRY_LIST.map(c=><option key={c} value={c} style={{background:"#1a1a1a"}}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginTop:16,padding:"13px 16px",border:`1px solid ${C.border}`,background:C.goldBg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><p style={{fontSize:12,color:C.gold,fontWeight:500}}>{shipInfo.label}</p><p style={{fontSize:11,color:C.muted}}>{shipInfo.days}</p></div>
              <span style={{fontSize:14,color:C.gold,fontWeight:600}}>{fmt(shipInfo.cost)}</span>
            </div>
          </Section>

          <Section title="Payment">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{gridColumn:"span 2"}}>
                <label style={labelSt}>Name on Card</label>
                <input value={pay.name} onChange={e=>{setPay(p=>({...p,name:e.target.value}));setErrors(p=>({...p,payName:""}));}} style={{...inputSt,borderColor:errors.payName?C.error:C.border}}/>
                {errors.payName&&<p style={{color:C.error,fontSize:11,marginTop:4}}>{errors.payName}</p>}
              </div>
              <div style={{gridColumn:"span 2"}}>
                <label style={labelSt}>Card Number</label>
                <input value={pay.number} placeholder="1234  5678  9012  3456" maxLength={19} onChange={e=>{setPay(p=>({...p,number:fmtCard(e.target.value)}));setErrors(p=>({...p,payNum:""}));}} style={{...inputSt,letterSpacing:"0.1em",borderColor:errors.payNum?C.error:C.border}}/>
                {errors.payNum&&<p style={{color:C.error,fontSize:11,marginTop:4}}>{errors.payNum}</p>}
              </div>
              <div>
                <label style={labelSt}>Expiry (MM/YY)</label>
                <input value={pay.expiry} placeholder="MM/YY" maxLength={5} onChange={e=>{setPay(p=>({...p,expiry:fmtExpiry(e.target.value)}));setErrors(p=>({...p,payExp:""}));}} style={{...inputSt,borderColor:errors.payExp?C.error:C.border}}/>
                {errors.payExp&&<p style={{color:C.error,fontSize:11,marginTop:4}}>{errors.payExp}</p>}
              </div>
              <div>
                <label style={labelSt}>CVV</label>
                <input value={pay.cvv} type="password" placeholder="•••" maxLength={4} onChange={e=>{setPay(p=>({...p,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}));setErrors(p=>({...p,payCvv:""}));}} style={{...inputSt,borderColor:errors.payCvv?C.error:C.border}}/>
                {errors.payCvv&&<p style={{color:C.error,fontSize:11,marginTop:4}}>{errors.payCvv}</p>}
              </div>
            </div>
            <p style={{fontSize:11,color:C.muted,marginTop:14}}>🔒 256-bit SSL encrypted — card details never stored</p>
          </Section>
        </div>

        <SummaryBox subtotal={subtotal} shipInfo={shipInfo} total={total} country={info.country}>
          <button onClick={onPlace} disabled={busy} style={{...goldBtn,width:"100%",padding:"15px 0",opacity:busy?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {busy?<><Spinner/> Processing…</>:`Pay ${fmt(total)}`}
          </button>
        </SummaryBox>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONFIRM
// ═══════════════════════════════════════════════════════════
function ConfirmPage({order,onHome}){
  return(
    <div style={{maxWidth:660,margin:"0 auto",padding:"64px 40px 80px",animation:"fadeUp 0.5s ease"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{width:64,height:64,borderRadius:"50%",border:`2px solid ${C.success}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",color:C.success,fontSize:28}}>✓</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,marginBottom:10}}>Order Confirmed</h2>
        <p style={{color:C.muted,fontSize:14,marginBottom:8}}>Thank you, {order.info.firstName}. Your order is being prepared.</p>
        <div style={{display:"inline-flex",gap:8,alignItems:"center",background:"#111",border:`1px solid ${C.border}`,padding:"8px 18px",marginTop:4}}>
          <span style={{fontSize:10,color:C.muted,letterSpacing:"0.12em"}}>ORDER</span>
          <span style={{fontSize:13,color:C.gold,letterSpacing:"0.15em",fontWeight:500}}>#{order.id}</span>
        </div>
      </div>

      <div style={{border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:36}}>
        <div style={{background:"#0c0c0c",borderBottom:`1px solid ${C.border}`,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.success}}/>
            <div>
              <p style={{fontSize:10,color:C.muted,letterSpacing:"0.12em",marginBottom:2,textTransform:"uppercase"}}>Confirmation sent to</p>
              <p style={{fontSize:13,color:C.gold}}>{order.info.email}</p>
            </div>
          </div>
          <p style={{fontSize:11,color:C.muted}}>{order.date}</p>
        </div>
        <div style={{padding:"26px 30px"}}>
          <div style={{borderBottom:`1px solid ${C.border}`,paddingBottom:18,marginBottom:20}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,letterSpacing:"0.25em",color:C.gold}}>{BRAND}</p>
          </div>
          {order.items.map(item=>(
            <div key={`${item.pid}-${item.size}`} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
              <div>
                <p style={{fontSize:13}}>{item.name}</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>Size {item.size} · Qty {item.qty}</p>
              </div>
              <span style={{fontSize:13}}>{fmt(item.price*item.qty)}</span>
            </div>
          ))}
          <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:C.muted}}>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:C.muted}}>Shipping — {order.shipping.label}</span><span>{fmt(order.shipping.cost)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:600,borderTop:`1px solid ${C.border}`,paddingTop:14,marginTop:4}}><span>Total</span><span style={{color:C.gold}}>{fmt(order.total)}</span></div>
          </div>
          <div style={{marginTop:22,padding:"14px 16px",background:"#0c0c0c",border:`1px solid ${C.border}`}}>
            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:C.muted,marginBottom:8}}>Delivery Address</p>
            <p style={{fontSize:13,color:"#bbb",lineHeight:1.7,fontWeight:300}}>{order.info.firstName} {order.info.lastName}<br/>{order.info.address}<br/>{order.info.city}{order.info.state?`, ${order.info.state}`:""} — {order.info.pin}<br/>{order.info.country}</p>
          </div>
          <div style={{marginTop:12,padding:"13px 16px",background:C.goldBg,border:`1px solid rgba(201,168,76,0.2)`}}>
            <p style={{fontSize:12,color:C.gold,fontWeight:500}}>✦ Estimated: {order.shipping.days}</p>
          </div>
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <button onClick={onHome} style={goldBtn}>Continue Shopping</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ORDERS PAGE
// ═══════════════════════════════════════════════════════════
function OrdersPage({orders}){
  if(!orders.length)return(
    <div style={{textAlign:"center",padding:"120px 40px",animation:"fadeUp 0.4s ease"}}>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:C.muted}}>No orders yet</p>
    </div>
  );
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"48px 40px 80px",animation:"fadeUp 0.35s ease"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:300,marginBottom:40}}>Your Orders</h2>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {orders.map(o=>(
          <div key={o.id} style={{border:`1px solid ${C.border}`,padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <p style={{fontSize:13,fontWeight:500,letterSpacing:"0.1em"}}>#{o.id}</p>
                <p style={{fontSize:11,color:C.muted,marginTop:3}}>{o.date} · {o.info.firstName} {o.info.lastName}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{background:"rgba(90,170,122,0.15)",color:C.success,border:`1px solid rgba(90,170,122,0.3)`,fontSize:10,fontWeight:600,letterSpacing:"0.14em",padding:"4px 12px",textTransform:"uppercase"}}>{o.status}</span>
                <p style={{fontSize:14,fontWeight:600,marginTop:8}}>{fmt(o.total)}</p>
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",flexWrap:"wrap",gap:12}}>
              {o.items.map(item=>(
                <div key={`${item.pid}-${item.size}`} style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:40,height:40,background:item.bg,flexShrink:0}}/>
                  <div><p style={{fontSize:12,fontWeight:500}}>{item.name}</p><p style={{fontSize:11,color:C.muted}}>Size {item.size} · {item.qty}×</p></div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,padding:"10px 14px",background:"#111",border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
              <p style={{fontSize:11,color:C.muted}}>📦 {o.shipping.label} · ETA {o.shipping.days}</p>
              <p style={{fontSize:11,color:C.muted}}>{o.info.city}, {o.info.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN PAGE
// ═══════════════════════════════════════════════════════════
function AdminPage({products,inv,orders,adminAuth,setAdminAuth,onAdd,onUpdate,onDelete,showToast,nav}){
  const[pass,setPass]=useState("");
  const[tab,setTab]=useState("products");  // products | add | orders | creds
  const[editingProduct,setEditingProduct]=useState(null);
  const[creds,setCreds]=useState(null);

  useEffect(()=>{
    if(adminAuth){
      DB.getCredentials().then(setCreds);
    }
  },[adminAuth]);

  if(!adminAuth)return(
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,padding:48,width:380,animation:"fadeUp 0.4s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <p style={{fontSize:10,letterSpacing:"0.4em",color:C.admin,textTransform:"uppercase",marginBottom:10}}>Admin Access</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300}}>Enter Password</h2>
        </div>
        <label style={labelSt}>Admin Password</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){ if(pass===ADMIN_PASS){setAdminAuth(true);}else{showToast("Incorrect password","err");} } }}
          style={{...inputSt,marginBottom:20}}/>
        <button onClick={()=>{ if(pass===ADMIN_PASS){setAdminAuth(true);}else{showToast("Incorrect password","err");} }}
          style={{...goldBtn,width:"100%",padding:"14px 0",background:C.admin,borderColor:C.admin}}>
          Unlock Admin
        </button>
        <button onClick={()=>nav("home")} style={{...ghostBtn,width:"100%",padding:"12px 0",marginTop:12,fontSize:10}}>← Back to Store</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#080808"}}>
      {/* Admin Header */}
      <div style={{background:"#0d0d0d",borderBottom:`1px solid ${C.border}`,padding:"0 40px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,letterSpacing:"0.3em",color:C.gold}}>{BRAND}</span>
          <span style={{fontSize:10,letterSpacing:"0.28em",color:C.admin,textTransform:"uppercase",background:"rgba(124,109,240,0.12)",border:"1px solid rgba(124,109,240,0.3)",padding:"3px 10px"}}>ADMIN PANEL</span>
        </div>
        <div style={{display:"flex",gap:12}}>
          {[["PRODUCTS","products"],["ADD / EDIT","add"],["ORDERS","orders"],["CREDENTIALS","creds"]].map(([l,t])=>(
            <button key={t} onClick={()=>{setTab(t);setEditingProduct(null);}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:tab===t?C.admin:C.muted,borderBottom:tab===t?`1px solid ${C.admin}`:"1px solid transparent",paddingBottom:2}}>
              {l}
            </button>
          ))}
          <button onClick={()=>{setAdminAuth(false);nav("home");}} style={{...ghostBtn,padding:"6px 14px",fontSize:10,marginLeft:8}}>Exit Admin</button>
        </div>
      </div>

      <div style={{maxWidth:1180,margin:"0 auto",padding:"40px 40px 80px"}}>

        {/* ── TAB: Products List ── */}
        {tab==="products"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300}}>Product Catalog <span style={{fontSize:16,color:C.muted}}>({products.length})</span></h2>
              <button onClick={()=>{setEditingProduct(null);setTab("add");}} style={{...goldBtn,background:C.admin}}>+ Add New Product</button>
            </div>
            <div style={{display:"grid",gap:12}}>
              {products.map(p=>(
                <AdminProductRow key={p.id} p={p} inv={inv}
                  onEdit={()=>{setEditingProduct(p);setTab("add");}}
                  onDelete={()=>{ if(window.confirm(`Delete "${p.name}"?`)) onDelete(p.id); }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Add / Edit ── */}
        {tab==="add"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,marginBottom:36}}>
              {editingProduct?"Edit Product":"Add New Product"}
            </h2>
            <ProductForm
              initial={editingProduct}
              onSave={async(prod)=>{
                if(editingProduct) await onUpdate(prod);
                else await onAdd(prod);
                setEditingProduct(null);
                setTab("products");
              }}
              onCancel={()=>{setEditingProduct(null);setTab("products");}}
            />
          </div>
        )}

        {/* ── TAB: Orders ── */}
        {tab==="orders"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,marginBottom:32}}>All Orders <span style={{fontSize:16,color:C.muted}}>({orders.length})</span></h2>
            {orders.length===0
              ? <p style={{color:C.muted,fontSize:14}}>No orders placed yet.</p>
              : (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {orders.map(o=>(
                    <div key={o.id} style={{background:C.card,border:`1px solid ${C.border}`,padding:22}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:20,marginBottom:16}}>
                        <div><p style={{...labelSt}}>Order ID</p><p style={{fontSize:13,color:C.gold}}>#{o.id}</p></div>
                        <div><p style={{...labelSt}}>Customer</p><p style={{fontSize:13}}>{o.info.firstName} {o.info.lastName}</p><p style={{fontSize:11,color:C.muted}}>{o.info.email}</p></div>
                        <div><p style={{...labelSt}}>Date</p><p style={{fontSize:13}}>{o.date}</p></div>
                        <div><p style={{...labelSt}}>Total</p><p style={{fontSize:14,fontWeight:600,color:C.gold}}>{fmt(o.total)}</p></div>
                      </div>
                      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",flexWrap:"wrap",gap:10}}>
                        {o.items.map(item=>(
                          <div key={`${item.pid}-${item.size}`} style={{background:"#111",border:`1px solid ${C.border}`,padding:"8px 14px",fontSize:12}}>
                            {item.name} · Size {item.size} · ×{item.qty} · {fmt(item.price*item.qty)}
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:12,display:"flex",gap:20,fontSize:11,color:C.muted}}>
                        <span>📦 {o.shipping.label} · {o.shipping.days}</span>
                        <span>📍 {o.info.address}, {o.info.city}, {o.info.country}</span>
                        <span>📱 {o.info.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── TAB: Credentials DB ── */}
        {tab==="creds"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,marginBottom:8}}>Credentials & Order Records</h2>
            <p style={{fontSize:13,color:C.muted,marginBottom:32}}>All customer emails and their associated order history stored in the database.</p>
            {!creds||creds.users.length===0
              ? <p style={{color:C.muted,fontSize:14}}>No customer records yet. Orders will appear here after checkout.</p>
              : (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {creds.users.map((u,i)=>(
                    <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,padding:22}}>
                      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:C.goldBg,border:`1px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:14}}>
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{fontSize:14,fontWeight:500}}>{u.email}</p>
                          <p style={{fontSize:11,color:C.muted}}>{u.orders.length} order{u.orders.length!==1?"s":""} placed</p>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {u.orders.map((ord,j)=>(
                          <div key={j} style={{background:"#0c0c0c",border:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:12,color:C.gold,letterSpacing:"0.12em"}}>#{ord.orderId}</span>
                            <span style={{fontSize:12,color:C.muted}}>{ord.date}</span>
                            <span style={{fontSize:12,color:C.muted}}>{ord.items} item{ord.items!==1?"s":""}</span>
                            <span style={{fontSize:13,fontWeight:500}}>{fmt(ord.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminProductRow({p,inv,onEdit,onDelete}){
  const totalStock=p.sizes.reduce((s,sz)=>s+(inv[p.id]?.[sz.s]??sz.q),0);
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,padding:"18px 22px",display:"grid",gridTemplateColumns:"56px 1fr 200px 140px 120px 120px",gap:20,alignItems:"center"}}>
      <div style={{width:56,height:56,background:p.bg,overflow:"hidden",flexShrink:0}}>
        {p.imageUrl&&<img src={p.imageUrl} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
      </div>
      <div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18}}>{p.name}</p>
        <p style={{fontSize:10,letterSpacing:"0.22em",color:C.gold,textTransform:"uppercase",marginTop:3}}>{p.category}</p>
      </div>
      <div>
        <p style={{fontSize:11,color:C.muted,marginBottom:6}}>Sizes</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {p.sizes.map(sz=>{
            const q=inv[p.id]?.[sz.s]??sz.q;
            return <span key={sz.s} style={{fontSize:10,padding:"2px 7px",border:`1px solid ${q>0?C.border:C.dim}`,color:q>0?C.text:C.dim}}>{sz.s}: {q}</span>;
          })}
        </div>
      </div>
      <div>
        <p style={{fontSize:11,color:C.muted,marginBottom:4}}>Price</p>
        <p style={{fontSize:14,fontWeight:500}}>{fmt(p.price)}</p>
        {p.was&&<p style={{fontSize:11,color:C.muted,textDecoration:"line-through"}}>{fmt(p.was)}</p>}
      </div>
      <div>
        <p style={{fontSize:11,color:C.muted,marginBottom:4}}>Total Stock</p>
        <p style={{fontSize:16,fontWeight:600,color:totalStock>0?C.success:C.error}}>{totalStock}</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onEdit} style={{...ghostBtn,padding:"8px 16px",fontSize:10,flex:1}}>Edit</button>
        <button onClick={onDelete} style={{...ghostBtn,padding:"8px 12px",fontSize:10,borderColor:C.error,color:C.error}}>✕</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PRODUCT FORM (Add / Edit)
// ═══════════════════════════════════════════════════════════
function ProductForm({initial,onSave,onCancel}){
  const isEdit=!!initial;
  const[name,setName]         = useState(initial?.name||"");
  const[category,setCategory] = useState(initial?.category||"SHIRTS");
  const[price,setPrice]       = useState(initial?.price||"");
  const[was,setWas]           = useState(initial?.was||"");
  const[desc,setDesc]         = useState(initial?.desc||"");
  const[details,setDetails]   = useState((initial?.details||[""]).join("\n"));
  const[imageUrl,setImageUrl] = useState(initial?.imageUrl||"");
  const[bg,setBg]             = useState(initial?.bg||"linear-gradient(145deg,#2a2a2a,#1a1a1a)");
  const[sizePreset,setSizePreset] = useState("S–XXL");
  const[customSizes,setCustomSizes] = useState("");
  const[sizes,setSizes]       = useState(
    initial?.sizes
      ? initial.sizes.reduce((acc,sz)=>({...acc,[sz.s]:sz.q})  ,{})
      : {}
  );
  const[err,setErr]           = useState({});

  // When preset changes, populate sizes
  const applyPreset=(preset)=>{
    setSizePreset(preset);
    if(preset==="Custom")return;
    const list=SIZE_PRESETS[preset];
    const obj={};
    list.forEach(s=>{ obj[s]=sizes[s]??0; });
    setSizes(obj);
  };

  // Custom sizes text → object
  const applyCustomSizes=()=>{
    const labels=customSizes.split(",").map(s=>s.trim()).filter(Boolean);
    const obj={};
    labels.forEach(s=>{ obj[s]=sizes[s]??0; });
    setSizes(obj);
  };

  const sizeLabels=Object.keys(sizes);

  const validate=()=>{
    const e={};
    if(!name.trim())         e.name="Required";
    if(!price||isNaN(+price))e.price="Enter a valid price";
    if(sizeLabels.length===0)e.sizes="Add at least one size";
    return e;
  };

  const handleSave=()=>{
    const e=validate(); setErr(e);
    if(Object.keys(e).length)return;
    const sizesArr=sizeLabels.map(s=>({s,q:Number(sizes[s])||0}));
    const prod={
      id: isEdit?initial.id:uid(),
      name:name.trim(), category,
      price:Number(price), was:was?Number(was):null,
      desc:desc.trim(),
      details:details.split("\n").map(s=>s.trim()).filter(Boolean),
      imageUrl:imageUrl.trim()||null,
      bg,
      sizes:sizesArr,
    };
    onSave(prod);
  };

  const CATEGORIES=["SHIRTS","TROUSERS","KNITWEAR","JACKETS","OUTERWEAR","DENIM","SHORTS","ACCESSORIES"];
  const BG_OPTIONS=[
    {label:"Stone Beige",  val:"linear-gradient(145deg,#e8ddd0,#c4b4a4,#a89888)"},
    {label:"Tan Brown",    val:"linear-gradient(145deg,#c8b890,#a89868,#887848)"},
    {label:"Navy Deep",    val:"linear-gradient(145deg,#2c3e5a,#1a2840,#0d1828)"},
    {label:"Charcoal",     val:"linear-gradient(145deg,#3a3a3a,#252525,#141414)"},
    {label:"Warm Linen",   val:"linear-gradient(145deg,#d4c8b0,#b8a888,#9c8a6a)"},
    {label:"Denim Blue",   val:"linear-gradient(145deg,#3a4a6a,#2a3858,#1a2844)"},
    {label:"Forest Green", val:"linear-gradient(145deg,#2a3a2a,#1a2a1a,#0d1a0d)"},
    {label:"Rust Terracotta",val:"linear-gradient(145deg,#6a3a2a,#4a2a1a,#2a1a0d)"},
    {label:"Pearl White",  val:"linear-gradient(145deg,#f0e8dc,#ddd0c0,#c8b8a4)"},
    {label:"Slate Grey",   val:"linear-gradient(145deg,#4a4a5a,#3a3a4a,#2a2a3a)"},
  ];

  const fi=(val,set,label,col2=false,type="text",placeholder="")=>(
    <div style={{gridColumn:col2?"span 2":"span 1"}}>
      <label style={labelSt}>{label}</label>
      <input type={type} value={val} placeholder={placeholder} onChange={e=>set(e.target.value)}
        style={{...inputSt,borderColor:err[label?.toLowerCase()]?C.error:C.border}}/>
    </div>
  );

  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,padding:36}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={{gridColumn:"span 2"}}>
          <label style={labelSt}>Product Name {err.name&&<span style={{color:C.error,marginLeft:8}}>{err.name}</span>}</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={{...inputSt,borderColor:err.name?C.error:C.border}} placeholder="e.g. Oxford Dress Shirt"/>
        </div>

        <div>
          <label style={labelSt}>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{...inputSt,cursor:"pointer"}}>
            {CATEGORIES.map(c=><option key={c} value={c} style={{background:"#1a1a1a"}}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelSt}>Price (₹) {err.price&&<span style={{color:C.error,marginLeft:8}}>{err.price}</span>}</label>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{...inputSt,borderColor:err.price?C.error:C.border}} placeholder="2499"/>
        </div>

        <div>
          <label style={labelSt}>Original Price / Was (₹) — leave blank if no sale</label>
          <input type="number" value={was} onChange={e=>setWas(e.target.value)} style={inputSt} placeholder="3299"/>
        </div>

        <div>
          <label style={labelSt}>Image URL — leave blank to use color swatch</label>
          <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} style={inputSt} placeholder="https://images.unsplash.com/..."/>
        </div>

        <div style={{gridColumn:"span 2"}}>
          <label style={labelSt}>Description</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}
            style={{...inputSt,resize:"vertical",lineHeight:1.6}} placeholder="A concise, compelling product description..."/>
        </div>

        <div style={{gridColumn:"span 2"}}>
          <label style={labelSt}>Product Details / Bullet Points — one per line</label>
          <textarea value={details} onChange={e=>setDetails(e.target.value)} rows={4}
            style={{...inputSt,resize:"vertical",lineHeight:1.8}} placeholder={"100% Egyptian Cotton\nMother-of-pearl buttons\nMachine washable 30°C"}/>
        </div>

        {/* Color Swatch */}
        <div style={{gridColumn:"span 2"}}>
          <label style={labelSt}>Background Colour Swatch — used when no image is provided</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:12}}>
            {BG_OPTIONS.map(opt=>(
              <button key={opt.val} onClick={()=>setBg(opt.val)}
                style={{width:44,height:44,background:opt.val,border:`2px solid ${bg===opt.val?C.gold:"transparent"}`,cursor:"pointer",title:opt.label}}
                title={opt.label}/>
            ))}
          </div>
          <div style={{width:"100%",height:48,background:bg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",paddingLeft:14}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.12em"}}>Preview</span>
          </div>
        </div>
      </div>

      {/* SIZE SECTION */}
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:28,marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <p style={{...labelSt,marginBottom:0}}>Sizes & Stock Quantities {err.sizes&&<span style={{color:C.error,marginLeft:8}}>{err.sizes}</span>}</p>
        </div>

        {/* Preset selector */}
        <div style={{marginBottom:20}}>
          <label style={labelSt}>Size Preset</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {Object.keys(SIZE_PRESETS).map(preset=>(
              <button key={preset} onClick={()=>applyPreset(preset)}
                style={{...ghostBtn,padding:"8px 16px",fontSize:10,
                  background:sizePreset===preset?C.goldBg:"transparent",
                  borderColor:sizePreset===preset?C.gold:C.border,
                  color:sizePreset===preset?C.gold:C.muted}}>
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom sizes input */}
        {sizePreset==="Custom"&&(
          <div style={{marginBottom:16,display:"flex",gap:12,alignItems:"end"}}>
            <div style={{flex:1}}>
              <label style={labelSt}>Enter sizes separated by commas</label>
              <input value={customSizes} onChange={e=>setCustomSizes(e.target.value)}
                placeholder="e.g. 36R, 38R, 40R, 42R, 44R"
                style={inputSt}/>
            </div>
            <button onClick={applyCustomSizes} style={{...goldBtn,padding:"11px 20px",whiteSpace:"nowrap"}}>Apply</button>
          </div>
        )}

        {/* Size / Quantity inputs */}
        {sizeLabels.length>0&&(
          <div>
            <p style={{fontSize:11,color:C.muted,marginBottom:14,letterSpacing:"0.1em"}}>Enter stock quantity for each size (0 = sold out)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
              {sizeLabels.map(s=>(
                <div key={s} style={{background:"#111",border:`1px solid ${C.border}`,padding:"12px 16px",minWidth:100}}>
                  <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold,marginBottom:8}}>{s}</p>
                  <input type="number" min={0} value={sizes[s]??0}
                    onChange={e=>setSizes(p=>({...p,[s]:Number(e.target.value)}))}
                    style={{...inputSt,padding:"8px 10px",fontSize:14,fontWeight:600,textAlign:"center",width:"100%"}}/>
                </div>
              ))}
            </div>
          </div>
        )}
        {sizeLabels.length===0&&sizePreset!=="Custom"&&(
          <p style={{fontSize:12,color:C.muted}}>Select a size preset above to populate size options.</p>
        )}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:14,justifyContent:"flex-end",borderTop:`1px solid ${C.border}`,paddingTop:24}}>
        <button onClick={onCancel} style={{...ghostBtn,padding:"12px 28px"}}>Cancel</button>
        <button onClick={handleSave} style={{...goldBtn,padding:"12px 32px",background:C.admin}}>
          {isEdit?"Save Changes":"Add to Catalog"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════
function Section({title,children}){
  return(
    <div style={{marginBottom:36}}>
      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,marginBottom:20,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>{title}</h3>
      {children}
    </div>
  );
}

function SummaryBox({subtotal,shipInfo,total,country,children}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,padding:26,height:"fit-content",position:"sticky",top:80}}>
      <p style={{fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:C.muted,marginBottom:22}}>Order Summary</p>
      <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13}}>Subtotal</span><span style={{fontSize:13}}>{fmt(subtotal)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
          <div><p style={{fontSize:13}}>Shipping</p><p style={{fontSize:11,color:C.gold,marginTop:2}}>{country} — {shipInfo.label}</p><p style={{fontSize:11,color:C.dim}}>{shipInfo.days}</p></div>
          <span style={{fontSize:13,color:C.gold}}>{fmt(shipInfo.cost)}</span>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:17,fontWeight:600}}>
        <span>Total</span><span style={{color:C.gold}}>{fmt(total)}</span>
      </div>
      {children}
      <p style={{fontSize:10,color:C.dim,textAlign:"center",marginTop:12}}>Secure checkout · Free returns</p>
    </div>
  );
}

function Spinner(){
  return <span style={{width:13,height:13,border:"2px solid rgba(9,9,9,0.4)",borderTopColor:C.bg,borderRadius:"50%",display:"inline-block",animation:"spin 0.75s linear infinite"}}/>;
}