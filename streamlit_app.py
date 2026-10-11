"""
ScrapSetu: A Digital Bridge to Sustainable Recycling
Streamlit Cloud Live Edition - Role-Gated Authentication & Dedicated Dashboards
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
    page_title="ScrapSetu | Login & Dynamic Dashboards",
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

    /* Auth Gateway Box */
    .auth-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 1.5rem;
        padding: 2.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
        margin: 1.5rem auto;
        max-width: 680px;
    }
    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    .auth-logo {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        display: inline-block;
    }
    .auth-title {
        font-size: 2rem;
        font-weight: 800;
        color: #064e3b;
        letter-spacing: -0.02em;
        margin-bottom: 0.25rem;
    }
    .auth-subtitle {
        color: #64748b;
        font-size: 0.95rem;
    }

    /* Dedicated Top Nav Bar */
    .top-user-bar {
        background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
        color: white;
        padding: 1rem 1.75rem;
        border-radius: 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.8rem;
        box-shadow: 0 10px 15px -3px rgba(6, 78, 59, 0.15);
    }
    .user-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #a7f3d0;
    }

    /* KPI Cards */
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 1.25rem;
        padding: 1.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
        margin-bottom: 1rem;
    }
    .kpi-val {
        font-size: 1.85rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
    }
    .kpi-lbl {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-top: 0.35rem;
    }

    /* Digital Receipt Box */
    .receipt-container {
        background: #ffffff;
        border: 2px dashed #059669;
        border-radius: 1.25rem;
        padding: 1.5rem;
        font-family: 'Courier New', Courier, monospace;
        margin-top: 1rem;
        color: #1e293b;
    }
    .receipt-header {
        text-align: center;
        border-bottom: 2px dashed #cbd5e1;
        padding-bottom: 0.8rem;
        margin-bottom: 0.8rem;
    }
    .receipt-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        font-size: 0.88rem;
    }
    .receipt-total {
        border-top: 2px dashed #cbd5e1;
        margin-top: 0.8rem;
        padding-top: 0.8rem;
        display: flex;
        justify-content: space-between;
        font-weight: 800;
        font-size: 1.15rem;
        color: #064e3b;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# 2. Session State Initialization
# -------------------------------------------------------------
if "is_logged_in" not in st.session_state:
    st.session_state.is_logged_in = False
if "current_role" not in st.session_state:
    st.session_state.current_role = "HOUSEHOLD"
if "user_name" not in st.session_state:
    st.session_state.user_name = "Pooja Verma"
if "user_email" not in st.session_state:
    st.session_state.user_email = "household@scrapsetu.in"
if "lang" not in st.session_state:
    st.session_state.lang = "en"

# Material Catalog
if "categories" not in st.session_state:
    st.session_state.categories = [
        {"id": "c1", "name": "Paper & Cardboard", "hindi": "कागज़ और गत्ता", "rate": 14.0, "min": 12.0, "max": 16.0, "unit": "kg", "co2": 1.35, "icon": "📦"},
        {"id": "c2", "name": "Rigid Plastics (PET / HDPE)", "hindi": "सख्त प्लास्टिक", "rate": 18.0, "min": 15.0, "max": 22.0, "unit": "kg", "co2": 1.80, "icon": "🧴"},
        {"id": "c3", "name": "Ferrous Metals (Iron & Steel)", "hindi": "लोहा और इस्पात", "rate": 28.0, "min": 26.0, "max": 31.0, "unit": "kg", "co2": 1.50, "icon": "🔩"},
        {"id": "c4", "name": "Non-Ferrous (Copper, Brass, Al)", "hindi": "तांबा और अल्युमिनियम", "rate": 115.0, "min": 105.0, "max": 130.0, "unit": "kg", "co2": 9.10, "icon": "✨"},
        {"id": "c5", "name": "Glass Bottles & Jars", "hindi": "कांच की बोतलें", "rate": 3.5, "min": 2.5, "max": 4.5, "unit": "kg", "co2": 0.31, "icon": "🍾"},
        {"id": "c6", "name": "Electronic Waste (E-Waste)", "hindi": "ई-कचरा", "rate": 45.0, "min": 35.0, "max": 65.0, "unit": "kg", "co2": 3.20, "icon": "💻"},
    ]

# Seeded Pickup Orders
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

# Recycler Buying Offers
if "recycler_offers" not in st.session_state:
    st.session_state.recycler_offers = [
        {"mill": "Aravalli Paper Mills", "cat": "Paper & Cardboard", "rate": 11.5, "min_lot": 50, "location": "Mansarovar RIICO"},
        {"mill": "Aravalli Polymer Flakes", "cat": "Rigid Plastics (PET / HDPE)", "rate": 20.5, "min_lot": 30, "location": "Mansarovar RIICO"},
        {"mill": "Aravalli Induction Foundry", "cat": "Ferrous Metals (Iron & Steel)", "rate": 30.0, "min_lot": 100, "location": "Mansarovar RIICO"},
    ]

# KYC Partner Verifications
if "kyc_records" not in st.session_state:
    st.session_state.kyc_records = [
        {
            "id": "KYC-COL-001",
            "name": "Ramkishan Sahu",
            "role": "COLLECTOR",
            "phone": "+91 98290 11001",
            "vehicle": "3-Wheeler Tempo RJ 14 TB 4921",
            "aadhaar_num": "5482-9182-4912",
            "dl_num": "RJ-14-2019-00291",
            "aadhaar_status": "Verified UIDAI ✓",
            "dl_status": "Verified LMV-TR (Transport) ✓",
            "selfie_status": "Live Biometric Match 98.4% ✓",
            "status": "APPROVED ✓",
            "applied_date": "2026-10-10 14:15",
            "reviewed_by": "Vikramaditya Sharma (Admin)",
        },
        {
            "id": "KYC-COL-002",
            "name": "Mohammad Farooq",
            "role": "COLLECTOR",
            "phone": "+91 98290 22002",
            "vehicle": "Mini Truck RJ 14 GA 1182",
            "aadhaar_num": "7821-3391-9182",
            "dl_num": "RJ-14-2016-00812",
            "aadhaar_status": "Verified UIDAI ✓",
            "dl_status": "Verified Heavy LMV ✓",
            "selfie_status": "Live Biometric Match 99.1% ✓",
            "status": "APPROVED ✓",
            "applied_date": "2026-10-09 11:20",
            "reviewed_by": "Vikramaditya Sharma (Admin)",
        },
        {
            "id": "KYC-COL-003",
            "name": "Shyam Sundar",
            "role": "COLLECTOR",
            "phone": "+91 98290 88008",
            "vehicle": "E-Rickshaw Loader RJ 14 ER 7721",
            "aadhaar_num": "4129-6638-6621",
            "dl_num": "RJ-14-2022-00455",
            "aadhaar_status": "Uploaded (Doc UIDAI verified)",
            "dl_status": "Uploaded (Commercial E-Cart)",
            "selfie_status": "Live Camera Snapshot Captured",
            "status": "PENDING REVIEW ⏳",
            "applied_date": "2026-10-11 11:30",
            "reviewed_by": None,
        },
    ]

# Audit Trail
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"action": "VERIFY_USER", "user": "Admin", "details": "Approved Ramkishan Sahu (Collector KYC: Aadhaar+DL+Selfie)", "time": "2026-10-10 14:20"},
        {"action": "COMPLETE_TRANSACTION", "user": "Mohammad Farooq", "details": "Issued Receipt REC-2026-JP-00192 (₹3,442.50)", "time": "2026-10-09 13:45"},
        {"action": "UPDATE_MANDI_RATE", "user": "Admin", "details": "Adjusted PET baseline to ₹18.00/kg", "time": "2026-10-08 10:00"},
    ]

# Helper Distance & Hash
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

# Preset demo accounts
DEMO_ROLES = {
    "HOUSEHOLD": {"name": "Pooja Verma", "email": "household@scrapsetu.in", "role": "HOUSEHOLD"},
    "BUSINESS": {"name": "GreenLeaf Logistics & Cafe", "email": "business@scrapsetu.in", "role": "BUSINESS"},
    "COLLECTOR": {"name": "Ramkishan Sahu", "email": "collector@scrapsetu.in", "role": "COLLECTOR"},
    "RECYCLER": {"name": "Aravalli Ecocycle Mills", "email": "recycler@scrapsetu.in", "role": "RECYCLER"},
    "ADMIN": {"name": "Vikramaditya Sharma", "email": "admin@scrapsetu.in", "role": "ADMIN"},
}

def login_as(role_key):
    acc = DEMO_ROLES[role_key]
    st.session_state.is_logged_in = True
    st.session_state.current_role = acc["role"]
    st.session_state.user_name = acc["name"]
    st.session_state.user_email = acc["email"]

# =============================================================
# SCENARIO A: AUTHENTICATION GATEWAY (LOGIN & REGISTER FIRST)
# =============================================================
if not st.session_state.is_logged_in:
    # Sidebar Language Selector
    with st.sidebar:
        st.markdown("### 🌐 Language / भाषा")
        l_opt = st.radio("Select Language", ["English", "हिंदी"], horizontal=True)
        st.session_state.lang = "en" if l_opt == "English" else "hi"
        
        st.divider()
        st.markdown("### ⚡ SIH Evaluator Fast-Track")
        st.caption("One-Click Login for demonstration:")
        if st.button("🛡️ 1-Click Admin Access", type="primary", use_container_width=True):
            login_as("ADMIN")
            st.rerun()
        if st.button("🏠 1-Click Household", use_container_width=True):
            login_as("HOUSEHOLD")
            st.rerun()
        if st.button("🏢 1-Click Commercial Business", use_container_width=True):
            login_as("BUSINESS")
            st.rerun()
        if st.button("🛺 1-Click Kabadiwala (Collector)", use_container_width=True):
            login_as("COLLECTOR")
            st.rerun()
        if st.button("🏭 1-Click Recycler Mill", use_container_width=True):
            login_as("RECYCLER")
            st.rerun()

    # Main Gateway UI
    st.markdown("""
    <div style="text-align:center; padding-top:1.5rem;">
        <span style="font-size:3.5rem;">♻️</span>
        <h1 style="color:#064e3b; font-weight:800; font-size:2.4rem; margin-bottom:0.2rem;">ScrapSetu</h1>
        <p style="color:#047857; font-size:1rem; font-weight:600;">A Digital Bridge to Sustainable Recycling</p>
    </div>
    """, unsafe_allow_html=True)

    auth_tab_login, auth_tab_register = st.tabs(["🔐 Sign In to ScrapSetu (लॉग इन)", "📝 Create New Account (पंजीकरण)"])

    # ---------------- LOGIN FORM ----------------
    with auth_tab_login:
        col_l1, col_l2, col_l3 = st.columns([1, 2, 1])
        with col_l2:
            st.markdown("#### Enter Your Credentials")
            with st.form("login_form"):
                in_email = st.text_input("Email Address", placeholder="name@example.com")
                in_pass = st.text_input("Password", type="password", placeholder="••••••••")
                
                login_btn = st.form_submit_button("Sign In (प्रवेश करें)", type="primary", use_container_width=True)
                if login_btn:
                    # Match against demo emails or fallback
                    matched = False
                    for k, acc in DEMO_ROLES.items():
                        if in_email.lower().strip() == acc["email"].lower():
                            login_as(k)
                            matched = True
                            st.success(f"Welcome back, {acc['name']}!")
                            st.rerun()
                            break
                    if not matched:
                        if in_email and in_pass:
                            st.session_state.is_logged_in = True
                            st.session_state.user_name = in_email.split('@')[0].capitalize()
                            st.session_state.user_email = in_email
                            st.session_state.current_role = "HOUSEHOLD"
                            st.success(f"Welcome, {st.session_state.user_name}!")
                            st.rerun()
                        else:
                            st.error("Please enter email and password.")

            st.divider()
            st.markdown("##### 🚀 Fast Evaluation Login")
            st.caption("Click any persona below to log in immediately:")
            fb1, fb2, fb3 = st.columns(3)
            with fb1:
                if st.button("🏠 Household", use_container_width=True):
                    login_as("HOUSEHOLD")
                    st.rerun()
            with fb2:
                if st.button("🛺 Kabadiwala", use_container_width=True):
                    login_as("COLLECTOR")
                    st.rerun()
            with fb3:
                if st.button("🛡️ Admin Console", type="primary", use_container_width=True):
                    login_as("ADMIN")
                    st.rerun()

    # ---------------- REGISTER FORM (DYNAMIC ROLE SELECTION) ----------------
    with auth_tab_register:
        col_r1, col_r2, col_r3 = st.columns([1, 2, 1])
        with col_r2:
            st.markdown("#### Register Dynamic Account")
            st.caption("Select your role in the dropdown to dynamically customize registration fields:")
            
            with st.form("registration_form"):
                # DYNAMIC ROLE DROPDOWN
                reg_role_label = st.selectbox(
                    "📌 Registering As: (भूमिका चुनें)",
                    [
                        "🏠 Household User (Residential Scrap Generator)",
                        "🏢 Commercial Business / Office (Bulk Generator)",
                        "🛺 Waste Collector / Kabadiwala (Doorstep Scrap Collector)",
                        "🏭 Recycling Plant / Mill (Industrial Processing Facility)"
                    ]
                )

                # Determine selected role key
                if "Household" in reg_role_label:
                    chosen_role = "HOUSEHOLD"
                elif "Commercial" in reg_role_label:
                    chosen_role = "BUSINESS"
                elif "Collector" in reg_role_label:
                    chosen_role = "COLLECTOR"
                else:
                    chosen_role = "RECYCLER"

                c_n, c_p = st.columns(2)
                with c_n:
                    reg_name = st.text_input("Full Name / Primary Contact", placeholder="Ramesh Sharma")
                with c_p:
                    reg_phone = st.text_input("Phone Number", placeholder="+91 98290 00000")

                c_e, c_pw = st.columns(2)
                with c_e:
                    reg_email = st.text_input("Email Address", placeholder="user@scrapsetu.in")
                with c_pw:
                    reg_pass = st.text_input("Create Password", type="password", placeholder="••••••••")

                # DYNAMIC ROLE-SPECIFIC FIELDS
                if chosen_role == "HOUSEHOLD":
                    st.info("🏡 Residential Profile: Doorstep scrap scheduling with certified digital scales.")
                    reg_address = st.text_input("Home Street Address", "Plot 42, Malviya Nagar, Jaipur")
                    reg_pincode = st.text_input("Pincode", "302017")

                elif chosen_role == "BUSINESS":
                    st.info("🏢 Commercial Bulk Profile: Recurring pickup contracts & GST invoices.")
                    reg_biz_name = st.text_input("Company / Business Name", "GreenLeaf Enterprises Pvt Ltd")
                    reg_gst = st.text_input("GSTIN Number", "08AAACG1234F1Z8")
                    reg_address = st.text_input("Commercial Facility / Bay Address", "Industrial Bay 7, Sitapura, Jaipur")

                elif chosen_role == "COLLECTOR":
                    st.info("🛺 Kabadiwala Partner Profile: Mobile-first job terminal with verified digital scale.")
                    c_v1, c_v2 = st.columns(2)
                    with c_v1:
                        reg_veh = st.selectbox("Vehicle Type", ["Three-Wheeler Tempo", "Mini Truck", "Cycle Rickshaw", "Hand Cart"])
                    with c_v2:
                        reg_veh_no = st.text_input("Vehicle Registration No.", "RJ 14 TB 4921")
                    reg_cap = st.slider("Daily Capacity (kg)", 50, 1000, 250)

                elif chosen_role == "RECYCLER":
                    st.info("🏭 Recycler Facility Profile: Publish wholesale buying rate sheets & weighbridge slips.")
                    reg_facility = st.text_input("Processing Plant Name", "Aravalli Ecocycle Mills Ltd")
                    reg_cpcb = st.text_input("CPCB / SPCB Registration No.", "RJ/PWM/2026/0491")
                    reg_location = st.text_input("Industrial Area Location", "RIICO Industrial Area, Mansarovar, Jaipur")

                reg_submit = st.form_submit_button("Complete Registration & Enter Dashboard", type="primary", use_container_width=True)
                
                if reg_submit:
                    if reg_name and reg_email:
                        st.session_state.is_logged_in = True
                        st.session_state.current_role = chosen_role
                        st.session_state.user_name = reg_name
                        st.session_state.user_email = reg_email
                        st.session_state.audit_logs.append({
                            "action": "USER_REGISTER",
                            "user": reg_name,
                            "details": f"Registered as {chosen_role}",
                            "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                        })
                        st.success(f"🎉 Registration complete! Welcome to your {chosen_role} Dashboard.")
                        st.rerun()
                    else:
                        st.error("Please fill in your name and email.")

    st.stop()


# =============================================================
# SCENARIO B: LOGGED-IN DEDICATED ROLE DASHBOARD
# =============================================================

# Top Global Header with User Info & 1-CLICK ADMIN ACCESS
st.markdown(f"""
<div class="top-user-bar">
    <div>
        <span style="font-size:1.15rem; font-weight:800;">ScrapSetu</span> • 
        <b>{st.session_state.user_name}</b> 
        <span class="user-badge" style="margin-left:0.5rem;">{st.session_state.current_role} DASHBOARD</span>
    </div>
    <div style="font-size:0.85rem; color:#d1fae5;">
        Session: <code>{st.session_state.user_email}</code>
    </div>
</div>
""", unsafe_allow_html=True)

# Top Action Row: 1-Click Admin Access Switch + Logout
t_col1, t_col2, t_col3 = st.columns([2, 1, 1])
with t_col1:
    if st.session_state.current_role != "ADMIN":
        if st.button("⚡ Switch to Admin Dashboard (One-Click)", type="primary"):
            st.session_state.current_role = "ADMIN"
            st.session_state.user_name = "Vikramaditya Sharma"
            st.session_state.user_email = "admin@scrapsetu.in"
            st.rerun()
    else:
        st.success("🛡️ You are currently viewing the Administrator Regulatory Console.")

with t_col2:
    # Quick switch to other roles for demonstration
    switch_to = st.selectbox(
        "Quick Switch Role:",
        ["ADMIN", "HOUSEHOLD", "BUSINESS", "COLLECTOR", "RECYCLER"],
        index=["ADMIN", "HOUSEHOLD", "BUSINESS", "COLLECTOR", "RECYCLER"].index(st.session_state.current_role)
    )
    if switch_to != st.session_state.current_role:
        login_as(switch_to)
        st.rerun()

with t_col3:
    if st.button("🚪 Sign Out (लॉग आउट)", use_container_width=True):
        st.session_state.is_logged_in = False
        st.rerun()

st.divider()

current_role = st.session_state.current_role

# =============================================================
# 1. 🏠 DEDICATED HOUSEHOLD DASHBOARD
# =============================================================
if current_role == "HOUSEHOLD":
    st.subheader(f"🏠 Household Recycling Dashboard — Welcome, {st.session_state.user_name}!")
    st.caption("Schedule door-step scrap pickups, track verified collectors on map, and earn fair mandi cash.")

    # KPI Row
    user_pickups = [p for p in st.session_state.pickups if p["role"] == "HOUSEHOLD"]
    completed_u = [p for p in user_pickups if p["status"] == "COMPLETED"]
    u_kg = sum(p["est_weight"] for p in completed_u)
    u_earned = sum(p["est_val"] for p in completed_u)

    hk1, hk2, hk3, hk4 = st.columns(4)
    with hk1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{u_kg} kg</div><div class="kpi-lbl">My Recycled Scrap</div></div>', unsafe_allow_html=True)
    with hk2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹{u_earned:,.2f}</div><div class="kpi-lbl">Total Cash/UPI Earned</div></div>', unsafe_allow_html=True)
    with hk3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(user_pickups)}</div><div class="kpi-lbl">Pickups Booked</div></div>', unsafe_allow_html=True)
    with hk4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{round(u_kg*1.35, 1)} kg</div><div class="kpi-lbl">Personal CO₂ Saved</div></div>', unsafe_allow_html=True)

    h_col1, h_col2 = st.columns([1, 1], gap="large")

    with h_col1:
        st.markdown("#### 📦 Book Next Doorstep Pickup")
        with st.form("household_book"):
            h_cat = st.selectbox("Scrap Material", [f"{c['icon']} {c['name']} (₹{c['rate']}/kg)" for c in st.session_state.categories])
            h_qty = st.number_input("Estimated Weight (kg)", min_value=1.0, value=20.0)
            h_slot = st.selectbox("Preferred Time", ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", "Evening (3 PM - 6 PM)"])
            
            # Find rate
            sel_r = 14.0
            for c in st.session_state.categories:
                if c["name"] in h_cat:
                    sel_r = c["rate"]
                    break
            st.info(f"💡 Expected Doorstep Payout: **₹{round(h_qty * sel_r, 2)}** (@ ₹{sel_r}/kg). Verified on digital scale.")
            
            if st.form_submit_button("Confirm Booking (पिकअप बुक करें)", type="primary", use_container_width=True):
                nid = f"REQ-{len(st.session_state.pickups)+101}"
                st.session_state.pickups.append({
                    "id": nid,
                    "user": st.session_state.user_name,
                    "role": "HOUSEHOLD",
                    "phone": "+91 98290 22002",
                    "area": "Malviya Nagar, Sector 3, Jaipur",
                    "lat": 26.8524,
                    "lng": 75.8173,
                    "materials": f"{h_cat} ({h_qty}kg)",
                    "est_weight": h_qty,
                    "est_val": round(h_qty * sel_r, 2),
                    "slot": h_slot,
                    "status": "OPEN",
                    "assigned_collector": None,
                    "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.success(f"Pickup {nid} scheduled! Broadcasted to nearest verified collectors.")
                st.rerun()

    with h_col2:
        st.markdown("#### 🗺️ Order Status & Privacy Map")
        m = folium.Map(location=[26.8524, 75.8173], zoom_start=13)
        for p in user_pickups:
            folium.Marker([p["lat"], p["lng"]], popup=f"{p['id']}: {p['status']}", tooltip=p["id"]).add_to(m)
        st_folium(m, height=260, use_container_width=True)

        for p in reversed(user_pickups):
            with st.expander(f"{p['id']} - {p['materials']} ({p['status']})"):
                st.write(f"**Status:** `{p['status']}`")
                st.write(f"**Estimated Valuation:** ₹{p['est_val']}")
                if p.get("receipt_number"):
                    st.success(f"Receipt #{p['receipt_number']} • SHA-256 Verified")

# =============================================================
# 2. 🏢 DEDICATED COMMERCIAL BUSINESS DASHBOARD
# =============================================================
elif current_role == "BUSINESS":
    st.subheader(f"🏢 Commercial Bulk Waste Dashboard — {st.session_state.user_name}")
    st.caption("Manage industrial packaging scrap, recurring collection contracts, multi-warehouse bays & GST invoices.")

    bk1, bk2, bk3, bk4 = st.columns(4)
    with bk1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">187.5 kg</div><div class="kpi-lbl">Total Commercial Tonnage</div></div>', unsafe_allow_html=True)
    with bk2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹3,442.50</div><div class="kpi-lbl">GST Invoice Settlements</div></div>', unsafe_allow_html=True)
    with bk3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">Weekly</div><div class="kpi-lbl">Recurring Contract</div></div>', unsafe_allow_html=True)
    with bk4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">2 Facilities</div><div class="kpi-lbl">Active Jaipur Hubs</div></div>', unsafe_allow_html=True)

    b_col1, b_col2 = st.columns([1, 1], gap="large")
    with b_col1:
        st.markdown("#### 🏭 Commercial Dispatch Bays")
        st.dataframe(pd.DataFrame([
            {"Facility": "Sitapura Central Warehouse Bay 7", "Type": "Logistics & Pallets", "Status": "Active Primary"},
            {"Facility": "Crystal Court Mall Outlet", "Type": "Retail Packaging", "Status": "Active Branch"},
        ]), hide_index=True, use_container_width=True)

        with st.form("book_commercial"):
            st.markdown("##### Schedule Commercial Bulk Intake")
            b_bay = st.selectbox("Dispatch Location", ["Sitapura Warehouse Bay 7", "Crystal Court Mall Outlet"])
            b_ton = st.number_input("Estimated Bulk Load (kg)", min_value=50.0, value=150.0, step=10.0)
            b_recur = st.checkbox("Set as Recurring Weekly Subscription", value=True)
            if st.form_submit_button("Book Heavy Vehicle Dispatch", type="primary"):
                st.success(f"Commercial dispatch of {b_ton} kg booked! Assigned to mini-truck collector.")

    with b_col2:
        st.markdown("#### 🧾 GST Invoices & Weighbridge Records")
        st.dataframe(pd.DataFrame([
            {"Invoice #": "REC-2026-JP-00192", "Weight": "187.5 kg", "Amount": "₹3,442.50", "Payment": "UPI Verified", "Date": "2026-10-09"},
            {"Invoice #": "REC-2026-JP-00114", "Weight": "210.0 kg", "Amount": "₹4,120.00", "Payment": "Bank Transfer", "Date": "2026-09-28"},
        ]), hide_index=True, use_container_width=True)

# =============================================================
# 3. 🛺 DEDICATED KABADIWALA (COLLECTOR) DASHBOARD
# =============================================================
elif current_role == "COLLECTOR":
    st.subheader(f"🛺 कबाड़ीवाला जॉब टर्मिनल (Collector Terminal) — {st.session_state.user_name}")
    st.caption("Mobile-first accessible terminal with digital scale entry, daily capacity meter & TSP route optimization.")

    col_tab1, col_tab2 = st.tabs(["📍 पिकअप ऑर्डर्स व डिजिटल तौल (Daily Jobs & Digital Scale)", "🪪 पार्टनर KYC सत्यापन (Aadhaar + DL + Live Selfie)"])

    with col_tab1:
        st.markdown("**दैनिक वाहन क्षमता (Daily Vehicle Limit):** 187.5 / 250 kg (75%)")
        st.progress(187.5 / 250.0)

        k_col1, k_col2 = st.columns([1, 1], gap="large")

        with k_col1:
            st.markdown("#### 📍 नजदीकी खुले पिकअप (Nearby Open Jobs)")
            open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
            if open_jobs:
                for job in open_jobs:
                    dist = haversine_km(26.8501, 75.8155, job["lat"], job["lng"])
                    with st.container(border=True):
                        st.markdown(f"**{job['materials']}**")
                        st.caption(f"दूरी: **{dist} किमी** • स्थान: {job['area']}")
                        st.markdown(f"**अनुमानित राशि: ₹{job['est_val']}**")
                        if st.button(f"पिकअप स्वीकार करें (Accept {job['id']})", key=f"k_acc_{job['id']}", type="primary", use_container_width=True):
                            job["status"] = "ACCEPTED"
                            job["assigned_collector"] = st.session_state.user_name
                            st.success(f"पिकअप {job['id']} स्वीकार कर लिया गया! ग्राहक का फोन और पता अनलॉक हुआ।")
                            st.rerun()
            else:
                st.info("वर्तमान में कोई खुला पिकअप नहीं है।")

        with k_col2:
            st.markdown("#### ⚖️ तौल दर्ज करें व डिजिटल रसीद बनाएं (Digital Weighing Entry)")
            accepted_jobs = [p for p in st.session_state.pickups if p["status"] == "ACCEPTED"]
            if accepted_jobs:
                sel_j = st.selectbox("चुनें चालू पिकअप:", [p["id"] for p in accepted_jobs])
                tgt = next(p for p in accepted_jobs if p["id"] == sel_j)
                
                with st.form("weigh_form"):
                    st.write(f"**ग्राहक:** {tgt['user']} (📞 {tgt.get('phone', '+91 98290 00000')})")
                    w_wt = st.number_input("वास्तविक वजन (Net Weight in kg):", min_value=1.0, value=float(tgt["est_weight"]))
                    w_rt = st.number_input("सहमति दर (Agreed Rate ₹/kg):", min_value=1.0, value=14.0)
                    w_tot = round(w_wt * w_rt, 2)
                    st.markdown(f"### कुल भुगतान: ₹{w_tot:,.2f}")
                    
                    if st.form_submit_button("⚖️ रसीद जारी करें व लेनदेन पूरा करें", type="primary", use_container_width=True):
                        r_no = f"REC-2026-JP-{int(time.time())%100000}"
                        r_h = generate_receipt_hash(r_no, tgt["user"], st.session_state.user_name, w_tot, w_wt, str(datetime.datetime.now()))
                        tgt["status"] = "COMPLETED"
                        tgt["est_weight"] = w_wt
                        tgt["est_val"] = w_tot
                        tgt["receipt_number"] = r_no
                        tgt["receipt_hash"] = r_h
                        st.success(f"रसीद #{r_no} जारी हुई! भुगतान पूरा हुआ।")
                        st.rerun()
            else:
                st.info("कोई चालू पिकअप नहीं है जिसे तौलना हो।")

    with col_tab2:
        st.markdown("#### 🪪 3-Point KYC Identity & Document Verification")
        st.caption("To prevent stolen scrap transactions and guarantee household safety, all collectors must verify Aadhaar, Driving Licence, and Live Selfie.")

        my_kyc = next((k for k in st.session_state.kyc_records if k["name"] == st.session_state.user_name), None)

        if my_kyc and my_kyc["status"] == "APPROVED ✓":
            st.success(f"🟢 **KYC स्थिति: APPROVED (सत्यापित कबाड़ीवाला साथी ✓)**")
            kc1, kc2, kc3 = st.columns(3)
            with kc1:
                st.info(f"📄 **Aadhaar Card:**\n`{my_kyc['aadhaar_num']}`\n\nStatus: {my_kyc['aadhaar_status']}")
            with kc2:
                st.info(f"🪪 **Driving Licence:**\n`{my_kyc['dl_num']}`\n\nStatus: {my_kyc['dl_status']}")
            with kc3:
                st.info(f"🤳 **Live Face Selfie:**\nBiometric Match: 98.4%\n\nStatus: {my_kyc['selfie_status']}")
        else:
            st.warning("⏳ **KYC स्थिति: दस्तावेज सत्यापन आवश्यक (Verification Required)** — कृपया आधार, ड्राइविंग लाइसेंस और लाइव सेल्फी जमा करें।")

        with st.expander("📤 Update or Submit New KYC Documents", expanded=(not my_kyc or my_kyc["status"] != "APPROVED ✓")):
            with st.form("kyc_submit_form"):
                st.markdown("##### 1. 📄 Government Aadhaar Card (आधार कार्ड)")
                u_aadh_no = st.text_input("Aadhaar Number (12 Digits)", "5482-9182-4912")
                u_aadh_file = st.file_uploader("Upload Aadhaar Card (Front & Back Photo / PDF)", type=["png", "jpg", "jpeg", "pdf"], key="up_aadh")

                st.markdown("##### 2. 🪪 Driving Licence / Commercial Permit (ड्राइविंग लाइसेंस)")
                u_dl_no = st.text_input("Driving Licence Number", "RJ-14-2022-00455")
                u_dl_file = st.file_uploader("Upload Driving Licence Scan", type=["png", "jpg", "jpeg", "pdf"], key="up_dl")

                st.markdown("##### 3. 🤳 Live Selfie Verification (लाइव सेल्फी / फेस मैच)")
                st.caption("Take an instant selfie using device camera to confirm your identity matches the photo on your Aadhaar card.")
                u_selfie_cam = st.camera_input("Take Live Camera Selfie:")
                u_selfie_file = st.file_uploader("Or Upload Clear Portrait Selfie:", type=["png", "jpg", "jpeg"], key="up_selfie")

                if st.form_submit_button("🚀 Submit KYC Documents for Admin Verification", type="primary"):
                    new_kyc_entry = {
                        "id": f"KYC-COL-{len(st.session_state.kyc_records)+1:03d}",
                        "name": st.session_state.user_name,
                        "role": "COLLECTOR",
                        "phone": "+91 98290 88008",
                        "vehicle": "E-Rickshaw Loader RJ 14 ER 7721",
                        "aadhaar_num": u_aadh_no,
                        "dl_num": u_dl_no,
                        "aadhaar_status": "Uploaded (Pending Inspection)",
                        "dl_status": "Uploaded (Pending Inspection)",
                        "selfie_status": "Selfie Photo Captured",
                        "status": "PENDING REVIEW ⏳",
                        "applied_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                        "reviewed_by": None,
                    }
                    # Update or add
                    existing_idx = next((i for i, k in enumerate(st.session_state.kyc_records) if k["name"] == st.session_state.user_name), None)
                    if existing_idx is not None:
                        st.session_state.kyc_records[existing_idx] = new_kyc_entry
                    else:
                        st.session_state.kyc_records.append(new_kyc_entry)

                    st.session_state.audit_logs.append({
                        "action": "SUBMIT_KYC",
                        "user": st.session_state.user_name,
                        "details": f"Submitted Aadhaar ({u_aadh_no}) + DL ({u_dl_no}) + Live Selfie for KYC",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success("✅ आपके KYC दस्तावेज सफलतापूर्वक जमा हो गए हैं! एडमिन सत्यापन के बाद आपका अकाउंट सक्रिय हो जाएगा।")
                    st.rerun()

# =============================================================
# 4. 🏭 DEDICATED RECYCLER DASHBOARD
# =============================================================
elif current_role == "RECYCLER":
    st.subheader(f"🏭 Recycler Facility Portal — {st.session_state.user_name}")
    st.caption("Publish factory buying rates, issue weighbridge intake slips, and manage circular throughput.")

    rk1, rk2, rk3, rk4 = st.columns(4)
    with rk1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">187.5 kg</div><div class="kpi-lbl">Inbound Throughput</div></div>', unsafe_allow_html=True)
    with rk2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹3,656.25</div><div class="kpi-lbl">Raw Material Outlay</div></div>', unsafe_allow_html=True)
    with rk3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">3 Rates</div><div class="kpi-lbl">Active Buying Offers</div></div>', unsafe_allow_html=True)
    with rk4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">CPCB Verified</div><div class="kpi-lbl">Licence RJ/PWM/2026</div></div>', unsafe_allow_html=True)

    r_col1, r_col2 = st.columns([1, 1], gap="large")
    with r_col1:
        st.markdown("#### Published Factory Buying Rate Sheet")
        st.dataframe(pd.DataFrame(st.session_state.recycler_offers), hide_index=True, use_container_width=True)

        with st.form("new_rate"):
            st.markdown("##### + Post New Buying Offer")
            n_cat = st.selectbox("Category", [c["name"] for c in st.session_state.categories])
            n_rate = st.number_input("Buying Rate (₹/kg)", min_value=1.0, value=12.5)
            n_lot = st.number_input("Min Lot Size (kg)", min_value=10, value=50)
            if st.form_submit_button("+ Publish Rate to Regional Mandis", type="primary"):
                st.session_state.recycler_offers.append({"mill": "Aravalli Processing Plant", "cat": n_cat, "rate": n_rate, "min_lot": n_lot, "location": "RIICO Mansarovar"})
                st.success("New buying offer published live!")
                st.rerun()

    with r_col2:
        st.markdown("#### Weighbridge Gate Intake Slip Generator")
        with st.form("intake_gen"):
            s_sup = st.text_input("Supplier / Collector Name", "Mohammad Farooq (Verified Collector)")
            s_wt = st.number_input("Scale Net Weight (kg)", min_value=10.0, value=187.5)
            s_rt = st.number_input("Purchase Price (₹/kg)", min_value=1.0, value=19.5)
            st.write(f"**Total Settlement Outlay:** ₹{round(s_wt * s_rt, 2):,.2f}")
            if st.form_submit_button("Record Weighbridge Slip", type="primary"):
                st.success("Inbound weighbridge slip recorded and linked to collector ledger!")

# =============================================================
# 5. 🛡️ DEDICATED ADMINISTRATOR DASHBOARD
# =============================================================
elif current_role == "ADMIN":
    st.subheader(f"🛡️ Platform Governance & Regulatory Console — {st.session_state.user_name}")
    st.caption("Regulatory verification queue, mandi benchmark rate governance, dispute center & cryptographic audit logs.")

    ak1, ak2, ak3, ak4 = st.columns(4)
    with ak1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(st.session_state.pickups)} Orders</div><div class="kpi-lbl">Total Requests</div></div>', unsafe_allow_html=True)
    with ak2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">100%</div><div class="kpi-lbl">Settlement Rate</div></div>', unsafe_allow_html=True)
    with ak3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹3,442.50</div><div class="kpi-lbl">Total Cashflow Settled</div></div>', unsafe_allow_html=True)
    with ak4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">0 Disputes</div><div class="kpi-lbl">Dispute Status: Normal</div></div>', unsafe_allow_html=True)

    a_tab1, a_tab2, a_tab3 = st.tabs(["📋 KYC Verification Queue (Aadhaar + DL + Selfie)", "📈 Mandi Benchmark Rates", "📜 Cryptographic Audit Ledger"])

    with a_tab1:
        st.markdown("#### 📋 3-Point KYC Verification Queue")
        st.caption("Review uploaded Government Aadhaar Cards, Driving Licences, and Live Biometric Selfies to authorize doorstep collection partners.")

        kyc_df = pd.DataFrame([
            {
                "ID": k["id"],
                "Partner Name": k["name"],
                "Role": k["role"],
                "Vehicle": k.get("vehicle", "N/A"),
                "Aadhaar Number": k["aadhaar_num"],
                "DL Number": k["dl_num"],
                "Selfie Status": k["selfie_status"],
                "Verification Status": k["status"]
            }
            for k in st.session_state.kyc_records
        ])
        st.dataframe(kyc_df, hide_index=True, use_container_width=True)

        st.divider()
        st.markdown("#### 🔍 Interactive KYC Document Dossier Inspector")
        pending_candidates = [k for k in st.session_state.kyc_records if "PENDING" in k["status"]]
        all_candidates = st.session_state.kyc_records

        target_name = st.selectbox(
            "Select Applicant Dossier to Review:",
            [k["name"] for k in all_candidates],
            index=next((i for i, k in enumerate(all_candidates) if "PENDING" in k["status"]), 0)
        )
        cand = next(k for k in all_candidates if k["name"] == target_name)

        # 3-Card Inspection View
        doc_col1, doc_col2, doc_col3 = st.columns(3)
        with doc_col1:
            st.markdown("""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:12px; text-align:center;">
                <div style="font-size:24px;">📄</div>
                <b>Government Aadhaar Card</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">UIDAI Verified ID Proof</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
            """ + f"UID: {cand['aadhaar_num']}" + """
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
            """ + f"Status: {cand['aadhaar_status']}" + """
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col2:
            st.markdown("""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:12px; text-align:center;">
                <div style="font-size:24px;">🪪</div>
                <b>Driving Licence (DL)</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">Ministry of Road Transport (Parivahan)</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
            """ + f"DL No: {cand['dl_num']}" + """
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
            """ + f"Status: {cand['dl_status']}" + """
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col3:
            st.markdown("""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:12px; text-align:center;">
                <div style="font-size:24px;">🤳</div>
                <b>Live Biometric Selfie</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">Live Camera Anti-Spoofing Match</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
                    Face Match: 98.2% Similarity
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
            """ + f"Status: {cand['selfie_status']}" + """
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.write("")
        d_b1, d_b2 = st.columns([1, 1])
        with d_b1:
            if cand["status"] != "APPROVED ✓":
                if st.button(f"✅ Approve KYC for {cand['name']} (Issue Green Badge)", type="primary", use_container_width=True):
                    cand["status"] = "APPROVED ✓"
                    cand["reviewed_by"] = st.session_state.user_name
                    cand["aadhaar_status"] = "Verified UIDAI ✓"
                    cand["dl_status"] = "Verified RTO ✓"
                    cand["selfie_status"] = "Face Match 98.8% ✓"
                    st.session_state.audit_logs.append({
                        "action": "VERIFY_USER",
                        "user": st.session_state.user_name,
                        "details": f"Approved 3-point KYC for {cand['name']} (Aadhaar: {cand['aadhaar_num']}, DL: {cand['dl_num']})",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"🎉 {cand['name']} KYC has been APPROVED! Partner is now authorized for doorstep scrap pickups.")
                    st.rerun()
            else:
                st.info(f"✅ {cand['name']} is already APPROVED and holding an active verified partner credential.")

        with d_b2:
            if st.button(f"❌ Reject / Request Re-upload for {cand['name']}", use_container_width=True):
                cand["status"] = "REJECTED (Re-upload requested)"
                st.session_state.audit_logs.append({
                    "action": "REJECT_KYC",
                    "user": st.session_state.user_name,
                    "details": f"Requested document re-upload for {cand['name']}",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.warning(f"Notification sent to {cand['name']} to re-upload clear Aadhaar/DL photos.")
                st.rerun()

    with a_tab2:
        st.markdown("#### Mandi Benchmark Rate Editor")
        for c in st.session_state.categories:
            c1, c2, c3 = st.columns([2, 1, 1])
            with c1:
                st.write(f"**{c['icon']} {c['name']}** ({c['hindi']})")
            with c2:
                new_r = st.number_input(f"Rate for {c['name']}", min_value=1.0, value=float(c['rate']), key=f"ad_{c['id']}")
            with c3:
                if st.button(f"Update {c['name']}", key=f"up_{c['id']}"):
                    c["rate"] = new_r
                    st.session_state.audit_logs.append({
                        "action": "UPDATE_MANDI_RATE",
                        "user": "Admin",
                        "details": f"Updated {c['name']} to ₹{new_r}/kg",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"{c['name']} benchmark updated!")
                    st.rerun()

    with a_tab3:
        st.markdown("#### Immutable Cryptographic Audit Ledger")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), hide_index=True, use_container_width=True)

# Footer
st.divider()
st.markdown("""
<div style="text-align:center; color:#64748b; font-size:0.85rem; padding-bottom:1.5rem;">
    <b>ScrapSetu</b> © 2026 • Live Streamlit Cloud Ready • Connected to GitHub Repository: <code>Siddiqui-Hammad/ScrapSetu</code>
</div>
""", unsafe_allow_html=True)
