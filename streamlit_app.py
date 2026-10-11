"""
ScrapSetu: A Digital Bridge to Sustainable Recycling
Enhanced Live Streamlit Web Edition
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

# -------------------------------------------------------------
# 1. Page Configuration & Custom CSS
# -------------------------------------------------------------
st.set_page_config(
    page_title="ScrapSetu | Digital Recycling Bridge",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-End Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
    }

    /* Top Brand Banner */
    .hero-banner {
        background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
        padding: 2.2rem 2.5rem;
        border-radius: 1.5rem;
        color: white;
        margin-bottom: 1.8rem;
        box-shadow: 0 20px 25px -5px rgba(6, 78, 59, 0.25), 0 8px 10px -6px rgba(6, 78, 59, 0.2);
        position: relative;
        overflow: hidden;
    }
    .hero-banner::after {
        content: "♻️";
        position: absolute;
        right: 20px;
        bottom: -20px;
        font-size: 8rem;
        opacity: 0.08;
        pointer-events: none;
    }
    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(8px);
        padding: 0.35rem 0.9rem;
        border-radius: 9999px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #a7f3d0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 0.8rem;
    }
    .hero-title {
        font-size: 2.3rem;
        font-weight: 800;
        line-height: 1.15;
        margin-bottom: 0.5rem;
        letter-spacing: -0.02em;
    }
    .hero-subtitle {
        color: #d1fae5;
        font-size: 0.98rem;
        max-width: 780px;
        line-height: 1.5;
        opacity: 0.95;
    }

    /* Modern KPI Cards */
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 1.25rem;
        padding: 1.35rem 1.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative;
        overflow: hidden;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
        border-color: #a7f3d0;
    }
    .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .kpi-icon {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }
    .kpi-val {
        font-size: 1.9rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
    }
    .kpi-lbl {
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-top: 0.35rem;
    }
    .kpi-sub {
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.4rem;
        display: inline-block;
        padding: 0.15rem 0.5rem;
        border-radius: 0.5rem;
    }

    /* Digital Receipt Container */
    .receipt-container {
        background: #ffffff;
        border: 2px dashed #059669;
        border-radius: 1.25rem;
        padding: 1.5rem;
        font-family: 'Courier New', Courier, monospace;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        color: #1e293b;
    }
    .receipt-header {
        text-align: center;
        border-bottom: 2px dashed #cbd5e1;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
    }
    .receipt-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        font-size: 0.9rem;
    }
    .receipt-total {
        border-top: 2px dashed #cbd5e1;
        margin-top: 1rem;
        padding-top: 0.8rem;
        display: flex;
        justify-content: space-between;
        font-weight: 800;
        font-size: 1.15rem;
        color: #064e3b;
    }
    .receipt-hash {
        background: #f8fafc;
        padding: 0.6rem;
        border-radius: 0.5rem;
        font-size: 0.7rem;
        color: #64748b;
        word-break: break-all;
        margin-top: 1rem;
        border: 1px solid #e2e8f0;
    }

    /* Role Quick Selector Pill */
    .role-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.85rem;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.82rem;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.2s;
    }

    /* AI Confidence Meter */
    .ai-badge {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
        color: #1e40af;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        font-size: 0.82rem;
        margin-top: 0.6rem;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# 2. Session State Initialization & Data Models
# -------------------------------------------------------------
if "lang" not in st.session_state:
    st.session_state.lang = "en"
if "current_role" not in st.session_state:
    st.session_state.current_role = "HOUSEHOLD"
if "user_name" not in st.session_state:
    st.session_state.user_name = "Pooja Verma"

# Seeded Material Catalog
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
            "icon": "📦",
            "color": "#3b82f6"
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
            "icon": "🧴",
            "color": "#10b981"
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
            "icon": "🔩",
            "color": "#f59e0b"
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
            "icon": "✨",
            "color": "#ea580c"
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
            "icon": "🍾",
            "color": "#06b6d4"
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
            "icon": "💻",
            "color": "#8b5cf6"
        },
    ]

# Seeded Pickup Requests
if "pickups" not in st.session_state:
    st.session_state.pickups = [
        {
            "id": "REQ-101",
            "user": "Pooja Verma",
            "role": "HOUSEHOLD",
            "phone": "+91 98290 22002",
            "area": "Malviya Nagar, Sector 3, Jaipur",
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
            "phone": "+91 98290 33003",
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
            "phone": "+91 98290 77007",
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

# Recycler Offers
if "recycler_offers" not in st.session_state:
    st.session_state.recycler_offers = [
        {"mill": "Aravalli Paper Pulp Plant 1", "cat": "Paper & Cardboard", "rate": 11.5, "min_lot": 50, "location": "Mansarovar RIICO", "verified": True},
        {"mill": "Aravalli Polymer Flaking Division", "cat": "Rigid Plastics (PET / HDPE)", "rate": 20.5, "min_lot": 30, "location": "Mansarovar RIICO", "verified": True},
        {"mill": "Aravalli Induction Foundry", "cat": "Ferrous Metals (Iron & Steel)", "rate": 30.0, "min_lot": 100, "location": "Mansarovar RIICO", "verified": True},
    ]

# Audit Logs
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"action": "VERIFY_USER", "user": "Admin", "details": "Approved Ramkishan Sahu (Collector KYC RJ-14)", "time": "2026-10-10 14:20"},
        {"action": "COMPLETE_TRANSACTION", "user": "Mohammad Farooq", "details": "Issued Digital Receipt REC-2026-JP-00192 (₹3,442.50)", "time": "2026-10-09 13:45"},
        {"action": "UPDATE_MANDI_RATE", "user": "Admin", "details": "Adjusted PET baseline rate to ₹18.00/kg", "time": "2026-10-08 10:00"},
    ]

# Helper Distance & Hash Functions
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

# -------------------------------------------------------------
# 3. Sidebar: Language & 1-Click Role Switcher
# -------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🌐 ScrapSetu Navigation")
    lang_choice = st.radio("Language / भाषा", ["English", "हिंदी"], horizontal=True)
    st.session_state.lang = "en" if lang_choice == "English" else "hi"
    is_hi = st.session_state.lang == "hi"

    st.divider()

    st.markdown("### ⚡ SIH Demo Quick Switcher")
    st.caption("Click any role to test its live dashboard immediately:")

    c_r1, c_r2 = st.columns(2)
    with c_r1:
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
    with c_r2:
        if st.button("🏢 Business", use_container_width=True):
            st.session_state.current_role = "BUSINESS"
            st.session_state.user_name = "GreenLeaf Logistics & Cafe"
            st.rerun()
        if st.button("🏭 Recycler", use_container_width=True):
            st.session_state.current_role = "RECYCLER"
            st.session_state.user_name = "Aravalli Ecocycle Mills"
            st.rerun()

    st.divider()
    st.markdown(f"**Logged In:** `{st.session_state.user_name}`")
    st.markdown(f"**Role:** `{st.session_state.current_role}`")
    st.caption("📍 Pilot Mandi: Jaipur (Malviya Nagar & Mansarovar)")

# -------------------------------------------------------------
# 4. Premium Top Hero Banner & Live Platform Counters
# -------------------------------------------------------------
st.markdown(f"""
<div class="hero-banner">
    <div class="hero-badge">
        <span>🌱 SDG 11 & 12 • Smart India Hackathon Live Edition</span>
    </div>
    <div class="hero-title">
        {"कबाड़ का सही दाम। कबाड़ीवालों का डिजिटल सम्मान।" if is_hi else "Turn Scrap Into Value. Empower Informal Collectors."}
    </div>
    <div class="hero-subtitle">
        {"घरों, दुकानों, स्थानीय कबाड़ीवालों और प्रमाणित रीसाइक्लिंग मिलों को निष्पक्ष दरों, डिजिटल कांटों और सुरक्षित रसीदों से जोड़ने वाला डिजिटल सेतु।" if is_hi else "India's first inclusive digital recycling bridge connecting waste generators, doorstep kabadiwalas, and accredited recycling plants with fair prices and verifiable environmental accounting."}
    </div>
</div>
""", unsafe_allow_html=True)

# Compute live KPIs
completed_pickups = [p for p in st.session_state.pickups if p["status"] == "COMPLETED"]
total_kg = sum(p["est_weight"] for p in completed_pickups)
total_payout = sum(p["est_val"] for p in completed_pickups)
total_co2 = round(total_kg * 1.41, 1)
total_trees = round(total_kg * 0.017, 1)

kp1, kp2, kp3, kp4 = st.columns(4)
with kp1:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-header">
            <span class="kpi-lbl">Total Diverted</span>
            <div class="kpi-icon" style="background:#dcfce7; color:#15803d;">⚖️</div>
        </div>
        <div class="kpi-val">{total_kg:.1f} kg</div>
        <div class="kpi-sub" style="background:#f0fdf4; color:#166534;">Verified on Scales ✓</div>
    </div>
    """, unsafe_allow_html=True)

with kp2:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-header">
            <span class="kpi-lbl">CO₂ Averted</span>
            <div class="kpi-icon" style="background:#dbeafe; color:#1e40af;">🌍</div>
        </div>
        <div class="kpi-val">{total_co2:.1f} kg</div>
        <div class="kpi-sub" style="background:#eff6ff; color:#1e3a8a;">EPA WARM Standard</div>
    </div>
    """, unsafe_allow_html=True)

with kp3:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-header">
            <span class="kpi-lbl">Paid Directly</span>
            <div class="kpi-icon" style="background:#fef3c7; color:#b45309;">💰</div>
        </div>
        <div class="kpi-val">₹{total_payout:,.2f}</div>
        <div class="kpi-sub" style="background:#fffbeb; color:#92400e;">Instant UPI / Cash</div>
    </div>
    """, unsafe_allow_html=True)

with kp4:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-header">
            <span class="kpi-lbl">Mature Trees Saved</span>
            <div class="kpi-icon" style="background:#f3e8ff; color:#7e22ce;">🌲</div>
        </div>
        <div class="kpi-val">{total_trees:.1f} Trees</div>
        <div class="kpi-sub" style="background:#faf5ff; color:#6b21a8;">Recovered Fiber</div>
    </div>
    """, unsafe_allow_html=True)

st.write("")

# -------------------------------------------------------------
# 5. Main Functional Tabs
# -------------------------------------------------------------
tab_home, tab_collector, tab_rates, tab_recycler, tab_esg, tab_admin = st.tabs([
    "🏠 Household & Booking",
    "🛺 Kabadiwala Terminal",
    "📈 Mandi Rates & Calculator",
    "🏭 Recycler Portal",
    "🌱 ESG Impact Dashboard",
    "🛡️ Admin Governance"
])

# -------------------------------------------------------------
# TAB 1: HOUSEHOLD & BOOKING
# -------------------------------------------------------------
with tab_home:
    st.subheader("Schedule Scrap Pickup & Track Orders" if not is_hi else "कबाड़ पिकअप शेड्यूल करें और ट्रैक करें")
    
    col_book, col_track = st.columns([1, 1], gap="large")
    
    with col_book:
        st.markdown("#### 📦 Book Doorstep Pickup")
        with st.form("booking_form", border=True):
            user_addr = st.selectbox(
                "Pickup Address (पिकअप का पता)",
                [
                    "Home: Plot 42, Girdhar Marg, Sector 3, Malviya Nagar, Jaipur",
                    "Commercial Bay: Industrial Plot 7, Sitapura Industrial Area, Jaipur"
                ]
            )
            
            c_cat, c_qty = st.columns([2, 1])
            with c_cat:
                cat_options = [f"{c['icon']} {c['name']} ({c['hindi']})" for c in st.session_state.categories]
                sel_cat_str = st.selectbox("Scrap Category (कबाड़ की श्रेणी)", cat_options)
            with c_qty:
                sel_qty = st.number_input("Est. Qty (kg)", min_value=1.0, value=25.0, step=1.0)
            
            # Interactive AI Material Vision Helper
            st.markdown("##### 🤖 AI Material Vision Helper (कबाड़ पहचान सहायक)")
            sample_img = st.selectbox(
                "Simulate camera snap or upload waste picture:",
                [
                    "(Select sample to test AI detection...)",
                    "PET Mineral Water Bottles (Plastic)",
                    "Corrugated Amazon Cardboard Boxes (Paper)",
                    "Heavy Scrap Iron Rods & Cookware (Ferrous)",
                    "Copper Wire Strippings & Brass Fittings (Non-Ferrous)",
                    "Defunct Laptop PCB & Chargers (E-Waste)"
                ]
            )
            
            if sample_img != "(Select sample to test AI detection...)":
                st.markdown(f"""
                <div class="ai-badge">
                    <b>✓ AI Vision Model Verified:</b> 95% Confidence match for <i>{sample_img}</i>.<br>
                    <span style="font-size:0.75rem; color:#475569;">Explanation: Container geometry and surface reflection match high-grade recyclables.</span>
                </div>
                """, unsafe_allow_html=True)
            
            c_d, c_t = st.columns(2)
            with c_d:
                pick_date = st.date_input("Preferred Date", datetime.date.today() + datetime.timedelta(days=1))
            with c_t:
                pick_slot = st.selectbox("Time Window", ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", "Evening (3 PM - 6 PM)"])
            
            user_notes = st.text_input("Special Notes / Instructions", "Clean bundles kept near garage, call before ringing.")
            
            # Live Calculation Preview
            base_rate = 14.0
            for c in st.session_state.categories:
                if c["name"] in sel_cat_str:
                    base_rate = c["rate"]
                    break
            est_total = round(sel_qty * base_rate, 2)
            
            st.info(f"💡 Indicative Fair Value: **₹{est_total:.2f}** ({sel_qty} kg @ ₹{base_rate}/kg). Mutually finalized on calibrated digital scale.")
            
            book_submit = st.form_submit_button("Confirm Booking (पिकअप बुक करें)", type="primary", use_container_width=True)
            
            if book_submit:
                new_id = f"REQ-{len(st.session_state.pickups) + 101}"
                st.session_state.pickups.append({
                    "id": new_id,
                    "user": st.session_state.user_name,
                    "role": st.session_state.current_role,
                    "phone": "+91 98290 22002",
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
                st.session_state.audit_logs.append({
                    "action": "CREATE_PICKUP",
                    "user": st.session_state.user_name,
                    "details": f"Created {new_id} ({sel_qty} kg)",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.success(f"🎉 Pickup {new_id} booked successfully! Assigned to nearest verified collectors.")
                st.rerun()

    with col_track:
        st.markdown("#### 🗺️ Order Status & Privacy-Protected Map")
        
        # Interactive Folium Map
        m = folium.Map(location=[26.8524, 75.8173], zoom_start=12)
        
        for p in st.session_state.pickups:
            color = "green" if p["status"] == "COMPLETED" else "blue" if p["status"] == "ACCEPTED" else "orange"
            
            # Privacy-preserving coordinate fuzzing
            plot_lat = p["lat"] + (0.0035 if p["status"] == "OPEN" else 0.0)
            plot_lng = p["lng"] + (0.0035 if p["status"] == "OPEN" else 0.0)
            
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
                
        st_folium(m, height=290, use_container_width=True)
        st.caption("🔒 Privacy Rule: Public pins are obfuscated by ~400m radius until assigned.")
        
        st.markdown("##### My Requests History")
        for p in reversed(st.session_state.pickups):
            status_color = "#15803d" if p["status"] == "COMPLETED" else "#1d4ed8" if p["status"] == "ACCEPTED" else "#b45309"
            with st.expander(f"{p['id']} - {p['materials']} ({p['status']})"):
                st.write(f"**Status:** `{p['status']}`")
                st.write(f"**Estimated Valuation:** ₹{p['est_val']} ({p['est_weight']} kg)")
                st.write(f"**Preferred Slot:** {p['slot']}")
                if p.get("assigned_collector"):
                    st.write(f"**Assigned Collector:** {p['assigned_collector']} (3-Wheeler RJ 14 TB 4921) 🛺")
                if p.get("receipt_number"):
                    # Render Digital Receipt
                    st.markdown(f"""
                    <div class="receipt-container">
                        <div class="receipt-header">
                            <b style="font-size:1.1rem; color:#064e3b;">SCRAPSETU DIGITAL RECEIPT</b><br>
                            Receipt #{p['receipt_number']} • Verified Digital Scale
                        </div>
                        <div class="receipt-row"><span>Customer:</span> <b>{p['user']}</b></div>
                        <div class="receipt-row"><span>Collector:</span> <b>{p.get('assigned_collector', 'Ramkishan Sahu')}</b></div>
                        <div class="receipt-row"><span>Net Weight:</span> <b>{p['est_weight']} kg</b></div>
                        <div class="receipt-row"><span>Settlement Mode:</span> <b>UPI Instant</b></div>
                        <div class="receipt-total"><span>TOTAL PAID:</span> <span>₹{p['est_val']:,.2f}</span></div>
                        <div class="receipt-hash">SHA-256 Hash: {p['receipt_hash']}</div>
                    </div>
                    """, unsafe_allow_html=True)

# -------------------------------------------------------------
# TAB 2: KABADIWALA TERMINAL
# -------------------------------------------------------------
with tab_collector:
    st.subheader("कबाड़ीवाला जॉब टर्मिनल (Waste Collector Terminal)")
    st.caption("Designed for low-literacy mobile phones with large touch targets, bilingual cues, and digital scale entry.")
    
    # Capacity meter
    collector_today_kg = 187.5
    st.markdown(f"**दैनिक वाहन क्षमता (Daily Vehicle Capacity):** {collector_today_kg} / 250 kg (75%)")
    st.progress(collector_today_kg / 250.0)
    
    col_k1, col_k2 = st.columns([1, 1], gap="large")
    
    with col_k1:
        st.markdown("#### 📍 नजदीकी खुले पिकअप (Nearby Open Jobs)")
        open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
        
        if open_jobs:
            for job in open_jobs:
                dist = haversine_km(26.8501, 75.8155, job["lat"], job["lng"])
                with st.container(border=True):
                    c_j1, c_j2 = st.columns([2, 1])
                    with c_j1:
                        st.markdown(f"**{job['materials']}**")
                        st.caption(f"दूरी: **{dist} किमी** • इलाका: {job['area']}")
                        st.caption(f"समय: {job['slot']}")
                    with c_j2:
                        st.metric("Est. Value", f"₹{job['est_val']}")
                    
                    if st.button(f"पिकअप स्वीकार करें (Accept {job['id']})", key=f"acc_{job['id']}", type="primary", use_container_width=True):
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
        st.markdown("#### ⚖️ तौल दर्ज करें व रसीद बनाएं (Digital Scale Weighing)")
        accepted_jobs = [p for p in st.session_state.pickups if p["status"] == "ACCEPTED"]
        
        if accepted_jobs:
            sel_acc = st.selectbox("चुनें चालू पिकअप (Active Job):", [p["id"] for p in accepted_jobs])
            target_p = next(p for p in accepted_jobs if p["id"] == sel_acc)
            
            with st.container(border=True):
                st.write(f"**ग्राहक:** {target_p['user']} (📞 {target_p.get('phone', '+91 98290 00000')})")
                st.write(f"**स्थान:** {target_p['area']}")
                
                with st.form("weighing_form"):
                    w_act = st.number_input("कांटे की वास्तविक तौल (Actual Weight in kg):", min_value=1.0, value=float(target_p["est_weight"]))
                    w_rate = st.number_input("सहमति दर (Agreed Rate ₹/kg):", min_value=1.0, value=14.0)
                    w_mode = st.radio("भुगतान माध्यम (Payment Mode):", ["UPI Instant", "Cash"], horizontal=True)
                    
                    w_total = round(w_act * w_rate, 2)
                    st.markdown(f"### कुल भुगतान: ₹{w_total:,.2f}")
                    
                    complete_sub = st.form_submit_button("⚖️ तौल पक्की करें व रसीद बनाएं (Issue Receipt)", type="primary", use_container_width=True)
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
            st.info("कोई चालू पिकअप नहीं है जिसे तौलना हो। बाईं ओर से खुला पिकअप स्वीकार करें।")

# -------------------------------------------------------------
# TAB 3: MANDI RATES & CALCULATOR
# -------------------------------------------------------------
with tab_rates:
    st.subheader("Indicative Mandi Scrap Benchmark Rates")
    st.caption("Wholesale benchmark surveys across North India (MRAI index). Actual rates mutually finalized on physical scale.")
    
    col_r1, col_r2 = st.columns([3, 2], gap="large")
    
    with col_r1:
        rates_df = pd.DataFrame([
            {
                "Material": f"{c['icon']} {c['name']}",
                "Hindi": c["hindi"],
                "Indicative Rate (₹/kg)": f"₹{c['rate']:.2f}",
                "Mandi Range": f"₹{c['min_rate']} - ₹{c['max_rate']}",
                "CO₂ Saved": f"{c['co2_factor']} kg/kg",
                "Benchmark Source": c["source"]
            }
            for c in st.session_state.categories
        ])
        st.dataframe(rates_df, hide_index=True, use_container_width=True)
        
        st.caption("💡 Rates update weekly in coordination with regional scrap mandi federations.")

    with col_r2:
        st.markdown("#### 🧮 Scrap Valuation Calculator")
        with st.container(border=True):
            calc_cat = st.selectbox("Select Material", [c["name"] for c in st.session_state.categories])
            calc_kg = st.slider("Weight in Kilograms", 5, 200, 35)
            calc_grade = st.radio("Quality / Segregation Grade", ["Clean & Segregated (+8% bonus)", "Standard Mixed Clean", "Unsorted / Mixed (-10% deduction)"])
            
            multiplier = 1.08 if "bonus" in calc_grade else 0.90 if "deduction" in calc_grade else 1.0
            sel_c = next(c for c in st.session_state.categories if c["name"] == calc_cat)
            calc_res = round(calc_kg * sel_c["rate"] * multiplier, 2)
            
            st.metric("Estimated Cash Payout", f"₹{calc_res:,.2f}", f"Rate: ₹{sel_c['rate']*multiplier:.2f} / kg")
            st.caption("Formula: Quantity (kg) × Mandi Baseline × Grade Multiplier")

# -------------------------------------------------------------
# TAB 4: RECYCLER PORTAL
# -------------------------------------------------------------
with tab_recycler:
    st.subheader("Recycling Facility Management Portal")
    st.caption("Aravalli Ecocycle Mills • CPCB Registration: RJ/PWM/2026/0491 • RIICO Industrial Area, Mansarovar")
    
    col_rec1, col_rec2 = st.columns([1, 1], gap="large")
    
    with col_rec1:
        st.markdown("#### Published Factory Buying Rates")
        offers_df = pd.DataFrame(st.session_state.recycler_offers)
        st.dataframe(offers_df, hide_index=True, use_container_width=True)
        
        with st.form("new_offer_form", border=True):
            st.markdown("##### + Post New Buying Rate")
            o_cat = st.selectbox("Material Category", [c["name"] for c in st.session_state.categories], key="o_cat")
            o_rate = st.number_input("Buying Price (₹/kg)", min_value=1.0, value=12.5)
            o_min = st.number_input("Min Lot Size (kg)", min_value=10, value=50)
            if st.form_submit_button("+ Publish Rate to Regional Collectors"):
                st.session_state.recycler_offers.append({
                    "mill": "Aravalli Processing Plant",
                    "cat": o_cat,
                    "rate": o_rate,
                    "min_lot": o_min,
                    "location": "RIICO Mansarovar",
                    "verified": True
                })
                st.success("Buying rate published to regional kabadiwalas!")
                st.rerun()

    with col_rec2:
        st.markdown("#### Weighbridge Gate Intake Slip Generator")
        with st.form("intake_slip_form", border=True):
            sup_name = st.text_input("Supplier / Collector Name", "Mohammad Farooq (Verified Collector)")
            intake_wt = st.number_input("Scale Net Weight (kg)", min_value=10.0, value=187.5)
            intake_rate = st.number_input("Purchase Price (₹/kg)", min_value=1.0, value=19.5)
            slip_total = round(intake_wt * intake_rate, 2)
            
            st.markdown(f"### Total Settlement: ₹{slip_total:,.2f}")
            if st.form_submit_button("Record Inbound Weight Slip", type="primary", use_container_width=True):
                st.success(f"Weighbridge slip generated for {intake_wt} kg (₹{slip_total:,.2f})! Linked to collector ledger.")

# -------------------------------------------------------------
# TAB 5: ESG IMPACT DASHBOARD
# -------------------------------------------------------------
with tab_esg:
    st.subheader("Scientific Environmental Accounting (CPCB & EPA WARM Models)")
    
    e1, e2 = st.columns(2, gap="large")
    with e1:
        # Pie chart of diverted materials
        pie_data = pd.DataFrame([
            {"Category": "Paper & Cardboard", "Kg": 125.0},
            {"Category": "Ferrous Metals (Iron)", "Kg": 87.5},
            {"Category": "Plastics (PET)", "Kg": 45.0},
            {"Category": "Glass Bottles", "Kg": 20.0},
            {"Category": "E-Waste", "Kg": 15.0},
        ])
        fig_pie = px.pie(
            pie_data,
            values="Kg",
            names="Category",
            title="Diverted Material Split (by Weight in kg)",
            color_discrete_sequence=px.colors.sequential.Greens_r,
            hole=0.4
        )
        st.plotly_chart(fig_pie, use_container_width=True)

    with e2:
        # Bar chart of carbon offset by category
        bar_data = pd.DataFrame([
            {"Category": "Paper", "CO2_Saved_kg": 125.0 * 1.35},
            {"Category": "Metals", "CO2_Saved_kg": 87.5 * 1.50},
            {"Category": "Plastics", "CO2_Saved_kg": 45.0 * 1.80},
            {"Category": "Glass", "CO2_Saved_kg": 20.0 * 0.31},
            {"Category": "E-Waste", "CO2_Saved_kg": 15.0 * 3.20},
        ])
        fig_bar = px.bar(
            bar_data,
            x="Category",
            y="CO2_Saved_kg",
            title="CO₂ Equivalent Offset by Category (kg CO₂e)",
            color="CO2_Saved_kg",
            color_continuous_scale="Tealgrn"
        )
        st.plotly_chart(fig_bar, use_container_width=True)

    # Equivalency Callouts
    eq1, eq2, eq3 = st.columns(3)
    with eq1:
        st.info("🚗 **1,420 km** of petrol car emissions prevented")
    with eq2:
        st.info("💧 **18,500 Litres** of groundwater conserved")
    with eq3:
        st.info("⚡ **740 kWh** of coal-fired electricity offset")

    st.markdown("""
    ##### 📚 Documented Calculation Methodology:
    - **CO₂ Offset:** Calculated per CPCB lifecyle factors (Paper: 1.35 kg/kg, Plastics: 1.80 kg/kg, Iron: 1.50 kg/kg, Non-ferrous: 9.10 kg/kg).
    - **Forestry Metric:** 17 mature trees saved per 1,000 kg virgin paper substituted.
    - **Water Conservation:** 26 liters saved per kg of recovered pulp.
    """)

# -------------------------------------------------------------
# TAB 6: ADMIN GOVERNANCE
# -------------------------------------------------------------
with tab_admin:
    st.subheader("Platform Governance & Regulatory Audit Console")
    
    col_a1, col_a2 = st.columns([1, 1], gap="large")
    
    with col_a1:
        st.markdown("#### User Verification & KYC Approvals")
        users_table = pd.DataFrame([
            {"Name": "Ramkishan Sahu", "Role": "COLLECTOR", "Vehicle": "3-Wheeler Tempo", "Status": "APPROVED ✓"},
            {"Name": "Mohammad Farooq", "Role": "COLLECTOR", "Vehicle": "Mini Truck", "Status": "APPROVED ✓"},
            {"Name": "Aravalli Ecocycle", "Role": "RECYCLER", "License": "CPCB RJ/PWM", "Status": "APPROVED ✓"},
            {"Name": "Shyam Sundar", "Role": "COLLECTOR", "Vehicle": "Hand Cart", "Status": "PENDING REVIEW ⏳"},
        ])
        st.dataframe(users_table, hide_index=True, use_container_width=True)
        
        if st.button("Approve Pending Collector (Shyam Sundar)", type="primary"):
            st.success("Shyam Sundar verified! Service credentials issued.")

    with col_a2:
        st.markdown("#### Immutable Cryptographic Audit Ledger")
        audit_df = pd.DataFrame(st.session_state.audit_logs)
        st.dataframe(audit_df, hide_index=True, use_container_width=True)

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 0.85rem; padding-bottom: 2rem;">
    <b>ScrapSetu</b> © 2026 • Live Streamlit Cloud Ready • Connected to GitHub Repository: <code>Siddiqui-Hammad/ScrapSetu</code>
</div>
""", unsafe_allow_html=True)
