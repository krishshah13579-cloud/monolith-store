import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// ═══════════════════════════════════════════════════════════════════
//  FIREBASE CONFIG (REPLACE WITH YOUR KEYS)
// ═══════════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const BRAND = "MONOLITH";
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ═══════════════════════════════════════════════════════════════════
//  MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════
export default function MonolithApp() {
  const [view, setView] = useState("home"); // home, detail, cart, login, admin
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    const unsubData = onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubAuth(); unsubData(); };
  }, []);

  const addToCart = (p) => {
    setCart([...cart, { ...p, cartId: Date.now() }]);
    setIsCartOpen(true);
  };

  return (
    <div style={s.app}>
      {/* --- NAVIGATION --- */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <h1 onClick={() => setView("home")} style={s.logo}>{BRAND}</h1>
          <div style={s.navLinks}>
            <span onClick={() => setView("home")}>NEW ARRIVALS</span>
            {user ? (
              <span onClick={() => signOut(auth)}>LOGOUT</span>
            ) : (
              <span onClick={() => setView("login")}>LOG IN</span>
            )}
            <span onClick={() => setIsCartOpen(true)}>BAG ({cart.length})</span>
            {user?.email === "admin@monolith.com" && (
              <span onClick={() => setView("admin")} style={{color:'red'}}>ADMIN</span>
            )}
          </div>
        </div>
      </nav>

      {/* --- PAGE CONTENT --- */}
      <main style={s.main}>
        {view === "home" && <Home products={products} setView={setView} setProduct={setSelectedProduct} />}
        {view === "detail" && <ProductDetail p={selectedProduct} onAdd={addToCart} />}
        {view === "login" && <Auth setView={setView} />}
        {view === "admin" && <AdminPanel />}
      </main>

      {/* --- SLIDE-OUT CART (ZARA STYLE) --- */}
      {isCartOpen && <CartDrawer cart={cart} close={() => setIsCartOpen(false)} setCart={setCart} />}

      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Home({ products, setView, setProduct }) {
  return (
    <div style={s.grid}>
      {products.map(p => (
        <div key={p.id} style={s.card} onClick={() => { setProduct(p); setView("detail"); }}>
          <div style={s.imgWrapper}>
            <img src={p.url} style={s.img} alt={p.name} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardTitle}>{p.name}</span>
            <span style={s.cardPrice}>{fmt(p.price)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDetail({ p, onAdd }) {
  return (
    <div style={s.detailPage}>
      <div style={s.detailImgSection}>
        <img src={p.url} style={s.detailImg} />
      </div>
      <div style={s.detailInfoSection}>
        <h2 style={s.detailTitle}>{p.name}</h2>
        <p style={s.detailDesc}>{p.description || "Premium quality garment designed for a modern silhouette."}</p>
        <span style={s.detailPrice}>{fmt(p.price)}</span>
        <button style={s.blackBtn} onClick={() => onAdd(p)}>ADD TO BAG</button>
      </div>
    </div>
  );
}

function Auth({ setView }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleAction = async () => {
    try {
      if (mode === "login") await signInWithEmailAndPassword(auth, email, pass);
      else await createUserWithEmailAndPassword(auth, email, pass);
      setView("home");
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={s.authBox}>
      <h2 style={s.sectionTitle}>{mode === "login" ? "LOG IN" : "REGISTER"}</h2>
      <input placeholder="EMAIL" style={s.input} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="PASSWORD" style={s.input} onChange={e => setPass(e.target.value)} />
      <button style={s.blackBtn} onClick={handleAction}>{mode.toUpperCase()}</button>
      <p style={s.toggle} onClick={() => setMode(mode === "login" ? "reg" : "login")}>
        {mode === "login" ? "CREATE ACCOUNT" : "HAVE AN ACCOUNT? LOG IN"}
      </p>
    </div>
  );
}

function AdminPanel() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file || !name || !price) return alert("Fill all fields");
    const r = ref(storage, `products/${Date.now()}`);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    await addDoc(collection(db, "products"), { name, price: Number(price), url, createdAt: Date.now() });
    alert("Product Published");
  };

  return (
    <div style={s.authBox}>
      <h2 style={s.sectionTitle}>INVENTORY MANAGER</h2>
      <input placeholder="ITEM NAME" style={s.input} onChange={e => setName(e.target.value)} />
      <input placeholder="PRICE" type="number" style={s.input} onChange={e => setPrice(e.target.value)} />
      <input type="file" style={s.input} onChange={e => setFile(e.target.files[0])} />
      <button style={s.blackBtn} onClick={upload}>PUBLISH TO STORE</button>
    </div>
  );
}

function CartDrawer({ cart, close, setCart }) {
  const total = cart.reduce((a, b) => a + b.price, 0);
  return (
    <div style={s.drawerOverlay} onClick={close}>
      <div style={s.drawer} onClick={e => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <span>CART ({cart.length})</span>
          <span onClick={close} style={{cursor:'pointer'}}>CLOSE</span>
        </div>
        <div style={s.drawerItems}>
          {cart.map(item => (
            <div key={item.cartId} style={s.cartItem}>
              <img src={item.url} style={s.cartImg} />
              <div>
                <p style={{fontSize:'12px', fontWeight:'600'}}>{item.name}</p>
                <p style={{fontSize:'11px'}}>{fmt(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={s.drawerFooter}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
            <span>TOTAL</span><span>{fmt(total)}</span>
          </div>
          <button style={s.blackBtn}>CONTINUE TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return <footer style={s.footer}>© {new Date().getFullYear()} {BRAND} — MINIMALISM AT ITS CORE.</footer>;
}

// ═══════════════════════════════════════════════════════════════════
//  STYLES (ZARA / H&M AESTHETIC)
// ═══════════════════════════════════════════════════════════════════
const s = {
  app: { backgroundColor: "#fff", minHeight: "100vh", color: "#000", fontFamily: "'Helvetica', sans-serif" },
  nav: { position: "sticky", top: 0, background: "#fff", zIndex: 10, padding: "20px 5%", borderBottom: "1px solid #f0f0f0" },
  navInner: { display: "flex", justifyContent: "space-between", alignItems: "baseline", maxWidth: "1600px", margin: "0 auto" },
  logo: { fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", cursor: "pointer", margin: 0 },
  navLinks: { display: "flex", gap: "25px", fontSize: "11px", fontWeight: "600" },
  main: { maxWidth: "1600px", margin: "0 auto", padding: "40px 5%" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px 15px" },
  card: { cursor: "pointer" },
  imgWrapper: { aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#f6f6f6" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  cardInfo: { marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "12px" },
  cardTitle: { fontWeight: "400", textTransform: "uppercase" },
  cardPrice: { fontWeight: "600" },
  detailPage: { display: "flex", flexWrap: "wrap", gap: "50px" },
  detailImgSection: { flex: "1 1 500px", aspectRatio: "3/4" },
  detailImg: { width: "100%", height: "100%", objectFit: "cover" },
  detailInfoSection: { flex: "1 1 300px", paddingTop: "50px" },
  detailTitle: { fontSize: "24px", fontWeight: "300", marginBottom: "20px" },
  detailDesc: { fontSize: "13px", lineHeight: "1.6", color: "#666", marginBottom: "30px" },
  detailPrice: { fontSize: "18px", fontWeight: "700", display: "block", marginBottom: "40px" },
  blackBtn: { width: "100%", padding: "18px", backgroundColor: "#000", color: "#fff", border: "none", fontSize: "11px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px" },
  authBox: { maxWidth: "400px", margin: "100px auto" },
  sectionTitle: { fontSize: "18px", marginBottom: "30px", fontWeight: "700" },
  input: { width: "100%", padding: "15px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "25px", outline: "none", fontSize: "12px" },
  toggle: { fontSize: "11px", marginTop: "20px", cursor: "pointer", color: "#999" },
  drawerOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.2)", zIndex: 1000 },
  drawer: { position: "fixed", top: 0, right: 0, width: "400px", height: "100%", backgroundColor: "#fff", padding: "40px", boxSizing: "border-box", display: "flex", flexDirection: "column" },
  drawerHeader: { display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "40px" },
  drawerItems: { flex: 1, overflowY: "auto" },
  cartItem: { display: "flex", gap: "15px", marginBottom: "20px" },
  cartImg: { width: "70px", height: "90px", objectFit: "cover" },
  drawerFooter: { borderTop: "1px solid #eee", paddingTop: "30px" },
  footer: { textAlign: "center", padding: "100px 0", fontSize: "10px", color: "#aaa", letterSpacing: "2px" }
};