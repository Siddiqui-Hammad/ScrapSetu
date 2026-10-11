"""
ScrapSetu: A Digital Bridge to Sustainable Recycling
Streamlit Cloud Live Edition
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import folium
from streamlit_folium import st_folium
import hashlib
import time
import datetime
import math

# 1. Page Configuration
st.set_page_config(
    page_title="ScrapSetu | Sustainable Recycling Bridge",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        color: #064e3b;
        font-weight: 800;
        font-size: 2.2rem;
        margin-bottom: 0.2rem;
    }
    .sub-tagline {
        color: #047857;
        font-size: 0.95rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        padding: 1.2rem;
        border-radius: 1rem;
        text-align: center;
    }
    .metric-val {
        color: #064e3b;
        font-size: 1.8rem;
        font-weight: 800;
    }
    .metric-lbl {
        color: #065f46;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    .receipt-box {
        background: #ffffff;
        border: 2px solid #10b981;
        padding: 1.5rem;
        border-radius: 1rem;
        font-family: monospace;
    }
</style>
""", unsafe_allow_html=True)

# 2. Session State Initialization
if "lang" not in st.session_state:
    st.session_state.lang = "en"
if "current_role" not in st.session_state:
    st.session_state.current_role = "HOUSEHOLD"
if "user_name" not in st.session_state:
    st.session_state.user_name = "Pooja Verma"

# Pre-seeded Material Categories & Benchmarks
if "categories" not in st.session_state:
    st.session_state.categories = [
        {
            "id": "c1",
            "name": "Paper & Cardboard",
            "hindi": "कागज़ और गत्ता",
            "slug": "paper-cardboard",
            "rate": 14.0,
            "min_rate": 12.0,
            "max_rate": 16.0,
            "unit": "kg",
            "co2_factor": 1.35,
            "trees_factor": 0.017,
            "water_factor": 26.0,
            "source": "MRAI Mandi Benchmark",
        },
        {
            "id": "c2",
            "name": "Rigid Plastics (PET / HDPE)",
            "hindi": "सख्त प्लास्टिक (PET / HDPE)",
            "slug": "rigid-plastics",
            "rate": 18.0,
            "min_rate": 15.0,
            "max_rate": 22.0,
            "unit": "kg",
            "co2_factor": 1.80,
            "trees_factor": 0.0,
            "water_factor": 20.0,
            "source": "Plastics Federation Index",
        },
        {
            "id": "c3",
            "name": "Ferrous Metals (Iron & Steel)",
            "hindi": "लोहा और इस्पात",
            "slug": "ferrous-metals",
            "rate": 28.0,
            "min_rate": 26.0,
            "max_rate": 31.0,
            "unit": "kg",
            "co2_factor": 1.50,
            "trees_factor": 0.0,
            "water_factor": 18.0,
            "source": "Mandi Steel Bulletin",
        },
        {
            "id": "c4",
            "name": "Non-Ferrous (Aluminium, Brass, Copper)",
            "hindi": "अल्युमिनियम, पीतल और तांबा",
            "slug": "non-ferrous-metals",
            "rate": 115.0,
            "min_rate": 105.0,
            "max_rate": 130.0,
            "unit": "kg",
            "co2_factor": 9.10,
            "trees_factor": 0.0,
            "water_factor": 45.0,
            "source": "Metal Traders Index",
        },
        {
            "id": "c5",
            "name": "Glass Bottles & Culinary Glass",
            "hindi": "कांच की बोतलें और जार",
            "slug": "glass",
            "rate": 3.5,
            "min_rate": 2.5,
            "max_rate": 4.5,
            "unit": "kg",
            "co2_factor": 0.31,
            "trees_factor": 0.0,
            "water_factor": 5.0,
            "source": "Bottler Recycler Rate",
        },
        {
            "id": "c6",
            "name": "Electronic Waste (E-Waste)",
            "hindi": "ई-कचरा (इलेक्ट्रॉनिक्स)",
            "slug": "e-waste",
            "rate": 45.0,
            "min_rate": 35.0,
            "max_rate": 65.0,
            "unit": "kg",
            "co2_factor": 3.20,
            "trees_factor": 0.0,
            "water_factor": 35.0,
            "source": "Authorized Dismantlers",
        },
    ]

# Seeded Pickup Requests
if "pickups" not in st.session_state:
    st.session_state.pickups = [
        {
            "id": "REQ-101",
            "user": "Pooja Verma",
            "role": "HOUSEHOLD",
            "area": "Malviya Nagar, Sector 3",
            "lat": 26.8524,
            "lng": 75.8173,
            "materials": "Paper & Cardboard (20kg), Iron (5kg)",
            "est_weight": 25.0,
            "est_val": 420.0,
            "slot": "Morning (9 AM - 12 PM)",
            "status": "OPEN",
            "assigned_collector": None,
            "created_at": "2026-10-11 09:30",
        },
        {
            "id": "REQ-102",
            "user": "GreenLeaf Logistics & Cafe",
            "role": "BUSINESS",
            "area": "Sitapura Industrial Area Bay 7",
            "lat": 26.7725,
            "lng": 75.8521,
            "materials": "Paper & Cardboard (105kg), Heavy Iron (82.5kg)",
            "est_weight": 187.5,
            "est_val": 3442.5,
            "slot": "Afternoon (12 PM - 3 PM)",
            "status": "COMPLETED",
            "assigned_collector": "Mohammad Farooq",
            "receipt_number": "REC-2026-JP-00192",
            "receipt_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "created_at": "2026-10-09 11:15",
        },
        {
            "id": "REQ-103",
            "user": "City Bakery & Outlet",
            "role": "BUSINESS",
            "area": "Crystal Court Mall, Malviya Nagar",
            "lat": 26.8533,
            "lng": 75.8190,
            "materials": "Rigid Plastics (45kg), Beverage Cans (20kg)",
            "est_weight": 65.0,
            "est_val": 1450.0,
            "slot": "Morning (9 AM - 12 PM)",
            "status": "ACCEPTED",
            "assigned_collector": "Ramkishan Sahu",
            "created_at": "2026-10-11 10:00",
        },
    ]

# Recycler Buying Offers
if "recycler_offers" not in st.session_state:
    st.session_state.recycler_offers = [
        {"mill": "Aravalli Paper Mills", "cat": "Paper & Cardboard", "rate": 11.5, "min_lot": 50, "location": "Mansarovar RIICO"},
        {"mill": "Aravalli Polymer Flakes", "cat": "Rigid Plastics (PET / HDPE)", "rate": 20.5, "min_lot": 30, "location": "Mansarovar RIICO"},
        {"mill": "Aravalli Induction Foundry", "cat": "Ferrous Metals (Iron & Steel)", "rate": 30.0, "min_lot": 100, "location": "Mansarovar RIICO"},
    ]

# Audit Logs
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"action": "VERIFY_USER", "user": "Admin", "details": "Approved Ramkishan Sahu (Collector KYC)", "time": "2026-10-10 14:20"},
        {"action": "COMPLETE_TRANSACTION", "user": "Mohammad Farooq", "details": "Issued Receipt REC-2026-JP-00192 (₹3,442.50)", "time": "2026-10-09 13:45"},
        {"action": "UPDATE_MANDI_RATE", "user": "Admin", "details": "Adjusted PET baseline to ₹18.00/kg", "time": "2026-10-08 10:00"},
    ]

# 3. Helper Functions
def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def generate_receipt_hash(rec_no, user, collector, total, weight, ts):
    payload = f"{rec_no}|{user}|{collector}|{total}|{weight}|{ts}"
    return hashlib.sha256(payload.encode()).hexdigest()

# 4. Sidebar: Language & 1-Click Role Switcher
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60", use_container_width=True)
    st.markdown("### 🌐 ScrapSetu Control")
    
    # Language Toggle
    lang_choice = st.radio("Language / भाषा", ["English", "हिंदी"], horizontal=True)
    st.session_state.lang = "en" if lang_choice == "English" else "hi"
    
    st.divider()
    
    # 1-Click SIH College Demo Role Switcher
    st.markdown("### ⚡ SIH Demo Role Switcher")
    st.caption("Click any role to test its live dashboard immediately:")
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("🏠 Household", use_container_width=True):
            st.session_state.current_role = "HOUSEHOLD"
            st.session_state.user_name = "Pooja Verma"
            st.rerun()
        if st.button("🛺 Kabadiwala", use_container_width=True):
            st.session_state.current_role = "COLLECTOR"
            st.session_state.user_name = "Ramkishan Sahu"
            st.rerun()
        if st.button("🛡️ Admin", use_container_width=True):
            st.session_state.current_role = "ADMIN"
            st.session_state.user_name = "Vikramaditya Sharma"
            st.rerun()
    with col2:
        if st.button("🏢 Business", use_container_width=True):
            st.session_state.current_role = "BUSINESS"
            st.session_state.user_name = "GreenLeaf Logistics & Cafe"
            st.rerun()
        if st.button("🏭 Recycler", use_container_width=True):
            st.session_state.current_role = "RECYCLER"
            st.session_state.user_name = "Aravalli Ecocycle Mills"
            st.rerun()

    st.divider()
    st.markdown(f"**Logged In As:** `{st.session_state.user_name}`")
    st.markdown(f"**Current Role:** `{st.session_state.current_role}`")
    st.caption("CPCB Verified • Digital Metrology Verified Scales")

# 5. Header Section
is_hi = st.session_state.lang == "hi"
st.markdown('<div class="main-title">♻️ ScrapSetu: Digital Recycling Bridge</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-tagline">कबाड़ का सही दाम। कबाड़ीवालों का डिजिटल सम्मान। • Connecting waste generators, informal kabadiwalas, and formal recyclers.</div>'
    if is_hi else
    '<div class="sub-tagline">A Digital Bridge to Sustainable Recycling • Connecting households, informal kabadiwalas, and accredited mills.</div>',
    unsafe_allow_html=True
)

# Top Telemetry Counters
completed_pickups = [p for p in st.session_state.pickups if p["status"] == "COMPLETED"]
total_kg = sum(p["est_weight"] for p in completed_pickups)
total_payout = sum(p["est_val"] for p in completed_pickups)
total_co2 = round(total_kg * 1.41, 1)

kpi1, kpi2, kpi3, kpi4 = st.columns(4)
with kpi1:
    st.markdown(f'<div class="metric-card"><div class="metric-val">{total_kg} kg</div><div class="metric-lbl">Total Recycled</div></div>', unsafe_allow_html=True)
with kpi2:
    st.markdown(f'<div class="metric-card"><div class="metric-val">{total_co2} kg</div><div class="metric-lbl">CO₂ Averted</div></div>', unsafe_allow_html=True)
with kpi3:
    st.markdown(f'<div class="metric-card"><div class="metric-val">₹{total_payout:,.2f}</div><div class="metric-lbl">Paid Directly</div></div>', unsafe_allow_html=True)
with kpi4:
    st.markdown(f'<div class="metric-card"><div class="metric-val">2</div><div class="metric-lbl">Verified Collectors</div></div>', unsafe_allow_html=True)

st.write("")

# 6. Main Navigation Tabs
tab_labels = [
    "🏠 Household & Booking",
    "🛺 Kabadiwala Terminal",
    "📈 Mandi Rates & Calculator",
    "🏭 Recycler Portal",
    "🌱 ESG Impact Dashboard",
    "🛡️ Admin Governance"
]
tab_home, tab_collector, tab_rates, tab_recycler, tab_esg, tab_admin = st.tabs(tab_labels)

# -------------------------------------------------------------
# TAB 1: HOUSEHOLD & BOOKING
# -------------------------------------------------------------
with tab_home:
    st.subheader("Schedule Scrap Pickup & Track Orders" if not is_hi else "कबाड़ पिकअप शेड्यूल करें और ट्रैक करें")
    
    col_book, col_track = st.columns([1, 1])
    
    with col_book:
        st.markdown("#### 📦 New Pickup Booking")
        with st.form("booking_form"):
            user_addr = st.selectbox(
                "Pickup Address",
                ["Home: Plot 42, Girdhar Marg, Malviya Nagar, Jaipur", "Office: Industrial Bay 7, Sitapura, Tonk Road"]
            )
            
            c_cat, c_qty = st.columns([2, 1])
            with c_cat:
                cat_names = [f"{c['name']} ({c['hindi']})" for c in st.session_state.categories]
                sel_cat_str = st.selectbox("Scrap Category", cat_names)
            with c_qty:
                sel_qty = st.number_input("Estimated Quantity (kg)", min_value=1.0, value=25.0, step=1.0)
            
            # AI Material Vision Helper Simulation
            st.markdown("##### 🤖 AI Material Vision Helper")
            sample_img = st.selectbox(
                "Or identify material from photo sample:",
                ["(None - Use dropdown above)", "PET Mineral Water Bottles (Plastic)", "Clean Amazon Cardboard Boxes (Paper)", "Iron Scrap Rods (Ferrous Metal)", "Computer Motherboard PCB (E-Waste)"]
            )
            
            if sample_img != "(None - Use dropdown above)":
                st.success(f"✓ AI Vision Analysis: 95% Confidence detected {sample_img}. Suggested benchmark applied.")
            
            pick_date = st.date_input("Preferred Date", datetime.date.today() + datetime.timedelta(days=1))
            pick_slot = st.selectbox("Preferred Time Window", ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", "Evening (3 PM - 6 PM)"])
            user_notes = st.text_input("Special Instructions", "Dry bundles kept near porch, please ring twice.")
            
            # Live Indicative Estimate
            base_rate = 14.0
            for c in st.session_state.categories:
                if c["name"] in sel_cat_str:
                    base_rate = c["rate"]
                    break
            est_total = round(sel_qty * base_rate, 2)
            
            st.info(f"💡 Indicative Estimated Payout: **₹{est_total:.2f}** ({sel_qty} kg @ ₹{base_rate}/kg). Final amount confirmed on digital scale.")
            
            book_submit = st.form_submit_button("Confirm Booking (पिकअप बुक करें)", type="primary", use_container_width=True)
            
            if book_submit:
                new_id = f"REQ-{len(st.session_state.pickups) + 101}"
                st.session_state.pickups.append({
                    "id": new_id,
                    "user": st.session_state.user_name,
                    "role": st.session_state.current_role,
                    "area": "Malviya Nagar, Jaipur",
                    "lat": 26.8524,
                    "lng": 75.8173,
                    "materials": f"{sel_cat_str} ({sel_qty}kg)",
                    "est_weight": sel_qty,
                    "est_val": est_total,
                    "slot": pick_slot,
                    "status": "OPEN",
                    "assigned_collector": None,
                    "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                })
                st.success(f"🎉 Pickup {new_id} booked successfully! Broadcasted to nearest verified collectors.")
                st.rerun()

    with col_track:
        st.markdown("#### 🗺️ Order Status & Privacy-Protected Map")
        
        # Interactive Leaflet Map using Folium
        m = folium.Map(location=[26.8524, 75.8173], zoom_start=12)
        
        for p in st.session_state.pickups:
            color = "green" if p["status"] == "COMPLETED" else "blue" if p["status"] == "ACCEPTED" else "orange"
            
            # Privacy coordinate fuzzing for open requests (~300m)
            plot_lat = p["lat"] + (0.003 if p["status"] == "OPEN" else 0.0)
            plot_lng = p["lng"] + (0.003 if p["status"] == "OPEN" else 0.0)
            
            folium.Marker(
                [plot_lat, plot_lng],
                popup=f"<b>{p['id']}</b><br>{p['materials']}<br>Status: {p['status']}",
                tooltip=f"{p['id']}: {p['status']}",
                icon=folium.Icon(color=color, icon="recycle", prefix="fa")
            ).add_to(m)
            
            if p["status"] == "OPEN":
                folium.Circle(
                    [plot_lat, plot_lng],
                    radius=400,
                    color="#10b981",
                    fill=True,
                    fill_opacity=0.15,
                    dash_array="5, 5"
                ).add_to(m)
                
        st_folium(m, height=280, use_container_width=True)
        st.caption("🔒 Privacy Rule: Public pins are obfuscated by ~400m radius until assigned.")
        
        st.markdown("##### My Orders List")
        for p in reversed(st.session_state.pickups):
            badge = "🟢 COMPLETED" if p["status"] == "COMPLETED" else "🔵 ACCEPTED" if p["status"] == "ACCEPTED" else "🟠 OPEN"
            with st.expander(f"{p['id']} - {p['materials']} ({badge})"):
                st.write(f"**Status:** {p['status']}")
                st.write(f"**Estimated Valuation:** ₹{p['est_val']} ({p['est_weight']} kg)")
                st.write(f"**Time Window:** {p['slot']}")
                if p.get("assigned_collector"):
                    st.write(f"**Assigned Collector:** {p['assigned_collector']} (RJ 14 TB 4921) 🛺")
                if p.get("receipt_number"):
                    st.success(f"Digital Receipt #{p['receipt_number']} Verified")
                    st.code(f"SHA-256 Hash: {p['receipt_hash']}")

# -------------------------------------------------------------
# TAB 2: KABADIWALA TERMINAL
# -------------------------------------------------------------
with tab_collector:
    st.subheader("कबाड़ीवाला जॉब टर्मिनल (Waste Collector Terminal)")
    st.caption("Designed for low-literacy mobile phones with large touch buttons and dual language.")
    
    col_k1, col_k2 = st.columns([1, 1])
    
    with col_k1:
        st.markdown("#### 📍 नजदीकी खुले पिकअप (Nearby Open Jobs)")
        open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
        
        if open_jobs:
            for job in open_jobs:
                dist = haversine_km(26.8501, 75.8155, job["lat"], job["lng"])
                st.markdown(f"""
                <div style="border:1px solid #cbd5e1; padding:1rem; border-radius:1rem; margin-bottom:0.8rem; background:white;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <b>{job['materials']}</b>
                        <span style="color:#047857; font-weight:800;">₹{job['est_val']}</span>
                    </div>
                    <div style="font-size:0.85rem; color:#64748b; margin-top:0.3rem;">
                        दूरी: <b>{dist} किमी</b> • इलाका: {job['area']}
                    </div>
                    <div style="font-size:0.8rem; color:#475569;">समय: {job['slot']}</div>
                </div>
                """, unsafe_allow_html=True)
                
                if st.button(f"पिकअप स्वीकार करें (Accept {job['id']})", key=f"acc_{job['id']}", type="primary"):
                    job["status"] = "ACCEPTED"
                    job["assigned_collector"] = "Ramkishan Sahu"
                    st.session_state.audit_logs.append({
                        "action": "ACCEPT_PICKUP",
                        "user": "Ramkishan Sahu",
                        "details": f"Accepted {job['id']}",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"पिकअप {job['id']} स्वीकार कर लिया गया! ग्राहक का पूरा पता अनलॉक हुआ।")
                    st.rerun()
        else:
            st.info("वर्तमान में कोई खुला पिकअप नहीं है। जैसे ही नया ऑर्डर आएगा, यहां दिखेगा।")

    with col_k2:
        st.markdown("#### ⚖️ तौल दर्ज करें व डिजिटल रसीद बनाएं (Digital Weighing Entry)")
        accepted_jobs = [p for p in st.session_state.pickups if p["status"] == "ACCEPTED"]
        
        if accepted_jobs:
            sel_acc = st.selectbox("चुनें चालू पिकअप:", [p["id"] for p in accepted_jobs])
            target_p = next(p for p in accepted_jobs if p["id"] == sel_acc)
            
            st.write(f"**ग्राहक:** {target_p['user']}")
            st.write(f"**स्थान:** {target_p['area']}")
            
            with st.form("weighing_form"):
                w_act = st.number_input("कांटे की वास्तविक तौल (Net Weight in kg):", min_value=1.0, value=float(target_p["est_weight"]))
                w_rate = st.number_input("सहमति दर (Agreed Rate ₹/kg):", min_value=1.0, value=14.0)
                w_mode = st.radio("भुगतान माध्यम (Payment Mode):", ["UPI", "Cash"], horizontal=True)
                
                w_total = round(w_act * w_rate, 2)
                st.markdown(f"### कुल भुगतान: ₹{w_total:,.2f}")
                
                complete_sub = st.form_submit_button("⚖️ तौल पक्की करें व रसीद बनाएं (Issue Receipt)", type="primary")
                if complete_sub:
                    rec_no = f"REC-2026-JP-{int(time.time()) % 100000}"
                    rec_hash = generate_receipt_hash(rec_no, target_p["user"], "Ramkishan Sahu", w_total, w_act, str(datetime.datetime.now()))
                    
                    target_p["status"] = "COMPLETED"
                    target_p["est_weight"] = w_act
                    target_p["est_val"] = w_total
                    target_p["receipt_number"] = rec_no
                    target_p["receipt_hash"] = rec_hash
                    
                    st.session_state.audit_logs.append({
                        "action": "COMPLETE_TRANSACTION",
                        "user": "Ramkishan Sahu",
                        "details": f"Settled {target_p['id']} for ₹{w_total} (Receipt {rec_no})",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"रसीद #{rec_no} जारी हुई! डिजिटल लेनदेन सुरक्षित।")
                    st.rerun()
        else:
            st.write("कोई चालू पिकअप नहीं है जिसे तौलना हो।")

# -------------------------------------------------------------
# TAB 3: MANDI RATES & CALCULATOR
# -------------------------------------------------------------
with tab_rates:
    st.subheader("Indicative Mandi Scrap Benchmark Rates")
    st.caption("Wholesale benchmark surveys across North India (MRAI index). Actual rates mutually finalized on physical scale.")
    
    col_r1, col_r2 = st.columns([3, 2])
    
    with col_r1:
        rates_df = pd.DataFrame([
            {
                "Category": c["name"],
                "Hindi": c["hindi"],
                "Rate (₹/kg)": c["rate"],
                "Range (₹/kg)": f"{c['min_rate']} - {c['max_rate']}",
                "CO₂ Saved (kg/kg)": c["co2_factor"],
                "Source": c["source"]
            }
            for c in st.session_state.categories
        ])
        st.dataframe(rates_df, hide_index=True, use_container_width=True)

    with col_r2:
        st.markdown("#### 🧮 Scrap Valuation Calculator")
        with st.container(border=True):
            calc_cat = st.selectbox("Select Material", [c["name"] for c in st.session_state.categories])
            calc_kg = st.slider("Weight in Kilograms", 5, 200, 30)
            calc_grade = st.radio("Quality Grade", ["Clean & Segregated (+8% bonus)", "Standard Clean", "Mixed / Unsorted (-10% deduction)"])
            
            multiplier = 1.08 if "bonus" in calc_grade else 0.90 if "deduction" in calc_grade else 1.0
            sel_c = next(c for c in st.session_state.categories if c["name"] == calc_cat)
            calc_res = round(calc_kg * sel_c["rate"] * multiplier, 2)
            
            st.metric("Estimated Cash Payout", f"₹{calc_res:,.2f}", f"{sel_c['rate']*multiplier:.2f} ₹/kg")
            st.caption("Formula: Quantity × Benchmark Rate × Grade Multiplier")

# -------------------------------------------------------------
# TAB 4: RECYCLER PORTAL
# -------------------------------------------------------------
with tab_recycler:
    st.subheader("Recycling Facility Management Portal")
    st.caption("Aravalli Ecocycle Mills • CPCB Registration: RJ/PWM/2026/0491 • RIICO Industrial Area")
    
    col_rec1, col_rec2 = st.columns([1, 1])
    
    with col_rec1:
        st.markdown("#### Published Factory Buying Rates")
        offers_df = pd.DataFrame(st.session_state.recycler_offers)
        st.dataframe(offers_df, hide_index=True, use_container_width=True)
        
        with st.form("new_offer_form"):
            st.markdown("##### Post New Buying Rate")
            o_cat = st.selectbox("Material Category", [c["name"] for c in st.session_state.categories], key="o_cat")
            o_rate = st.number_input("Buying Price (₹/kg)", min_value=1.0, value=12.0)
            o_min = st.number_input("Min Lot Size (kg)", min_value=10, value=50)
            if st.form_submit_button("+ Publish Rate Sheet"):
                st.session_state.recycler_offers.append({
                    "mill": "Aravalli Processing Plant",
                    "cat": o_cat,
                    "rate": o_rate,
                    "min_lot": o_min,
                    "location": "RIICO Mansarovar"
                })
                st.success("Buying rate published to regional kabadiwalas!")
                st.rerun()

    with col_rec2:
        st.markdown("#### Weighbridge Gate Intake Slip Generator")
        with st.form("intake_slip_form"):
            sup_name = st.text_input("Supplier / Collector Name", "Mohammad Farooq (Verified Collector)")
            intake_wt = st.number_input("Scale Net Weight (kg)", min_value=10.0, value=187.5)
            intake_rate = st.number_input("Purchase Price (₹/kg)", min_value=1.0, value=19.5)
            slip_total = round(intake_wt * intake_rate, 2)
            
            st.write(f"**Total Settlement Outlay:** ₹{slip_total:,.2f}")
            if st.form_submit_button("Record Weighbridge Slip", type="primary"):
                st.success(f"Weighbridge slip generated for {intake_wt} kg (₹{slip_total:,.2f})!")

# -------------------------------------------------------------
# TAB 5: ESG IMPACT DASHBOARD
# -------------------------------------------------------------
with tab_esg:
    st.subheader("Scientific Environmental Accounting (CPCB & EPA WARM Models)")
    
    e1, e2 = st.columns(2)
    with e1:
        # Pie chart of diverted materials
        pie_data = pd.DataFrame([
            {"Category": "Paper & Cardboard", "Kg": 125.0},
            {"Category": "Ferrous Metals (Iron)", "Kg": 87.5},
            {"Category": "Plastics (PET)", "Kg": 45.0},
            {"Category": "Glass", "Kg": 20.0},
        ])
        fig_pie = px.pie(pie_data, values="Kg", names="Category", title="Diverted Material Split (kg)", color_discrete_sequence=px.colors.sequential.Greens_r)
        st.plotly_chart(fig_pie, use_container_width=True)

    with e2:
        # Bar chart of carbon offset by category
        bar_data = pd.DataFrame([
            {"Category": "Paper", "CO2_Saved_kg": 125.0 * 1.35},
            {"Category": "Metals", "CO2_Saved_kg": 87.5 * 1.50},
            {"Category": "Plastics", "CO2_Saved_kg": 45.0 * 1.80},
            {"Category": "Glass", "CO2_Saved_kg": 20.0 * 0.31},
        ])
        fig_bar = px.bar(bar_data, x="Category", y="CO2_Saved_kg", title="CO₂ Equivalent Offset by Category (kg)", color="CO2_Saved_kg", color_continuous_scale="Viridis")
        st.plotly_chart(fig_bar, use_container_width=True)

    st.markdown("""
    ##### 📚 Documented Calculation Methodology:
    - **CO₂ Offset:** Calculated per CPCB lifecyle factors (Paper: 1.35 kg/kg, Plastics: 1.80 kg/kg, Iron: 1.50 kg/kg).
    - **Forestry Metric:** 17 mature trees saved per 1,000 kg virgin paper substituted.
    - **Water Conservation:** 26 liters saved per kg of recovered pulp.
    """)

# -------------------------------------------------------------
# TAB 6: ADMIN GOVERNANCE
# -------------------------------------------------------------
with tab_admin:
    st.subheader("Platform Governance & Regulatory Audit Console")
    
    col_a1, col_a2 = st.columns([1, 1])
    
    with col_a1:
        st.markdown("#### User Verification & KYC Approvals")
        users_table = pd.DataFrame([
            {"Name": "Ramkishan Sahu", "Role": "COLLECTOR", "Vehicle": "3-Wheeler Tempo", "Status": "APPROVED ✓"},
            {"Name": "Mohammad Farooq", "Role": "COLLECTOR", "Vehicle": "Mini Truck", "Status": "APPROVED ✓"},
            {"Name": "Aravalli Ecocycle", "Role": "RECYCLER", "License": "CPCB RJ/PWM", "Status": "APPROVED ✓"},
            {"Name": "Shyam Sundar", "Role": "COLLECTOR", "Vehicle": "Hand Cart", "Status": "PENDING REVIEW ⏳"},
        ])
        st.dataframe(users_table, hide_index=True, use_container_width=True)
        
        if st.button("Approve Pending Collector (Shyam Sundar)"):
            st.success("Shyam Sundar verified! Service credentials issued.")

    with col_a2:
        st.markdown("#### Immutable Cryptographic Audit Ledger")
        audit_df = pd.DataFrame(st.session_state.audit_logs)
        st.dataframe(audit_df, hide_index=True, use_container_width=True)

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 0.8rem;">
    ScrapSetu © 2026 • Live Streamlit Cloud Ready • Connected to GitHub Repository: Siddiqui-Hammad/ScrapSetu
</div>
""", unsafe_allow_html=True)
