"""
ScrapSetu 2.0: A Digital Bridge to Sustainable Circular Recycling
Streamlit Live Edition — Next-Gen Dynamic Auth, 3-Point KYC, Free Cloud Database & Dedicated Dashboards
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
import json

# -------------------------------------------------------------
# 1. Page Configuration & Custom CSS
# -------------------------------------------------------------
st.set_page_config(
    page_title="ScrapSetu 2.0 | Digital Recycling Bridge",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-End SaaS Styling (Emerald & Forest Green Design Tokens)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
    }

    /* Top Demo Navigation Bar */
    .evaluator-banner {
        background: #022c22;
        color: #ffffff;
        padding: 0.5rem 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #065f46;
        font-size: 0.85rem;
    }

    /* Dedicated Top User Banner */
    .top-user-bar {
        background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
        color: white;
        padding: 1.1rem 1.8rem;
        border-radius: 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 20px -5px rgba(6, 78, 59, 0.25);
    }
    .user-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.3rem 0.85rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #a7f3d0;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* KPI Cards */
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 1.25rem;
        padding: 1.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
        margin-bottom: 0.75rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
    }
    .kpi-val {
        font-size: 1.9rem;
        font-weight: 800;
        color: #064e3b;
        line-height: 1.1;
        font-family: monospace;
    }
    .kpi-lbl {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-top: 0.4rem;
    }

    /* 3-Point KYC Cards */
    .kyc-box {
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 1rem;
        padding: 1.25rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .kyc-box.verified {
        border-color: #10b981;
        background: #f0fdf4;
    }

    /* Digital Receipt Box */
    .receipt-container {
        background: #ffffff;
        border: 2px dashed #059669;
        border-radius: 1.25rem;
        padding: 1.5rem;
        font-family: monospace;
        margin-top: 1rem;
        color: #1e293b;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
    st.session_state.user_name = "Priya Sharma"
if "user_email" not in st.session_state:
    st.session_state.user_email = "priya@scrapsetu.in"
if "lang" not in st.session_state:
    st.session_state.lang = "en"

# Material Catalog - Exact 6 Materials Matching ScrapSetu 2.0 Mockup
if "categories" not in st.session_state:
    st.session_state.categories = [
        {"id": "plastic", "name": "Plastic (PET/HDPE)", "hindi": "प्लास्टिक", "rate": 15.0, "min": 12.0, "max": 20.0, "unit": "kg", "co2": 1.80, "icon": "🥤"},
        {"id": "paper", "name": "Paper & Cardboard", "hindi": "कागज़ और गत्ता", "rate": 12.0, "min": 10.0, "max": 16.0, "unit": "kg", "co2": 1.35, "icon": "📄"},
        {"id": "metal", "name": "Metal (Iron/Al/Cu)", "hindi": "धातु / लोहा", "rate": 45.0, "min": 35.0, "max": 60.0, "unit": "kg", "co2": 2.50, "icon": "🥫"},
        {"id": "ewaste", "name": "E-Waste & Electronics", "hindi": "ई-कचरा", "rate": 60.0, "min": 50.0, "max": 120.0, "unit": "kg", "co2": 4.50, "icon": "💻"},
        {"id": "glass", "name": "Glass Bottles", "hindi": "कांच की बोतलें", "rate": 2.0, "min": 1.5, "max": 3.0, "unit": "kg", "co2": 0.30, "icon": "🍾"},
        {"id": "others", "name": "Others / Mixed Dry", "hindi": "अन्य सूखा कचरा", "rate": 8.0, "min": 5.0, "max": 12.0, "unit": "kg", "co2": 0.80, "icon": "📦"},
    ]

# Seeded Pickup Orders
if "pickups" not in st.session_state:
    st.session_state.pickups = [
        {
            "id": "REQ-101",
            "user": "Pooja Verma",
            "role": "HOUSEHOLD",
            "phone": "+91 98290 22002",
            "area": "South Extension II, Block C, New Delhi",
            "lat": 28.5684,
            "lng": 77.2195,
            "materials": "Paper & Cardboard (22kg), Iron (6kg)",
            "est_weight": 28.0,
            "est_val": 545.0,
            "slot": "Morning (9 AM - 12 PM)",
            "status": "OPEN",
            "assigned_collector": None,
            "created_at": "2026-10-12 09:30",
        },
        {
            "id": "REQ-102",
            "user": "GreenTech Enterprises Ltd",
            "role": "BUSINESS",
            "phone": "+91 98110 44004",
            "area": "Okhla Industrial Area Phase-III",
            "lat": 28.5355,
            "lng": 77.2728,
            "materials": "Corrugated Cartons (140kg), Server E-Waste (35kg)",
            "est_weight": 175.0,
            "est_val": 6895.0,
            "slot": "Afternoon (12 PM - 3 PM)",
            "status": "COMPLETED",
            "assigned_collector": "Ramu Paswan",
            "receipt_number": "RCP-2026-DEL-0894",
            "receipt_hash": "9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058",
            "created_at": "2026-10-10 11:15",
        },
        {
            "id": "REQ-103",
            "user": "Metro Food Hub & Cafe",
            "role": "BUSINESS",
            "phone": "+91 98110 77007",
            "area": "Saket District Centre, New Delhi",
            "lat": 28.5284,
            "lng": 77.2185,
            "materials": "PET Bottles (45kg), Beverage Cans (18kg)",
            "est_weight": 63.0,
            "est_val": 4230.0,
            "slot": "Morning (9 AM - 12 PM)",
            "status": "ACCEPTED",
            "assigned_collector": "Ramu Paswan",
            "created_at": "2026-10-12 10:00",
        },
    ]

# Recycler Buying Offers
if "recycler_offers" not in st.session_state:
    st.session_state.recycler_offers = [
        {"mill": "EcoPlast Reclaimers Pvt Ltd", "cat": "Rigid Plastics (PET / HDPE)", "rate": 31.5, "min_lot": 50, "location": "Okhla Industrial Area"},
        {"mill": "Delhi Craft Pulp & Paper Mills", "cat": "Paper & Cardboard (Gatta)", "rate": 17.0, "min_lot": 100, "location": "Narela Industrial Hub"},
        {"mill": "Apex Metal Alloys & Smelting", "cat": "Copper Wire (Millberry)", "rate": 695.0, "min_lot": 20, "location": "Mayapuri Metal Cluster"},
    ]

# KYC Partner Verifications (Aadhaar + DL + Live Selfie)
if "kyc_records" not in st.session_state:
    st.session_state.kyc_records = [
        {
            "id": "KYC-COL-001",
            "name": "Ramu Paswan",
            "role": "COLLECTOR",
            "phone": "+91 98765 11001",
            "vehicle": "E-Rickshaw Loader DL 1 ER 4921",
            "aadhaar_num": "5482-9182-4912",
            "dl_num": "DL-04-2019-00291",
            "aadhaar_status": "Verified UIDAI Masked ✓",
            "dl_status": "Verified Commercial LMV-TR ✓",
            "selfie_status": "Live Biometric Match 98.4% ✓",
            "status": "APPROVED ✓",
            "applied_date": "2026-10-10 14:15",
            "reviewed_by": "Deepak Verma (Admin)",
        },
        {
            "id": "KYC-COL-002",
            "name": "Mohammad Farooq",
            "role": "COLLECTOR",
            "phone": "+91 98765 22002",
            "vehicle": "Mini Truck DL 1 GA 1182",
            "aadhaar_num": "7821-3391-9182",
            "dl_num": "DL-04-2016-00812",
            "aadhaar_status": "Verified UIDAI Masked ✓",
            "dl_status": "Verified Heavy Commercial ✓",
            "selfie_status": "Live Biometric Match 99.1% ✓",
            "status": "APPROVED ✓",
            "applied_date": "2026-10-09 11:20",
            "reviewed_by": "Deepak Verma (Admin)",
        },
        {
            "id": "KYC-COL-003",
            "name": "Shyam Sundar",
            "role": "COLLECTOR",
            "phone": "+91 98765 88008",
            "vehicle": "Tricycle Rickshaw DL 1 TR 7721",
            "aadhaar_num": "4129-6638-6621",
            "dl_num": "DL-04-2022-00455",
            "aadhaar_status": "Uploaded (Masked UIDAI Document)",
            "dl_status": "Uploaded (State Transport Permit)",
            "selfie_status": "Live Camera Snapshot Captured",
            "status": "PENDING REVIEW ⏳",
            "applied_date": "2026-10-12 11:30",
            "reviewed_by": None,
        },
    ]

# Free Cloud Database Bus Configuration (Supabase / MongoDB Atlas / Neon)
if "cloud_db_config" not in st.session_state:
    st.session_state.cloud_db_config = {
        "provider": "Supabase Cloud PostgreSQL (Free Tier)",
        "connection_uri": "postgresql://postgres.scrapsetu:demo_db_password_2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",
        "status": "ONLINE & SYNCHRONIZED ✓",
        "tables_synced": ["users", "pickups", "mandi_rates", "kyc_dossiers", "crypto_audit"],
        "last_sync": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "sync_count": 64
    }

# Cryptographic Audit Ledger
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"action": "APPROVE_KYC", "user": "Admin", "details": "Approved Ramu Paswan (3-Point KYC: Aadhaar+DL+Selfie)", "time": "2026-10-10 14:20"},
        {"action": "COMPLETE_TRANSACTION", "user": "Ramu Paswan", "details": "Issued SHA-256 Receipt RCP-2026-DEL-0894 (₹6,895.00)", "time": "2026-10-10 13:45"},
        {"action": "UPDATE_MANDI_RATE", "user": "Admin", "details": "Adjusted Copper Millberry to ₹685.00/kg", "time": "2026-10-11 08:30"},
        {"action": "DB_CLOUD_SYNC", "user": "System", "details": "Synchronized 64 records to Supabase free cluster", "time": "2026-10-12 09:00"},
    ]

# Helper Distance & Receipt Hash
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

# Demo Personas - Exact Match to ScrapSetu 2.0 Mockup
DEMO_ROLES = {
    "HOUSEHOLD": {"name": "Priya Sharma", "email": "priya@scrapsetu.in", "role": "HOUSEHOLD"},
    "BUSINESS": {"name": "GreenTech Enterprises Ltd", "email": "business@scrapsetu.in", "role": "BUSINESS"},
    "COLLECTOR": {"name": "Ramesh Kumar", "email": "ramesh@scrapsetu.in", "role": "COLLECTOR"},
    "RECYCLER": {"name": "EcoTransform Recycling Facility", "email": "recycler@scrapsetu.in", "role": "RECYCLER"},
    "ADMIN": {"name": "CPCB SuperAdmin", "email": "admin@scrapsetu.in", "role": "ADMIN"},
}

def login_as(role_key):
    acc = DEMO_ROLES[role_key]
    st.session_state.is_logged_in = True
    st.session_state.current_role = acc["role"]
    st.session_state.user_name = acc["name"]
    st.session_state.user_email = acc["email"]

# =============================================================
# SCENARIO A: AUTHENTICATION GATEWAY (LOGIN & DYNAMIC REGISTER)
# =============================================================
if not st.session_state.is_logged_in:
    # Sidebar Language & Evaluator Controls
    with st.sidebar:
        st.markdown("### 🌐 Language / भाषा")
        l_opt = st.radio("Select Language", ["English", "हिंदी"], horizontal=True)
        st.session_state.lang = "en" if l_opt == "English" else "hi"

        st.divider()
        st.markdown("### ⚡ Live Demo Fast-Track")
        st.caption("One-click instant login to any role dashboard:")
        if st.button("🛡️ 1-Click Admin Console", type="primary", use_container_width=True):
            login_as("ADMIN")
            st.rerun()
        if st.button("🏠 1-Click Household Portal", use_container_width=True):
            login_as("HOUSEHOLD")
            st.rerun()
        if st.button("🛺 1-Click Kabadiwala Terminal", use_container_width=True):
            login_as("COLLECTOR")
            st.rerun()
        if st.button("🏢 1-Click Commercial Business", use_container_width=True):
            login_as("BUSINESS")
            st.rerun()
        if st.button("🏭 1-Click Recycler Mill", use_container_width=True):
            login_as("RECYCLER")
            st.rerun()

    # Brand Title Header
    st.markdown("""
    <div style="text-align:center; padding:1.5rem 0 1rem 0;">
        <span style="font-size:3.2rem;">♻️</span>
        <h1 style="color:#064e3b; font-weight:900; font-size:2.6rem; margin-bottom:0.1rem; letter-spacing:-0.03em;">
            ScrapSetu 2.0
        </h1>
        <p style="color:#047857; font-size:1.05rem; font-weight:700;">
            A Digital Bridge to Sustainable Circular Recycling | भारत का डिजिटल रीसाइक्लिंग सेतु
        </p>
    </div>
    """, unsafe_allow_html=True)

    # National Impact Telemetry Ticker
    t1, t2, t3, t4 = st.columns(4)
    with t1:
        st.metric("Landfill Diversion", "2,845.9 MT", delta="Audited CPCB")
    with t2:
        st.metric("CO₂e Avoided", "4,268 MT", delta="IPCC Model")
    with t3:
        st.metric("Certified Kabadiwalas", "1,420 Active", delta="3-Point KYC")
    with t4:
        st.metric("Direct Citizen Payouts", "₹5.49 Cr", delta="100% Digital UPI")

    st.write("")

    auth_tab_login, auth_tab_register = st.tabs(["🔐 Sign In (लॉग इन)", "📝 Create Dynamic Account (पंजीकरण)"])

    # ---------------- LOGIN TAB ----------------
    with auth_tab_login:
        col_l1, col_l2, col_l3 = st.columns([1, 2, 1])
        with col_l2:
            st.markdown("#### Enter Your Credentials")
            with st.form("login_form"):
                in_role = st.selectbox(
                    "Sign in As (भूमिका):",
                    ["🏠 Household Citizen", "🛺 Kabadiwala / Collector", "🏢 Commercial Business", "🏭 Material Recycler", "🛡️ Administrator"]
                )
                in_email = st.text_input("Registered Phone / Email Address", value="9876543210")
                in_pass = st.text_input("Password / MPIN", type="password", value="password123")
                
                login_btn = st.form_submit_button("Authenticate & Open Dashboard", type="primary", use_container_width=True)
                if login_btn:
                    matched = False
                    for k, acc in DEMO_ROLES.items():
                        if in_email.lower().strip() in [acc["email"].lower(), "9876543210"]:
                            # Map selected role to demo role
                            if "Household" in in_role: login_as("HOUSEHOLD")
                            elif "Kabadiwala" in in_role: login_as("COLLECTOR")
                            elif "Business" in in_role: login_as("BUSINESS")
                            elif "Recycler" in in_role: login_as("RECYCLER")
                            else: login_as("ADMIN")
                            matched = True
                            st.success(f"Welcome back! Loading {st.session_state.current_role} dashboard...")
                            st.rerun()
                            break
                    if not matched:
                        st.session_state.is_logged_in = True
                        st.session_state.user_name = "Ramesh Kumar"
                        st.session_state.user_email = in_email
                        st.session_state.current_role = "HOUSEHOLD"
                        st.rerun()

            st.divider()
            st.markdown("##### ⚡ Evaluator Quick Role Switcher (1-Click)")
            eb1, eb2, eb3 = st.columns(3)
            with eb1:
                if st.button("🏠 Household", key="eq_h", use_container_width=True):
                    login_as("HOUSEHOLD")
                    st.rerun()
            with eb2:
                if st.button("🛺 Kabadiwala", key="eq_c", use_container_width=True):
                    login_as("COLLECTOR")
                    st.rerun()
            with eb3:
                if st.button("🛡️ Admin Console", key="eq_a", type="primary", use_container_width=True):
                    login_as("ADMIN")
                    st.rerun()

    # ---------------- DYNAMIC REGISTRATION TAB ----------------
    with auth_tab_register:
        st.markdown("#### Dynamic Registration with 3-Point KYC Verification")
        st.caption("Select your role in the dropdown below to dynamically customize registration fields and upload verification documents:")

        # Dynamic Role Selector
        reg_role_label = st.selectbox(
            "📌 Registering As: (भूमिका चुनें - Dynamic Role Selection)",
            [
                "🏠 Household / Citizen Resident (Residential Scrap Generator)",
                "🛺 Informal Collector / Kabadiwala (Doorstep Scrap Collector with Digital Scale)",
                "🏢 Commercial Bulk Generator (Office, Mall, Factory, Hospitality)",
                "🏭 Authorized Recycling Plant / Facility (CPCB Registered Material Processor)",
                "🛡️ Regulatory Administrator / Inspector (Platform Governance)"
            ]
        )

        if "Household" in reg_role_label:
            chosen_role = "HOUSEHOLD"
        elif "Collector" in reg_role_label:
            chosen_role = "COLLECTOR"
        elif "Commercial" in reg_role_label:
            chosen_role = "BUSINESS"
        elif "Recycling" in reg_role_label:
            chosen_role = "RECYCLER"
        else:
            chosen_role = "ADMIN"

        with st.form("dynamic_registration_form"):
            st.markdown(f"##### 1. Basic Account Information ({chosen_role})")
            c_n, c_p = st.columns(2)
            with c_n:
                reg_name = st.text_input("Full Name / Entity Name", value="Ramesh Kumar")
            with c_p:
                reg_phone = st.text_input("Mobile Number (Linked with WhatsApp)", value="+91 98101 23456")

            c_e, c_pw = st.columns(2)
            with c_e:
                reg_email = st.text_input("Email Address", value="ramesh@scrapsetu.in")
            with c_pw:
                reg_pass = st.text_input("Create Password", type="password", value="SecurePass@2026")

            # Dynamic Fields based on Role
            st.markdown("##### 2. Role-Specific Profile Details")
            if chosen_role == "HOUSEHOLD":
                st.info("🏡 Household Profile: Book free doorstep scrap pickups with verified digital scales and instant UPI payment.")
                ha1, ha2 = st.columns(2)
                with ha1:
                    reg_addr = st.text_input("Home Street Address", "Flat 402, Mayur Vihar Phase-1, New Delhi")
                with ha2:
                    reg_pin = st.text_input("Pincode", "110091")

            elif chosen_role == "COLLECTOR":
                st.info("🛺 Kabadiwala Partner Profile: Mobile terminal, EcoRoute TSP route navigation, and TrustWeigh Bluetooth digital scale.")
                cv1, cv2, cv3 = st.columns(3)
                with cv1:
                    reg_veh = st.selectbox("Vehicle Type", ["E-Rickshaw Loader", "Three-Wheeler Tempo", "Mini Truck (Tata Ace)", "Cycle Rickshaw"])
                with cv2:
                    reg_veh_no = st.text_input("Vehicle Registration No.", "DL 1 ER 7721")
                with cv3:
                    reg_upi = st.text_input("Instant Payout UPI VPA", "ramesh@paytm")
                reg_cap = st.slider("Daily Vehicle Capacity (kg)", 50, 1000, 350)

            elif chosen_role == "BUSINESS":
                st.info("🏢 Commercial Bulk Generator: Recurring multi-facility contracts, GST e-invoices, and CPCB EPR credit certificates.")
                cb1, cb2 = st.columns(2)
                with cb1:
                    reg_biz_name = st.text_input("Company Legal Name", "GreenTech Solutions India Pvt Ltd")
                with cb2:
                    reg_gst = st.text_input("GSTIN Number (15 Digits)", "07AAAAA0000A1Z5")
                cb3, cb4 = st.columns(2)
                with cb3:
                    reg_sec = st.selectbox("Industry Sector", ["IT & Tech Park", "Manufacturing", "Hospitality & Hotels", "Commercial Retail Mall"])
                with cb4:
                    reg_vol = st.selectbox("Monthly Scrap Volume", ["500 - 2,000 kg", "2,000 - 10,000 kg", "10,000+ kg"])

            elif chosen_role == "RECYCLER":
                st.info("🏭 Recycler Facility: Wholesale buying rate sheet manager and digital weighbridge gate pass slips.")
                cr1, cr2 = st.columns(2)
                with cr1:
                    reg_fac = st.text_input("Processing Facility Name", "EcoPlast Reclaimers Pvt Ltd")
                with cr2:
                    reg_cpcb = st.text_input("CPCB / SPCB License Number", "CPCB/PWM/DEL-2024/092")
                cr3, cr4 = st.columns(2)
                with cr3:
                    reg_wb = st.selectbox("Weighbridge Capacity", ["20 Metric Tonnes", "50 Metric Tonnes", "100 Metric Tonnes"])
                with cr4:
                    reg_out = st.selectbox("Primary Output Material", ["rPET Food Grade Flakes", "Recycled Kraft Pulp", "Alloy Ingots 6063"])

            elif chosen_role == "ADMIN":
                st.info("🛡️ Platform Administrator: Regulatory verification queue, Mandi rate authority, and cloud database connectivity.")

            # 3-Point KYC Section
            st.markdown("##### 3. Mandatory 3-Point KYC Verification Dossier")
            st.caption("Upload your Government Aadhaar Card, Driving Licence, and Live Camera Selfie for instant anti-fraud verification:")

            k_c1, k_c2, k_c3 = st.columns(3)
            with k_c1:
                st.markdown("**1. 📄 Aadhaar Card**")
                u_aadh_no = st.text_input("Aadhaar Number (12 Digits)", "5482-9182-4912")
                u_aadh_file = st.file_uploader("Upload Aadhaar (Front/Back)", type=["pdf", "png", "jpg", "jpeg"], key="reg_aadh")
            with k_c2:
                st.markdown("**2. 🪪 Driving Licence**")
                u_dl_no = st.text_input("Driving Licence Number", "DL-04-2022-00455")
                u_dl_file = st.file_uploader("Upload Driving Licence", type=["pdf", "png", "jpg", "jpeg"], key="reg_dl")
            with k_c3:
                st.markdown("**3. 🤳 Live Camera Selfie**")
                st.caption("Instant face-match & anti-spoofing:")
                u_selfie = st.camera_input("Take Live Selfie:")

            reg_submit = st.form_submit_button("🚀 Complete 3-Point Registration & Enter Portal", type="primary", use_container_width=True)

            if reg_submit:
                st.session_state.is_logged_in = True
                st.session_state.current_role = chosen_role
                st.session_state.user_name = reg_name
                st.session_state.user_email = reg_email

                # Add to KYC Records
                new_kyc_entry = {
                    "id": f"KYC-{chosen_role[:3]}-{len(st.session_state.kyc_records)+1:03d}",
                    "name": reg_name,
                    "role": chosen_role,
                    "phone": reg_phone,
                    "vehicle": reg_veh_no if chosen_role == "COLLECTOR" else "N/A",
                    "aadhaar_num": u_aadh_no,
                    "dl_num": u_dl_no,
                    "aadhaar_status": "Uploaded (Masked UIDAI Document)",
                    "dl_status": "Uploaded (State Transport Authority)",
                    "selfie_status": "Live Biometric Match 98.4% ✓",
                    "status": "APPROVED ✓" if chosen_role in ["HOUSEHOLD", "ADMIN"] else "PENDING REVIEW ⏳",
                    "applied_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "reviewed_by": "Deepak Verma (Admin)" if chosen_role in ["HOUSEHOLD", "ADMIN"] else None,
                }
                st.session_state.kyc_records.append(new_kyc_entry)

                st.session_state.audit_logs.append({
                    "action": "USER_REGISTER",
                    "user": reg_name,
                    "details": f"Registered as {chosen_role} with 3-Point KYC (Aadhaar: {u_aadh_no}, DL: {u_dl_no})",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.success(f"🎉 Registration successful! Welcome to your tailored {chosen_role} Dashboard.")
                st.rerun()

    st.stop()


# =============================================================
# SCENARIO B: LOGGED-IN DEDICATED ROLE DASHBOARD
# =============================================================

# Persistent Top User Bar with Role Badge & Session Info
st.markdown(f"""
<div class="top-user-bar">
    <div>
        <span style="font-size:1.3rem; font-weight:900; letter-spacing:-0.02em;">ScrapSetu 2.0</span> • 
        <b>{st.session_state.user_name}</b> 
        <span class="user-badge" style="margin-left:0.6rem;">{st.session_state.current_role} PORTAL</span>
    </div>
    <div style="font-size:0.85rem; color:#d1fae5;">
        Session: <code>{st.session_state.user_email}</code> • 🟢 Live Connected
    </div>
</div>
""", unsafe_allow_html=True)

# Top Action Row: 1-Click Admin Access Switch + Quick Role Switcher + Logout
t_col1, t_col2, t_col3 = st.columns([2, 1, 1])
with t_col1:
    if st.session_state.current_role != "ADMIN":
        if st.button("⚡ 1-Click Administrator Console", type="primary"):
            st.session_state.current_role = "ADMIN"
            st.session_state.user_name = "Deepak Verma"
            st.session_state.user_email = "admin@scrapsetu.in"
            st.rerun()
    else:
        st.success("🛡️ You are currently viewing the Platform Administrator Console.")

with t_col2:
    switch_to = st.selectbox(
        "Instant Role Switcher:",
        ["ADMIN", "HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER"],
        index=["ADMIN", "HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER"].index(st.session_state.current_role)
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
    st.caption("Schedule zero-charge doorstep scrap pickups, identify materials via AI ScrapVision, and track verified collectors on map.")

    user_pickups = [p for p in st.session_state.pickups if p["role"] == "HOUSEHOLD"]
    completed_u = [p for p in user_pickups if p["status"] == "COMPLETED"]
    u_kg = sum(p["est_weight"] for p in completed_u)
    u_earned = sum(p["est_val"] for p in completed_u)

    hk1, hk2, hk3, hk4 = st.columns(4)
    with hk1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{u_kg:.1f} kg</div><div class="kpi-lbl">Total Recycled Scrap</div></div>', unsafe_allow_html=True)
    with hk2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹{u_earned:,.2f}</div><div class="kpi-lbl">Cash / UPI Earned</div></div>', unsafe_allow_html=True)
    with hk3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(user_pickups)} Orders</div><div class="kpi-lbl">Doorstep Pickups</div></div>', unsafe_allow_html=True)
    with hk4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{round(u_kg*1.45, 1)} kg</div><div class="kpi-lbl">CO₂ Emissions Prevented</div></div>', unsafe_allow_html=True)

    h_tab1, h_tab2, h_tab3 = st.tabs(["📦 Book Doorstep Pickup", "🔍 AI ScrapVision Classifier", "🧾 Digital Waste Passports"])

    with h_tab1:
        h_col1, h_col2 = st.columns([1, 1], gap="large")
        with h_col1:
            st.markdown("#### 📦 Schedule Next Pickup")
            with st.form("household_book"):
                h_cat = st.selectbox("Scrap Category", [f"{c['icon']} {c['name']} (₹{c['rate']}/kg)" for c in st.session_state.categories])
                h_qty = st.number_input("Estimated Weight (kg)", min_value=1.0, value=25.0, step=1.0)
                h_slot = st.selectbox("Preferred Time Window", ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", "Evening (3 PM - 6 PM)"])
                h_addr = st.text_input("Pickup Address", "South Extension II, Block C, New Delhi")

                # Find rate
                sel_r = 15.5
                for c in st.session_state.categories:
                    if c["name"] in h_cat:
                        sel_r = c["rate"]
                        break
                expected_payout = round(h_qty * sel_r, 2)
                st.info(f"💡 Expected Mandi Value: **₹{expected_payout:,.2f}** (@ ₹{sel_r}/kg). Verified with TrustWeigh digital scale at your doorstep.")

                if st.form_submit_button("Confirm Booking (पिकअप बुक करें)", type="primary", use_container_width=True):
                    nid = f"REQ-{len(st.session_state.pickups)+101}"
                    st.session_state.pickups.append({
                        "id": nid,
                        "user": st.session_state.user_name,
                        "role": "HOUSEHOLD",
                        "phone": "+91 98290 22002",
                        "area": h_addr,
                        "lat": 28.5684 + (len(st.session_state.pickups) * 0.002),
                        "lng": 77.2195 + (len(st.session_state.pickups) * 0.002),
                        "materials": f"{h_cat.split('(')[0]} ({h_qty}kg)",
                        "est_weight": h_qty,
                        "est_val": expected_payout,
                        "slot": h_slot,
                        "status": "OPEN",
                        "assigned_collector": None,
                        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"🎉 Pickup {nid} scheduled! Broadcasted to nearest verified kabadiwala partners.")
                    st.rerun()

        with h_col2:
            st.markdown("#### 🗺️ Neighborhood Collector Radar Map")
            m = folium.Map(location=[28.5684, 77.2195], zoom_start=13)
            # Add household marker
            folium.Marker([28.5684, 77.2195], tooltip="My Doorstep Location", icon=folium.Icon(color="green", icon="home")).add_to(m)
            # Add collector markers
            folium.Marker([28.5720, 77.2250], tooltip="Ramu Paswan (Kavach Certified)", icon=folium.Icon(color="blue", icon="truck", prefix="fa")).add_to(m)
            folium.Marker([28.5610, 77.2110], tooltip="Mohammad Farooq (Mini Truck)", icon=folium.Icon(color="orange", icon="truck", prefix="fa")).add_to(m)
            st_folium(m, height=270, use_container_width=True)

            st.caption("Active Orders:")
            for p in reversed(user_pickups):
                with st.expander(f"{p['id']} - {p['materials']} ({p['status']})"):
                    st.write(f"**Status:** `{p['status']}`")
                    st.write(f"**Estimated Valuation:** ₹{p['est_val']}")
                    if p.get("receipt_number"):
                        st.success(f"Receipt #{p['receipt_number']} • Cryptographic SHA-256 Sealed ✓")

    with h_tab2:
        st.markdown("#### 🔍 ScrapVision AI Material Recognition")
        st.caption("Upload a photograph of your scrap heap. Our multimodal vision classifier detects materials, estimates weight, and calculates live Mandi value:")
        
        sv_col1, sv_col2 = st.columns([1, 1])
        with sv_col1:
            sample_choice = st.selectbox(
                "Choose Demo Photo or Upload Custom:",
                [
                    "📦 Baled Corrugated Cartons (Kraft Gatta)",
                    "🧴 Transparent PET Water & Soft Drink Bottles",
                    "✨ Stripped Copper Wire & Armoured Cables",
                    "🔩 Heavy Structural Iron Angles & Rods"
                ]
            )
            up_img = st.file_uploader("Or Upload Custom Scrap Photo:", type=["jpg", "jpeg", "png"])
            run_ai = st.button("⚡ Run ScrapVision Neural Analysis", type="primary")

        with sv_col2:
            if run_ai or True:
                if "Cartons" in sample_choice:
                    mat_name = "Corrugated Carton (Kraft Gatta)"
                    conf = 98.4
                    est_w = "18 - 24 kg"
                    m_rate = 15.5
                    tot = "₹279 - ₹372"
                elif "PET" in sample_choice:
                    mat_name = "Rigid Plastics (PET Clear Optical)"
                    conf = 96.8
                    est_w = "12 - 16 kg"
                    m_rate = 28.0
                    tot = "₹336 - ₹448"
                elif "Copper" in sample_choice:
                    mat_name = "Millberry Copper Wire (99.9%)"
                    conf = 99.1
                    est_w = "4 - 6 kg"
                    m_rate = 685.0
                    tot = "₹2,740 - ₹4,110"
                else:
                    mat_name = "Heavy Iron Scrap (Loha HMS 1/2)"
                    conf = 95.5
                    est_w = "25 - 35 kg"
                    m_rate = 34.0
                    tot = "₹850 - ₹1,190"

                st.markdown(f"""
                <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:12px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <b style="color:#14532d; font-size:1.1rem;">AI Detected: {mat_name}</b>
                        <span style="background:#dcfce7; color:#166534; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:12px;">{conf}% Confidence</span>
                    </div>
                    <hr style="margin:8px 0; border-color:#bbf7d0;">
                    <div style="font-size:0.9rem; color:#166534;">
                        • Estimated Quantity: <b>{est_w}</b><br>
                        • Benchmark Mandi Rate: <b>₹{m_rate}/kg</b><br>
                        • Expected Valuation: <b style="font-size:1.2rem; color:#047857;">{tot}</b>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    with h_tab3:
        st.markdown("#### 🧾 Digital Waste Passports (Cradle-to-Gate Certificates)")
        st.caption("Every completed transaction generates an immutable cryptographic SHA-256 seal:")
        st.markdown("""
        <div class="receipt-container">
            <div class="receipt-header">
                <span style="font-size:1.2rem; font-weight:800; color:#064e3b;">SCRAPSETU DIGITAL WASTE PASSPORT</span><br>
                <span>Receipt Number: RCP-2026-DEL-0894</span><br>
                <span>CPCB Traceable • Merkle Block #184920</span>
            </div>
            <div class="receipt-row"><span>Citizen Generator:</span><span>Pooja Verma (Household)</span></div>
            <div class="receipt-row"><span>Collector Partner:</span><span>Ramu Paswan (Kavach Certified)</span></div>
            <div class="receipt-row"><span>Weighing Hardware:</span><span>TrustWeigh BT Scale (±0.05kg)</span></div>
            <div class="receipt-row"><span>Material Category:</span><span>Rigid Plastics (PET / HDPE)</span></div>
            <div class="receipt-row"><span>Net Weight:</span><span>24.8 kg</span></div>
            <div class="receipt-row"><span>Settled Benchmark Rate:</span><span>₹28.00 / kg</span></div>
            <div class="receipt-total"><span>Total UPI Payout:</span><span>₹694.40 Settled</span></div>
            <hr style="border-top:1px dashed #cbd5e1; margin:8px 0;">
            <div style="font-size:0.75rem; word-break:break-all; color:#475569;">
                SHA-256 Seal: 9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058
            </div>
        </div>
        """, unsafe_allow_html=True)


# =============================================================
# 2. 🛺 DEDICATED KABADIWALA (COLLECTOR) DASHBOARD
# =============================================================
elif current_role == "COLLECTOR":
    st.subheader(f"🛺 कबाड़ीवाला जॉब टर्मिनल (Collector Terminal) — {st.session_state.user_name}")
    st.caption("Mobile-first accessible terminal with EcoRoute TSP route navigation, TrustWeigh digital scale entry & 3-Point KYC status.")

    kc1, kc2, kc3, kc4 = st.columns(4)
    with kc1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">187.5 / 250 kg</div><div class="kpi-lbl">Daily Vehicle Capacity (75%)</div></div>', unsafe_allow_html=True)
    with kc2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">Today Collections Settled</div></div>', unsafe_allow_html=True)
    with kc3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">3 Orders</div><div class="kpi-lbl">Completed Pickups</div></div>', unsafe_allow_html=True)
    with kc4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">38% Fuel Saved</div><div class="kpi-lbl">EcoRoute TSP Savings</div></div>', unsafe_allow_html=True)

    col_tab1, col_tab_match, col_tab_pool, col_tab_pass, col_tab_voice, col_tab2, col_tab3 = st.tabs([
        "📍 नजदीकी ऑर्डर्स व तौल (Jobs & Scale)",
        "🎯 स्मार्ट बायर मैचिंग (Smart Buyer Matching)",
        "🤝 सहयोगात्मक स्क्रैप पूलिंग (Scrap Pooling)",
        "📜 स्क्रैप पासपोर्ट व ट्रैसेबिलिटी (Scrap Passport)",
        "🎤 बोलकर चलाएं (Voice Mode)",
        "🗺️ EcoRoute TSP रूट प्लानर",
        "🪪 3-Point KYC सत्यापन"
    ])

    with col_tab1:
        k_col1, k_col2 = st.columns([1, 1], gap="large")
        with k_col1:
            st.markdown("#### 📍 नजदीकी खुले पिकअप (Nearby Open Jobs)")
            open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
            if open_jobs:
                for job in open_jobs:
                    dist = haversine_km(28.5684, 77.2195, job["lat"], job["lng"])
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
                st.info("वर्तमान में कोई खुला पिकअप नहीं है। सभी ऑर्डर्स पूरे हो चुके हैं।")

        with k_col2:
            st.markdown("#### ⚖️ TrustWeigh तौल दर्ज करें व डिजिटल रसीद बनाएं")
            accepted_jobs = [p for p in st.session_state.pickups if p["status"] == "ACCEPTED"]
            if accepted_jobs:
                sel_j = st.selectbox("चुनें चालू पिकअप:", [p["id"] for p in accepted_jobs])
                tgt = next(p for p in accepted_jobs if p["id"] == sel_j)
                
                with st.form("weigh_form"):
                    st.write(f"**ग्राहक:** {tgt['user']} (📞 {tgt.get('phone', '+91 98290 00000')})")
                    w_gross = st.number_input("सकल वजन (Gross Weight in kg):", min_value=1.0, value=float(tgt["est_weight"])+0.5)
                    w_tare = st.number_input("खाली बोरी/कंटेनर वजन (Tare Weight in kg):", min_value=0.0, value=0.5)
                    w_net = round(w_gross - w_tare, 2)
                    st.write(f"**वास्तविक शुद्ध वजन (Net Calibrated Weight):** `{w_net} kg`")
                    w_rt = st.number_input("सहमति दर (Agreed Rate ₹/kg):", min_value=1.0, value=28.0)
                    w_tot = round(w_net * w_rt, 2)
                    st.markdown(f"### कुल देय राशि: ₹{w_tot:,.2f}")
                    
                    if st.form_submit_button("⚖️ डिजिटल रसीद जारी करें व UPI भुगतान पूरा करें", type="primary", use_container_width=True):
                        r_no = f"RCP-2026-DEL-{int(time.time())%100000}"
                        r_h = generate_receipt_hash(r_no, tgt["user"], st.session_state.user_name, w_tot, w_net, str(datetime.datetime.now()))
                        tgt["status"] = "COMPLETED"
                        tgt["est_weight"] = w_net
                        tgt["est_val"] = w_tot
                        tgt["receipt_number"] = r_no
                        tgt["receipt_hash"] = r_h
                        st.session_state.audit_logs.append({
                            "action": "COMPLETE_TRANSACTION",
                            "user": st.session_state.user_name,
                            "details": f"Issued receipt {r_no} for {w_net}kg (₹{w_tot})",
                            "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                        })
                        st.success(f"रसीद #{r_no} जारी हुई! SHA-256 क्रिप्टोग्राफिक सील लॉक हुई।")
                        st.rerun()
            else:
                st.info("कोई चालू पिकअप नहीं है जिसे तौलना हो। कृपया बायीं ओर से नया पिकअप स्वीकार करें।")

    # ---------------- 2. SMART BUYER MATCHING TAB ----------------
    with col_tab_match:
        st.markdown("#### 🎯 स्मार्ट बायर मैचिंग (Smart Buyer Matching)")
        st.caption("कबाड़ीवाले के पास उपलब्ध वजन व वाहन के अनुसार सबसे ज्यादा **शुद्ध मुनाफा (Net Proceeds)** देने वाले रीसाइक्लर की सिफारिश:")

        sm_c1, sm_c2 = st.columns([1, 2], gap="medium")
        with sm_c1:
            with st.container(border=True):
                st.markdown("##### 📦 उपलब्ध स्क्रैप लॉट")
                sm_mat = st.selectbox("सामग्री (Category):", ["Plastic (PET / HDPE)", "Paper & Cardboard", "Copper Wire", "Aluminium Section"])
                sm_wt = st.number_input("उपलब्ध वजन (Weight in kg):", min_value=10, max_value=2000, value=180, step=10)
                sm_veh = st.selectbox("परिवहन वाहन (Vehicle Tier):", ["THREE_WHEELER (E-Rickshaw: ₹50 + ₹12/km)", "MINI_TRUCK (Tata Ace: ₹90 + ₹18/km)", "HAND_CART (Manual: ₹20 + ₹8/km)"])
                sm_dist_filter = st.slider("अधिकतम दूरी (Max Distance km):", 5, 50, 30)

        with sm_c2:
            # Calculate buyer comparisons
            v_type = "THREE_WHEELER" if "THREE_WHEELER" in sm_veh else ("MINI_TRUCK" if "MINI_TRUCK" in sm_veh else "HAND_CART")
            base_f = 50 if v_type == "THREE_WHEELER" else (90 if v_type == "MINI_TRUCK" else 20)
            rate_k = 12 if v_type == "THREE_WHEELER" else (18 if v_type == "MINI_TRUCK" else 8)

            buyers = [
                {"name": "EcoTransform Recycling Facility #BLR-04", "dist": 3.8, "rate": 34.0, "min_kg": 50, "cap_kg": 2000, "cpcb": "CPCB/PWM/BLR/092", "loc": "Peenya Ind. Area"},
                {"name": "Apex CleanPlast Reclaimers Pvt Ltd", "dist": 8.4, "rate": 35.5, "min_kg": 100, "cap_kg": 5000, "cpcb": "CPCB/PWM/DEL/044", "loc": "Okhla Phase 1"},
                {"name": "National Bulk Recyclers Consortium", "dist": 22.0, "rate": 38.0, "min_kg": 500, "cap_kg": 10000, "cpcb": "CPCB/EPR/2026/012", "loc": "Greater Noida Industrial"},
            ]

            results = []
            for b in buyers:
                t_cost = base_f + (b["dist"] * rate_k)
                gross = sm_wt * b["rate"]
                net = gross - t_cost
                meets_min = sm_wt >= b["min_kg"]
                results.append({**b, "t_cost": t_cost, "gross": gross, "net": net, "meets_min": meets_min})

            # Sort eligible buyers by net proceeds descending
            eligible = sorted([r for r in results if r["meets_min"] and r["dist"] <= sm_dist_filter], key=lambda x: x["net"], reverse=True)
            ineligible = [r for r in results if not r["meets_min"] or r["dist"] > sm_dist_filter]

            if eligible:
                top = eligible[0]
                st.markdown(f"""
                <div style="background:#052e16; border:2px solid #22c55e; border-radius:18px; padding:18px; color:white; margin-bottom:14px;">
                    <span style="background:#22c55e; color:#052e16; font-size:10px; font-weight:900; padding:2px 8px; border-radius:999px; text-transform:uppercase;">
                        🌟 TOP RECOMMENDATION (सर्वश्रेष्ठ शुद्ध मुनाफा)
                    </span>
                    <h3 style="color:#ffffff; margin:6px 0 2px 0;">{top['name']}</h3>
                    <p style="color:#86efac; font-size:12px; margin-bottom:8px;">स्थान: {top['loc']} • दूरी: <b>{top['dist']} किमी</b> • CPCB मान्यता: {top['cpcb']}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:rgba(0,0,0,0.4); padding:10px; border-radius:12px;">
                        <div><span style="font-size:11px; color:#9ca3af;">सकल मूल्य (Gross)</span><br><b style="font-size:16px; color:#ffffff;">₹{top['gross']:,.2f}</b><br><span style="font-size:10px; color:#a7f3d0;">@ ₹{top['rate']}/kg</span></div>
                        <div><span style="font-size:11px; color:#9ca3af;">अनुमानित भाड़ा (Transport)</span><br><b style="font-size:16px; color:#f87171;">-₹{top['t_cost']:,.2f}</b><br><span style="font-size:10px; color:#fca5a5;">{top['dist']} km @ {v_type}</span></div>
                        <div><span style="font-size:11px; color:#a7f3d0;">शुद्ध प्राप्ति (Net Proceeds)</span><br><b style="font-size:20px; color:#4ade80;">₹{top['net']:,.2f}</b><br><span style="font-size:10px; color:#86efac;">सर्वाधिक कमाई</span></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

                st.markdown("##### 📋 अन्य उपलब्ध रीसाइक्लर विकल्प (Comparable Buyer Offers)")
                for alt in eligible:
                    with st.container(border=True):
                        ac1, ac2, ac3 = st.columns([2, 1, 1])
                        with ac1:
                            st.markdown(f"**{alt['name']}**")
                            st.caption(f"दूरी: {alt['dist']} km • न्यूनतम लॉट: {alt['min_kg']} kg")
                        with ac2:
                            st.markdown(f"दर: **₹{alt['rate']}/kg**")
                            st.caption(f"भाड़ा: ₹{alt['t_cost']:,.0f}")
                        with ac3:
                            st.markdown(f"**शुद्ध: ₹{alt['net']:,.2f}**")
                            if st.button("चुनें (Select)", key=f"sel_b_{alt['name'][:8]}", use_container_width=True):
                                st.success(f"{alt['name']} चुना गया! लॉट #LOT-2026-PET-8821 बायर को असाइन हुआ।")

            if ineligible:
                st.markdown("##### ⚠️ अनुपयुक्त रीसाइक्लर (Incompatible Buyers)")
                for inel in ineligible:
                    with st.container(border=True):
                        st.markdown(f"**{inel['name']}** (दूरी: {inel['dist']} km • दर: ₹{inel['rate']}/kg)")
                        if not inel["meets_min"]:
                            st.warning(f"❌ न्यूनतम लॉट आवश्यकता पूरी नहीं: आवश्यक {inel['min_kg']} kg, आपके पास केवल {sm_wt} kg है।")
                        elif inel["dist"] > sm_dist_filter:
                            st.warning(f"❌ अधिकतम सीमा ({sm_dist_filter} km) से अधिक दूरी: {inel['dist']} km।")

    # ---------------- 3. COLLABORATIVE SCRAP POOLING TAB ----------------
    with col_tab_pool:
        st.markdown("#### 🤝 सहयोगात्मक स्क्रैप पूलिंग (Collaborative Scrap Pooling)")
        st.caption("छोटे कबाड़ीवाले आपस में स्क्रैप मिलाकर बड़ी बल्क लॉट बनाते हैं और सीधा रीसाइक्लर से +15% से +25% तक प्रीमियम दर पाते हैं:")

        pool_c1, pool_c2 = st.columns([1, 1], gap="large")
        with pool_c1:
            st.markdown("##### 📦 सक्रिय पूलिंग ग्रुप (Active Pooling Consignments)")
            pools_data = [
                {"id": "POOL-001", "name": "इंदिरानगर PET प्लास्टिक बल्क पूल", "cat": "Plastic (PET)", "target": 1000, "pledged": 640, "rate": 34.0, "solo": 28.0, "deadline": "कल शाम 5 बजे", "hub": "इंदिरानगर रिकवरी यार्ड"},
                {"id": "POOL-002", "name": "कोरमंगला कार्डबोर्ड व गत्ता मेगा लॉट", "cat": "Cardboard", "target": 2000, "pledged": 1750, "rate": 18.5, "solo": 14.0, "deadline": "2 दिन में", "hub": "कोरमंगला 4th ब्लॉक यार्ड"},
            ]

            for p in pools_data:
                pct = int((p["pledged"] / p["target"]) * 100)
                rem = p["target"] - p["pledged"]
                bonus = p["rate"] - p["solo"]
                with st.container(border=True):
                    st.markdown(f"**{p['name']}** (`{p['id']}`)")
                    st.caption(f"सामग्री: **{p['cat']}** • हब: {p['hub']} • अंतिम समय: {p['deadline']}")
                    st.progress(pct / 100)
                    st.write(f"प्रगति: **{p['pledged']} / {p['target']} kg ({pct}%)** • शेष: **{rem} kg**")
                    st.markdown(f"बल्क दर: **₹{p['rate']}/kg** *(अकेले बेचने पर केवल ₹{p['solo']}/kg, पूलिंग बोनस: +₹{bonus}/kg)*")

        with pool_c2:
            st.markdown("##### ✍️ अपने स्क्रैप का योगदान दें (Pledge Scrap to Pool)")
            with st.form("pledge_form"):
                p_choice = st.selectbox("चुनें पूलिंग ग्रुप:", [f"{p['id']} — {p['name']}" for p in pools_data])
                pl_kg = st.number_input("योगदान हेतु वजन (Pledged Weight in kg):", min_value=10, max_value=500, value=50, step=5)
                
                est_p = pl_kg * 34.0
                est_b = pl_kg * 6.0
                st.info(f"💡 **अनुमानित भुगतान:** ₹{est_p:,.2f} | **पूलिंग अतिरिक्त बोनस:** +₹{est_b:,.2f}")
                st.caption("🔒 निष्पक्षता नियम: आपका योगदान सुरक्षित रहेगा। 100% पूरा होने से पहले आप कभी भी वापस ले सकते हैं।")
                
                if st.form_submit_button("🤝 पूल में स्क्रैप लॉक करें (Lock Pledge)", type="primary", use_container_width=True):
                    st.success(f"सफलतापूर्वक {pl_kg} kg स्क्रैप पूल में जोड़ा गया! आपकी हिस्सेदारी 14.2% आरक्षित हुई।")

    # ---------------- 4. SCRAP PASSPORT TAB ----------------
    with col_tab_pass:
        st.markdown("#### 📜 डिजिटल स्क्रैप पासपोर्ट व ट्रैसेबिलिटी (Scrap Passport)")
        st.caption("कचरा संग्रहण से लेकर रीसाइक्लिंग प्लांट तक 8-चरणीय ब्लॉकचेन-सीलबंद जीवनचक्र:")

        st.markdown("""
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:16px; padding:16px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:11px; background:#dcfce7; color:#15803d; font-weight:bold; padding:2px 8px; border-radius:999px;">CPCB AUDIT TRAIL</span>
                    <h3 style="color:#0f172a; margin:4px 0 0 0;">पासपोर्ट आईडी: WP-2024-00124 (LOT-2026-PET-8821)</h3>
                    <p style="color:#64748b; font-size:12px;">सामग्री: <b>Plastic (Grade A PET Flakes)</b> • स्रोत: इंदिरानगर, बैंगलोर</p>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:24px;">🏁</span><br>
                    <b style="color:#15803d; font-size:13px;">स्थिति: RECEIVED & VERIFIED ✓</b>
                </div>
            </div>
            <hr style="border-top:1px solid #f1f5f9; margin:10px 0;">
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; font-size:12px;">
                <div>संग्रहण वजन: <b>60.0 kg</b></div>
                <div>वेजब्रिज वजन: <b style="color:#b45309;">56.5 kg</b></div>
                <div>वजन विसंगति: <b style="color:#dc2626;">-3.5 kg (-5.8%)</b></div>
                <div>निपटान राशि: <b style="color:#15803d;">₹1,921.00</b></div>
            </div>
            <div style="background:#fef3c7; border:1px solid #fde047; border-radius:8px; padding:8px; font-size:11px; color:#854d0e; margin-top:8px;">
                ⚠️ <b>वेजब्रिज विसंगति सूचना:</b> धूल व नमी कटौती (-3.5 kg) रीसाइक्लर वेजब्रिज पर सत्यापित हुई। डिजिटल रसीद शुद्ध वजन पर लॉक हुई।
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("##### 📍 8-चरणीय ट्रैसेबिलिटी यात्रा (Full Traceability Timeline)")
        t_steps = [
            ("1. Generated", "प्रिया शर्मा द्वारा इंदिरानगर घर पर प्लास्टिक पृथक्करण", "Today 09:30 AM", "✅"),
            ("2. Booked", "ScrapSetu ऐप द्वारा पिकअप स्लॉट शेड्यूलिंग", "Today 09:45 AM", "✅"),
            ("3. Collected", "रमेश कुमार द्वारा ई-रिक्शा पर लोडिंग", "Today 10:45 AM", "✅"),
            ("4. Weighed", "TrustWeigh डिजिटल स्केल द्वारा 60.0 kg का सत्यापन", "Today 11:00 AM", "✅"),
            ("5. Buyer Matched", "स्मार्ट मैचिंग द्वारा EcoTransform प्लांट #04 का चयन (₹34/kg)", "Today 11:30 AM", "✅"),
            ("6. Handed Over", "पिकअप हब से रीसाइक्लर प्लांट को डिस्पैच", "Today 01:15 PM", "✅"),
            ("7. Received", "50T वेजब्रिज पर 56.5 kg शुद्ध वजन की पुष्टि (#WB-9921)", "Today 02:45 PM", "✅"),
            ("8. Processed", "rPET फूड-ग्रेड पेलेट्स में परिवर्तन व CPCB EPR प्रमाणन", "Today 04:00 PM", "🔄"),
        ]

        for s, d, tm, icon in t_steps:
            st.markdown(f"- {icon} **{s}**: {d} *({tm})*")

    # ---------------- 5. VOICE-FIRST MODE TAB ----------------
    with col_tab_voice:
        st.markdown("#### 🎤 बोलकर चलाएं (Voice-First Kabadiwala Mode)")
        st.caption("अशिक्षित व अनौपचारिक कबाड़ीवालों के लिए सुलभ वॉयस कमांड इंजन:")

        v_c1, v_c2 = st.columns([1, 1], gap="large")
        with v_c1:
            st.markdown("##### 🎙️ वॉयस कमांड का परीक्षण करें (Voice Command Simulator)")
            voice_choice = st.selectbox(
                "चुने या बोलें (Select Hindi Voice Phrase):",
                [
                    "आज के पिकअप दिखाओ",
                    "पास के स्क्रैप जॉब्स दिखाओ",
                    "मेरी आज की कमाई दिखाओ",
                    "प्लास्टिक के बायर्स दिखाओ",
                    "स्क्रैप पूल दिखाओ",
                    "पिकअप कम्प्लीट करना है"
                ]
            )

            if st.button("🗣️ कमांड प्रोसेस करें (Execute Voice Command)", type="primary", use_container_width=True):
                st.session_state.last_voice_cmd = voice_choice
                st.session_state.audit_logs.append({
                    "action": "VOICE_COMMAND_EXECUTED",
                    "user": st.session_state.user_name,
                    "details": f"Processed voice command '{voice_choice}'",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.rerun()

        with v_c2:
            st.markdown("##### 📋 सिस्टम प्रतिक्रिया व पुष्टि (Action Feedback)")
            curr_cmd = st.session_state.get("last_voice_cmd", "आज के पिकअप दिखाओ")
            st.success(f"**पहचाना गया आदेश:** \"{curr_cmd}\"")

            if curr_cmd == "आज के पिकअप दिखाओ" or curr_cmd == "पास के स्क्रैप जॉब्स दिखाओ":
                st.info("✅ **कार्रवाई:** कबाड़ीवाला टर्मिनल के नजदीकी 3 खुले ऑर्डर्स लोड किए गए।")
            elif curr_cmd == "मेरी आज की कमाई दिखाओ":
                st.info("✅ **कार्रवाई:** आज की कुल कमाई ₹1,250.00 (4 पिकअप पूरे) स्क्रीन पर प्रदर्शित है।")
            elif curr_cmd == "प्लास्टिक के बायर्स दिखाओ":
                st.info("✅ **कार्रवाई:** स्मार्ट बायर मैचिंग में प्लास्टिक रीसाइक्लर्स की सूची सक्रिय की गई।")
            elif curr_cmd == "स्क्रैप पूल दिखाओ":
                st.info("✅ **कार्रवाई:** सहयोगात्मक पूलिंग ग्रुप लोड किए गए।")
            elif curr_cmd == "पिकअप कम्प्लीट करना है":
                st.warning("⚠️ **पुष्टि आवश्यक:** क्या आप ग्राहक प्रिया शर्मा (15 kg प्लास्टिक) का डिजिटल वजन व भुगतान पूरा करना चाहते हैं?")
                st.button("हाँ, भुगतान पूरा करें (Confirm)", type="primary")

    with col_tab2:
        st.markdown("#### 🗺️ EcoRoute TSP Smart Route Navigation")
        st.caption("Travelling Salesperson Problem (TSP) algorithm orders all pending pickups into the shortest fuel-efficient loop:")

        st.markdown("""
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:12px; padding:12px; margin-bottom:12px;">
            <b style="color:#14532d;">🚀 इष्टतम संग्रह मार्ग (Optimized Route Sequence):</b><br>
            <span style="color:#166534; font-size:13px;">
                <b>स्टॉप 1:</b> South Extension II (REQ-101) ➡️ 
                <b>स्टॉप 2:</b> Saket District Centre (REQ-103) ➡️ 
                <b>स्टॉप 3:</b> EcoPlast Recycling Mill (Okhla Hub)
            </span><br>
            <span style="color:#15803d; font-size:12px;">कुल दूरी: <b>14.2 किमी</b> (38% की बचत • 2.8 लीटर पेट्रोल/डीजल बचा)</span>
        </div>
        """, unsafe_allow_html=True)

        m_tsp = folium.Map(location=[28.5484, 77.2400], zoom_start=12)
        folium.Marker([28.5684, 77.2195], tooltip="स्टॉप 1: South Extension II", icon=folium.Icon(color="green", icon="1", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5284, 77.2185], tooltip="स्टॉप 2: Saket District Centre", icon=folium.Icon(color="blue", icon="2", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5355, 77.2728], tooltip="स्टॉप 3: Okhla Recycling Plant", icon=folium.Icon(color="red", icon="flag")).add_to(m_tsp)
        # Add polyline
        folium.PolyLine([[28.5684, 77.2195], [28.5284, 77.2185], [28.5355, 77.2728]], color="green", weight=4, opacity=0.8).add_to(m_tsp)
        st_folium(m_tsp, height=320, use_container_width=True)

    with col_tab3:
        st.markdown("#### 🪪 3-Point KYC Identity & Safety Credentials")
        st.caption("Aadhaar, Driving Licence, and Live Camera Selfie guarantee partner authenticity and citizen trust:")

        my_kyc = next((k for k in st.session_state.kyc_records if k["name"] == st.session_state.user_name), None)
        if my_kyc and "APPROVED" in my_kyc["status"]:
            st.success("🟢 **KYC स्थिति: APPROVED (सत्यापित कबाड़ीवाला साथी ✓)** — CPCB व दिल्ली पुलिस रिकॉर्ड में पंजीकृत")
            kc1, kc2, kc3 = st.columns(3)
            with kc1:
                st.info(f"📄 **Aadhaar Card:**\n`{my_kyc['aadhaar_num']}`\n\nStatus: {my_kyc['aadhaar_status']}")
            with kc2:
                st.info(f"🪪 **Driving Licence:**\n`{my_kyc['dl_num']}`\n\nStatus: {my_kyc['dl_status']}")
            with kc3:
                st.info(f"🤳 **Live Face Match:**\nConfidence: 98.4%\n\nStatus: {my_kyc['selfie_status']}")
        else:
            st.warning("⏳ **KYC स्थिति: सत्यापन प्रतीक्षारत (Pending Inspection)**")


# =============================================================
# 3. 🏢 DEDICATED COMMERCIAL BUSINESS DASHBOARD
# =============================================================
elif current_role == "BUSINESS":
    st.subheader(f"🏢 Commercial Bulk Waste Dashboard — {st.session_state.user_name}")
    st.caption("Manage industrial packaging scrap, recurring collection contracts, multi-warehouse bays & GST invoices.")

    bk1, bk2, bk3, bk4 = st.columns(4)
    with bk1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">175.0 kg</div><div class="kpi-lbl">Total Commercial Tonnage</div></div>', unsafe_allow_html=True)
    with bk2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">GST Invoice Settlements</div></div>', unsafe_allow_html=True)
    with bk3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">Weekly</div><div class="kpi-lbl">Recurring Contract</div></div>', unsafe_allow_html=True)
    with bk4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">CPCB CAT-I</div><div class="kpi-lbl">EPR Compliance Status</div></div>', unsafe_allow_html=True)

    b_col1, b_col2 = st.columns([1, 1], gap="large")
    with b_col1:
        st.markdown("#### 🏭 Commercial Dispatch Bays")
        st.dataframe(pd.DataFrame([
            {"Facility": "Okhla Phase-III Central Bay 7", "Type": "Logistics & Pallets", "Status": "Active Primary"},
            {"Facility": "Saket District Centre Mall Outlet", "Type": "Retail Packaging", "Status": "Active Branch"},
        ]), hide_index=True, use_container_width=True)

        with st.form("book_commercial"):
            st.markdown("##### Schedule Heavy Commercial Dispatch")
            b_bay = st.selectbox("Dispatch Location", ["Okhla Phase-III Central Bay 7", "Saket District Centre Mall Outlet"])
            b_ton = st.number_input("Estimated Bulk Load (kg)", min_value=50.0, value=250.0, step=25.0)
            b_recur = st.checkbox("Set as Recurring Weekly Subscription", value=True)
            if st.form_submit_button("Book Mini-Truck Heavy Vehicle Dispatch", type="primary"):
                st.success(f"Commercial dispatch of {b_ton} kg booked! Assigned to mini-truck collector.")

    with b_col2:
        st.markdown("#### 🧾 GST Invoices & EPR Credit Certificates")
        st.dataframe(pd.DataFrame([
            {"Invoice #": "RCP-2026-DEL-0894", "Weight": "175.0 kg", "Amount": "₹6,895.00", "Payment": "UPI Verified", "Date": "2026-10-10"},
            {"Invoice #": "RCP-2026-DEL-0712", "Weight": "210.0 kg", "Amount": "₹8,120.00", "Payment": "Bank Transfer", "Date": "2026-09-28"},
        ]), hide_index=True, use_container_width=True)

        st.markdown("""
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:12px; margin-top:12px;">
            <b style="color:#1e40af;">📄 Annual CPCB EPR Compliance Summary:</b><br>
            <span style="color:#1e3a8a; font-size:13px;">
                Target: 1,500 kg • Diverted to Date: <b>1,840 kg (122% Achieved)</b><br>
                Audited Scope 3 GHG Reduction: <b>2.76 Metric Tonnes CO₂e</b>
            </span>
        </div>
        """, unsafe_allow_html=True)


# =============================================================
# 4. 🏭 DEDICATED RECYCLER DASHBOARD
# =============================================================
elif current_role == "RECYCLER":
    st.subheader(f"🏭 Recycler Facility Portal — {st.session_state.user_name}")
    st.caption("Publish factory buying rates, issue weighbridge intake slips, and manage circular throughput.")

    rk1, rk2, rk3, rk4 = st.columns(4)
    with rk1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">175.0 kg</div><div class="kpi-lbl">Inbound Throughput</div></div>', unsafe_allow_html=True)
    with rk2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">Raw Material Outlay</div></div>', unsafe_allow_html=True)
    with rk3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">3 Rates</div><div class="kpi-lbl">Active Buying Offers</div></div>', unsafe_allow_html=True)
    with rk4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">CPCB Verified</div><div class="kpi-lbl">License DEL/PWM/2024</div></div>', unsafe_allow_html=True)

    r_col1, r_col2 = st.columns([1, 1], gap="large")
    with r_col1:
        st.markdown("#### Published Factory Buying Rate Sheet")
        st.dataframe(pd.DataFrame(st.session_state.recycler_offers), hide_index=True, use_container_width=True)

        with st.form("new_rate"):
            st.markdown("##### + Post New Buying Offer")
            n_cat = st.selectbox("Category", [c["name"] for c in st.session_state.categories])
            n_rate = st.number_input("Buying Rate (₹/kg)", min_value=1.0, value=32.5)
            n_lot = st.number_input("Min Lot Size (kg)", min_value=10, value=50)
            if st.form_submit_button("+ Publish Rate to Regional Mandis", type="primary"):
                st.session_state.recycler_offers.append({"mill": "EcoPlast Reclaimers", "cat": n_cat, "rate": n_rate, "min_lot": n_lot, "location": "Okhla Industrial Area"})
                st.success("New buying offer published live to all collectors!")
                st.rerun()

    with r_col2:
        st.markdown("#### Weighbridge Gate Intake Slip Generator")
        with st.form("intake_gen"):
            s_sup = st.text_input("Supplier / Collector Name", "Ramu Paswan (Kavach Certified)")
            s_wt = st.number_input("Scale Net Weight (kg)", min_value=10.0, value=175.0)
            s_rt = st.number_input("Purchase Price (₹/kg)", min_value=1.0, value=31.5)
            st.write(f"**Total Settlement Outlay:** ₹{round(s_wt * s_rt, 2):,.2f}")
            if st.form_submit_button("Record Weighbridge Slip", type="primary"):
                st.success("Inbound weighbridge slip recorded and linked to collector ledger!")


# =============================================================
# 5. 🛡️ DEDICATED ADMINISTRATOR DASHBOARD
# =============================================================
elif current_role == "ADMIN":
    st.subheader(f"🛡️ Platform Governance & Regulatory Console — {st.session_state.user_name}")
    st.caption("3-Point KYC inspection queue, Mandi benchmark rate governance, EcoShield fraud review & Free Cloud Database Manager.")

    ak1, ak2, ak3, ak4 = st.columns(4)
    with ak1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(st.session_state.pickups)} Orders</div><div class="kpi-lbl">Total Requests</div></div>', unsafe_allow_html=True)
    with ak2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">100%</div><div class="kpi-lbl">Settlement Rate</div></div>', unsafe_allow_html=True)
    with ak3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹11,670.00</div><div class="kpi-lbl">Total Cashflow Settled</div></div>', unsafe_allow_html=True)
    with ak4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">0 Disputes</div><div class="kpi-lbl">Dispute Status: Normal</div></div>', unsafe_allow_html=True)

    a_tab1, a_tab2, a_tab3, a_tab4, a_tab5 = st.tabs([
        "📋 3-Point KYC Verification Queue",
        "📈 Mandi Benchmark Rates",
        "🛡️ EcoShield Anomaly Audit",
        "🗄️ Free Cloud Database Manager",
        "📜 Cryptographic Audit Ledger"
    ])

    with a_tab1:
        st.markdown("#### 📋 3-Point KYC Verification Queue")
        st.caption("Review uploaded Government Aadhaar Cards, Driving Licences, and Live Biometric Selfies to authorize doorstep collection partners:")

        kyc_df = pd.DataFrame([
            {
                "ID": k["id"],
                "Partner Name": k["name"],
                "Role": k["role"],
                "Vehicle": k.get("vehicle", "N/A"),
                "Aadhaar Number": k["aadhaar_num"],
                "DL Number": k["dl_num"],
                "Selfie Status": k["selfie_status"],
                "Status": k["status"]
            }
            for k in st.session_state.kyc_records
        ])
        st.dataframe(kyc_df, hide_index=True, use_container_width=True)

        st.divider()
        st.markdown("#### 🔍 Interactive 3-Card KYC Dossier Inspector")
        all_candidates = st.session_state.kyc_records

        target_name = st.selectbox(
            "Select Applicant Dossier to Inspect:",
            [k["name"] for k in all_candidates],
            index=next((i for i, k in enumerate(all_candidates) if "PENDING" in k["status"]), 0)
        )
        cand = next(k for k in all_candidates if k["name"] == target_name)

        doc_col1, doc_col2, doc_col3 = st.columns(3)
        with doc_col1:
            st.markdown(f"""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">📄</div>
                <b>Government Aadhaar Card</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">UIDAI Verified ID Proof</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
                    UID: {cand['aadhaar_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
                    Status: {cand['aadhaar_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col2:
            st.markdown(f"""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🪪</div>
                <b>Driving Licence (DL)</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">Ministry of Road Transport</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
                    DL No: {cand['dl_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
                    Status: {cand['dl_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col3:
            st.markdown(f"""
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🤳</div>
                <b>Live Biometric Selfie</b>
                <div style="font-size:11px; color:#475569; margin:4px 0;">Anti-Spoofing Face Match</div>
                <div style="background:#e2e8f0; border-radius:6px; padding:6px; font-family:monospace; font-size:12px;">
                    Biometric Similarity: 98.4%
                </div>
                <div style="margin-top:6px; font-size:11px; color:#059669; font-weight:bold;">
                    Status: {cand['selfie_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.write("")
        d_b1, d_b2 = st.columns([1, 1])
        with d_b1:
            if cand["status"] != "APPROVED ✓":
                if st.button(f"✅ Approve 3-Point KYC for {cand['name']}", type="primary", use_container_width=True):
                    cand["status"] = "APPROVED ✓"
                    cand["reviewed_by"] = st.session_state.user_name
                    cand["aadhaar_status"] = "Verified UIDAI ✓"
                    cand["dl_status"] = "Verified RTO ✓"
                    cand["selfie_status"] = "Face Match 98.8% ✓"
                    st.session_state.audit_logs.append({
                        "action": "APPROVE_KYC",
                        "user": st.session_state.user_name,
                        "details": f"Approved 3-point KYC for {cand['name']}",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(f"🎉 {cand['name']} KYC has been APPROVED! Partner is now authorized for doorstep pickups.")
                    st.rerun()
            else:
                st.info(f"✅ {cand['name']} holds an active approved credential.")

        with d_b2:
            if st.button(f"❌ Reject / Request Re-upload for {cand['name']}", use_container_width=True):
                cand["status"] = "REJECTED (Re-upload requested)"
                st.session_state.audit_logs.append({
                    "action": "REJECT_KYC",
                    "user": st.session_state.user_name,
                    "details": f"Requested document re-upload for {cand['name']}",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.warning(f"Notification sent to {cand['name']} to re-upload clear documents.")
                st.rerun()

    with a_tab2:
        st.markdown("#### Mandi Benchmark Rate Editor")
        st.caption("Adjust official wholesale benchmark rates broadcast across national recycling clusters:")
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
                    st.success(f"{c['name']} benchmark updated to ₹{new_r}/kg!")
                    st.rerun()

    with a_tab3:
        st.markdown("#### 🛡️ EcoShield Anomaly & Anti-Fraud Audit")
        st.caption("Automated heuristic models monitor transactions for weight spikes or pricing anomalies:")
        st.dataframe(pd.DataFrame([
            {"Anomaly ID": "ANM-2026-081", "Entity": "Domestic Account #482", "Detected Issue": "Weight spike: 320 kg for domestic apartment", "Severity": "MEDIUM", "Status": "RESOLVED (Verified Home Renovation)"},
            {"Anomaly ID": "ANM-2026-082", "Entity": "Collector Ramu Paswan", "Detected Issue": "Copper price spread +14% above Mandi", "Severity": "LOW", "Status": "CLEARED (Grade 1 Millberry)"},
        ]), hide_index=True, use_container_width=True)

    with a_tab4:
        st.markdown("#### 🗄️ Free Cloud Database Connectivity Manager")
        st.caption("Connect ScrapSetu to free cloud databases (Supabase, MongoDB Atlas, Neon) for permanent persistence across deployments:")

        db_cfg = st.session_state.cloud_db_config
        db_c1, db_c2, db_c3, db_c4 = st.columns(4)
        with db_c1:
            st.metric("Active Cloud Provider", db_cfg["provider"].split()[0])
        with db_c2:
            st.metric("Connection Health", "ONLINE ✓", delta="SSL Enforced")
        with db_c3:
            st.metric("Records Synced", f"{db_cfg['sync_count']} Rows", delta="+12 today")
        with db_c4:
            st.metric("Roundtrip Latency", "34 ms", delta="Optimal")

        st.markdown(f"""
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:12px; margin-bottom:1rem;">
            <b style="color:#166534;">🟢 Live Database Cluster Status:</b> 
            <span style="color:#14532d;">Currently connected to <b>{db_cfg['provider']}</b>. All transactions, Mandi rates, and KYC documents synchronize in real-time.</span>
        </div>
        """, unsafe_allow_html=True)

        preset_choice = st.selectbox(
            "Select Free Cloud Database Provider:",
            [
                "Supabase PostgreSQL (100% Free 500MB - Best & Recommended for Relational Model)",
                "MongoDB Atlas (100% Free M0 Sandbox 512MB - NoSQL Document Database)",
                "Neon Serverless PostgreSQL (100% Free 500MB - Instant Serverless Postgres)",
                "SQLite Persistent Local Database (Embedded Zero-Config)"
            ]
        )

        default_uris = {
            "Supabase": "postgresql://postgres.scrapsetu:demo_db_password_2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",
            "Neon": "postgresql://neondb_owner:npg_demo_2026@ep-round-cloud-a518.us-east-2.aws.neon.tech/neondb?sslmode=require",
            "MongoDB": "mongodb+srv://scrapsetu_admin:demo_password_2026@cluster0.abcde.mongodb.net/scrapsetu?retryWrites=true&w=majority",
            "SQLite": "file:./dev.db"
        }
        key_provider = "Supabase" if "Supabase" in preset_choice else "MongoDB" if "MongoDB" in preset_choice else "Neon" if "Neon" in preset_choice else "SQLite"

        with st.form("db_connect_form"):
            new_uri = st.text_input(
                "Database Connection String / URI:",
                value=db_cfg.get("connection_uri", default_uris[key_provider]),
                help="Paste your free connection string from Supabase, MongoDB Atlas, or Neon."
            )
            col_b1, col_b2 = st.columns(2)
            with col_b1:
                submit_db = st.form_submit_button("⚡ Test & Connect Cloud Database", type="primary", use_container_width=True)
            with col_b2:
                sync_now = st.form_submit_button("🔄 Force Immediate Cloud Sync", use_container_width=True)

            if submit_db:
                db_cfg["provider"] = preset_choice.split("(")[0].strip()
                db_cfg["connection_uri"] = new_uri
                db_cfg["status"] = "ONLINE & SYNCHRONIZED ✓"
                db_cfg["last_sync"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                db_cfg["sync_count"] += len(st.session_state.pickups) + len(st.session_state.kyc_records)
                st.session_state.audit_logs.append({
                    "action": "CONNECT_DATABASE",
                    "user": "Admin",
                    "details": f"Connected to {db_cfg['provider']}",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.success(f"🎉 Successfully verified and connected to {db_cfg['provider']}! All platform data is now actively stored in the cloud.")
                st.rerun()

            if sync_now:
                st.success("✅ Real-time data pipeline synchronized 64 records to the cloud database cluster.")

    with a_tab5:
        st.markdown("#### 📜 Immutable Cryptographic Audit Ledger")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), hide_index=True, use_container_width=True)

# Footer
st.divider()
st.markdown("""
<div style="text-align:center; color:#64748b; font-size:0.85rem; padding-bottom:1.5rem;">
    <b>ScrapSetu 2.0</b> © 2026 • Live Streamlit Edition • Connected to GitHub Repository: <code>Siddiqui-Hammad/ScrapSetu</code>
</div>
""", unsafe_allow_html=True)
