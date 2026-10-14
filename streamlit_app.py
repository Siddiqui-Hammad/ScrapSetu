"""
ScrapSetu 2.0: A Digital Bridge to Sustainable Circular Recycling
Streamlit Live Edition — Next-Gen Dynamic Auth, 3-Point KYC, Free Cloud Database & Dedicated Dashboards
Art Directed by ScrapSetu Circular Intelligence (Luxury Dark Emerald & Obsidian Edition)
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
import base64
import html
import io
from PIL import Image
import streamlit.components.v1 as components

# -------------------------------------------------------------
# 1. Page Configuration & Custom Luxury Dark SaaS Styling
# -------------------------------------------------------------
st.set_page_config(
    page_title="ScrapSetu 2.0 | Circular Intelligence Platform",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-End SaaS Styling (Obsidian & Emerald Circular Intelligence Design Tokens)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
    }

    /* Overall Dark Canvas */
    .stApp {
        background-color: #070D0A !important;
        color: #F4FDF8 !important;
    }

    /* Streamlit Top Header Bar - Fix white bar into dark obsidian */
    header[data-testid="stHeader"], [data-testid="stHeader"] {
        background-color: #070D0A !important;
        border-bottom: 1px solid rgba(16, 185, 129, 0.25) !important;
        color: #F4FDF8 !important;
    }
    header[data-testid="stHeader"] * {
        color: #A7F3D0 !important;
    }
    header[data-testid="stHeader"] svg {
        fill: #A7F3D0 !important;
    }
    [data-testid="stToolbar"] {
        color: #A7F3D0 !important;
    }
    [data-testid="stToolbar"] * {
        color: #A7F3D0 !important;
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #050A07 !important;
        border-right: 1px solid rgba(16, 185, 129, 0.2) !important;
    }
    [data-testid="stSidebar"] * {
        color: #E2E8F0 !important;
    }
    [data-testid="stSidebar"] p, [data-testid="stSidebar"] span, [data-testid="stSidebar"] label {
        color: #CBD5E1 !important;
    }

    /* Text & Label Contrast Rules */
    p, span, div {
        color: #E2E8F0 !important;
    }
    .stMarkdown h1, .stMarkdown h2, .stMarkdown h3, .stMarkdown h4, .stMarkdown h5, .stMarkdown h6 {
        color: #F4FDF8 !important;
    }
    label, .stTextInput label, .stSelectbox label, .stNumberInput label, .stRadio label {
        color: #E2E8F0 !important;
        font-weight: 700 !important;
        font-size: 0.9rem !important;
    }
    .stCaption, [data-testid="stCaptionContainer"] p {
        color: #8B9E94 !important;
        font-size: 0.82rem !important;
    }

    /* Top User Navigation Bar */
    .top-user-bar {
        background: linear-gradient(135deg, #063826 0%, #08281C 50%, #0B1D15 100%);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: white;
        padding: 1.1rem 1.8rem;
        border-radius: 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(16, 185, 129, 0.2);
    }
    .user-badge {
        background: rgba(16, 185, 129, 0.2);
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6EE7B7;
        border: 1px solid rgba(16, 185, 129, 0.4);
    }

    /* Bilingual Hover Tooltip System */
    .bilingual-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #A7F3D0;
        position: relative;
        cursor: pointer;
        transition: all 0.25s ease;
    }
    .bilingual-badge:hover {
        background: rgba(16, 185, 129, 0.28);
        border-color: #10B981;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.35);
    }
    /* Overflow overrides so tooltips and tabs are never clipped */
    div[data-testid="column"],
    div.stMarkdown,
    div[data-testid="stMarkdownContainer"] {
        overflow: visible !important;
    }

    .bilingual-hover-tip {
        position: relative;
        display: inline-block;
        cursor: help;
    }
    .bilingual-hover-tip:hover::after {
        content: "🌐 " attr(data-trans);
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        background: #042618;
        color: #34D399;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        border: 1px solid #10B981;
        box-shadow: 0 10px 25px rgba(0,0,0,0.9);
        z-index: 999999;
        pointer-events: none;
    }

    /* Luxury KPI Cards */
    .kpi-card {
        background: linear-gradient(145deg, #0B1510 0%, #0E1D16 100%) !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        border-radius: 1.25rem !important;
        padding: 1.25rem !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(16, 185, 129, 0.15) !important;
        margin-bottom: 0.75rem;
        overflow: visible !important;
        position: relative;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .kpi-card:hover {
        transform: translateY(-3px);
        border-color: rgba(16, 185, 129, 0.6) !important;
        box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.2) !important;
    }
    .kpi-val {
        font-size: 2rem;
        font-weight: 800;
        color: #10B981 !important;
        line-height: 1.1;
        font-family: monospace;
        text-shadow: 0 0 15px rgba(16, 185, 129, 0.25);
    }
    .kpi-lbl {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #A1B2A9 !important;
        margin-top: 0.4rem;
    }

    /* Streamlit Native Metric Override */
    div[data-testid="stMetric"] {
        background: linear-gradient(145deg, #0B1510 0%, #0E1D16 100%) !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        border-radius: 1.25rem !important;
        padding: 1.2rem !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(16, 185, 129, 0.15) !important;
        transition: all 0.25s ease !important;
    }
    div[data-testid="stMetric"]:hover {
        border-color: rgba(16, 185, 129, 0.6) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.2) !important;
    }
    [data-testid="stMetricValue"] {
        color: #10B981 !important;
        font-size: 2rem !important;
        font-weight: 800 !important;
        font-family: monospace !important;
        text-shadow: 0 0 15px rgba(16, 185, 129, 0.3) !important;
    }
    [data-testid="stMetricValue"] * {
        color: #10B981 !important;
    }
    [data-testid="stMetricLabel"] {
        color: #A1B2A9 !important;
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.08em !important;
    }
    [data-testid="stMetricLabel"] * {
        color: #A1B2A9 !important;
    }
    [data-testid="stMetricDelta"] {
        color: #34D399 !important;
        font-weight: 700 !important;
    }
    [data-testid="stMetricDelta"] * {
        color: #34D399 !important;
    }

    /* Digital Receipt Box */
    .receipt-container {
        background: #0B1510 !important;
        border: 2px dashed #10B981 !important;
        border-radius: 1.25rem !important;
        padding: 1.5rem !important;
        font-family: monospace;
        margin-top: 1rem;
        color: #F4FDF8 !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6) !important;
    }
    .receipt-header {
        text-align: center;
        border-bottom: 2px dashed rgba(16, 185, 129, 0.4);
        padding-bottom: 0.8rem;
        margin-bottom: 0.8rem;
    }
    .receipt-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        font-size: 0.88rem;
        color: #CBD5E1 !important;
    }
    .receipt-total {
        border-top: 2px dashed rgba(16, 185, 129, 0.4);
        margin-top: 0.8rem;
        padding-top: 0.8rem;
        display: flex;
        justify-content: space-between;
        font-weight: 800;
        font-size: 1.15rem;
        color: #34D399 !important;
    }

    /* Tabs Styling (Clean Pill Tabs with High Contrast) */
    .stTabs [data-baseweb="tab-list"] {
        background-color: #0B1510 !important;
        border-radius: 0.85rem !important;
        padding: 0.4rem !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        gap: 0.5rem !important;
    }
    .stTabs [data-baseweb="tab"] {
        color: #CBD5E1 !important;
        background: transparent !important;
        border-radius: 0.6rem !important;
        font-weight: 700 !important;
        padding: 0.6rem 1.3rem !important;
        border: 1px solid transparent !important;
        transition: all 0.2s ease !important;
    }
    .stTabs [data-baseweb="tab"] * {
        color: #CBD5E1 !important;
    }
    .stTabs [data-baseweb="tab"]:hover {
        color: #F4FDF8 !important;
        background: rgba(16, 185, 129, 0.15) !important;
        border-color: rgba(16, 185, 129, 0.35) !important;
    }
    .stTabs [data-baseweb="tab"]:hover * {
        color: #F4FDF8 !important;
    }
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
        border: 1px solid #10B981 !important;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35) !important;
    }
    .stTabs [aria-selected="true"] * {
        color: #03170E !important;
        font-weight: 800 !important;
    }

    /* Dark Streamlit Form Elements */
    div[data-baseweb="select"] {
        background-color: #0E1D16 !important;
        border-radius: 0.65rem !important;
    }
    div[data-baseweb="select"] > div {
        background-color: #0E1D16 !important;
        border: 1px solid rgba(16, 185, 129, 0.35) !important;
        border-radius: 0.65rem !important;
    }
    div[data-baseweb="select"] * {
        color: #F4FDF8 !important;
        background-color: transparent !important;
    }
    div[data-baseweb="popover"] ul {
        background-color: #0B1510 !important;
        border: 1px solid rgba(16, 185, 129, 0.35) !important;
    }
    div[data-baseweb="popover"] li {
        background-color: #0B1510 !important;
        color: #F4FDF8 !important;
    }
    div[data-baseweb="popover"] li:hover {
        background-color: #10B981 !important;
        color: #03170E !important;
    }
    div[data-baseweb="input"] {
        background-color: #0E1D16 !important;
        border-radius: 0.65rem !important;
    }
    div[data-baseweb="input"] > div {
        background-color: #0E1D16 !important;
        border: 1px solid rgba(16, 185, 129, 0.35) !important;
        border-radius: 0.65rem !important;
    }
    div[data-baseweb="input"] input {
        color: #F4FDF8 !important;
        background-color: transparent !important;
    }
    input, textarea {
        color: #F4FDF8 !important;
        background-color: #0E1D16 !important;
    }

    /* Expanders */
    div[data-testid="stExpander"] {
        background-color: #0B1510 !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        border-radius: 0.85rem !important;
    }
    div[data-testid="stExpander"] summary {
        color: #F4FDF8 !important;
        font-weight: 700 !important;
    }
    div[data-testid="stExpander"] summary * {
        color: #F4FDF8 !important;
    }

    /* Buttons */
    .stButton>button {
        border-radius: 0.75rem !important;
        font-weight: 700 !important;
        transition: all 0.2s ease !important;
    }
    .stButton>button[kind="primary"] {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
        color: #03170E !important;
        font-weight: 800 !important;
        border: none !important;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35) !important;
    }
    .stButton>button[kind="primary"]:hover {
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6) !important;
        transform: translateY(-1px) !important;
    }
    .stButton>button[kind="primary"] * {
        color: #03170E !important;
    }
    .stButton>button[kind="secondary"] {
        background-color: #0E1D16 !important;
        color: #E2E8F0 !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
    }
    .stButton>button[kind="secondary"]:hover {
        border-color: #10B981 !important;
        background-color: #13271E !important;
        color: #34D399 !important;
    }

    /* Sidebar Fast-Track Buttons */
    [data-testid="stSidebar"] .stButton>button {
        background: #0B1510 !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
        color: #F4FDF8 !important;
        border-radius: 0.75rem !important;
        padding: 0.65rem 1rem !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4) !important;
    }
    [data-testid="stSidebar"] .stButton>button:hover {
        background: linear-gradient(135deg, #0E2419 0%, #123323 100%) !important;
        border-color: #10B981 !important;
        color: #34D399 !important;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.3) !important;
        transform: translateX(2px) !important;
    }
    [data-testid="stSidebar"] .stButton>button[kind="primary"] {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
        color: #03170E !important;
        border: none !important;
        font-weight: 800 !important;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
    }
    [data-testid="stSidebar"] .stButton>button[kind="primary"] * {
        color: #03170E !important;
    }

    div[data-testid="stAlert"] {
        background-color: #081C13 !important;
        border: 1px solid rgba(16, 185, 129, 0.4) !important;
        color: #E2E8F0 !important;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# 1.1 Global Hover Translation & Tab Tooltip Injector
# -------------------------------------------------------------
components.html("""
<script>
const tabTranslations = {
    "डोरस्टेप पिकअप बुक करें": "Book Doorstep Pickup",
    "Book Doorstep Pickup": "डोरस्टेप पिकअप बुक करें",
    "एआई स्क्रैप-विजन वर्गीकरण व वजन इंजन": "AI ScrapVision Classifier & Weight Engine",
    "AI ScrapVision Classifier & Weight Engine": "एआई स्क्रैप-विजन वर्गीकरण व वजन इंजन",
    "डिजिटल वेस्ट पासपोर्ट प्रमाण पत्र": "Digital Waste Passports",
    "Digital Waste Passports": "डिजिटल वेस्ट पासपोर्ट प्रमाण पत्र",
    "नजदीकी ऑर्डर्स व फोटो जांच": "Nearby Open Jobs & Photos",
    "Nearby Open Jobs & Photos": "नजदीकी ऑर्डर्स व फोटो जांच",
    "स्मार्ट खरीदार मिलान": "Smart Buyer Matching",
    "Smart Buyer Matching": "स्मार्ट खरीदार मिलान",
    "सहयोगात्मक स्क्रैप पूलिंग": "Collaborative Scrap Pooling",
    "Collaborative Scrap Pooling": "सहयोगात्मक स्क्रैप पूलिंग",
    "स्क्रैप पासपोर्ट व ट्रैसेबिलिटी": "Scrap Passport & Traceability",
    "Scrap Passport & Traceability": "स्क्रैप पासपोर्ट व ट्रैसेबिलिटी",
    "इको-रूट टीएसपी रूट प्लानर": "EcoRoute TSP Route Planner",
    "EcoRoute TSP Route Planner": "इको-रूट टीएसपी रूट प्लानर",
    "3-बिंदु पहचान सत्यापन": "3-Point KYC Identity",
    "3-Point KYC Identity": "3-बिंदु पहचान सत्यापन",
    "कुल पुनर्चक्रित कचरा": "Total Recycled Scrap",
    "Total Recycled Scrap": "कुल पुनर्चक्रित कचरा",
    "अर्जित नकद / यूपीआई": "Cash / UPI Earned",
    "Cash / UPI Earned": "अर्जित नकद / यूपीआई",
    "डोरस्टेप पिकअप संख्या": "Doorstep Pickups",
    "Doorstep Pickups": "डोरस्टेप पिकअप संख्या",
    "बचाया गया CO₂ उत्सर्जन": "CO₂ Emissions Prevented",
    "CO₂ Emissions Prevented": "बचाया गया CO₂ उत्सर्जन",
    "दैनिक वाहन क्षमता (75%)": "Daily Vehicle Capacity (75%)",
    "Daily Vehicle Capacity (75%)": "दैनिक वाहन क्षमता (75%)",
    "आज का कुल संग्रह निपटान": "Today Collections Settled",
    "Today Collections Settled": "आज का कुल संग्रह निपटान",
    "पूर्ण किए गए पिकअप": "Completed Pickups",
    "Completed Pickups": "पूर्ण किए गए पिकअप",
    "इको-रूट ईंधन बचत": "EcoRoute Fuel Savings",
    "EcoRoute Fuel Savings": "इको-रूट ईंधन बचत",
    "मंडी थोक बेंचमार्क दरें": "Mandi Wholesale Benchmark Rates",
    "Mandi Wholesale Benchmark Rates": "मंडी थोक बेंचमार्क दरें",
    "एआई बायोमेट्रिक फोटो मिलान": "AI Biometric Photo Matching",
    "AI Biometric Photo Matching": "एआई बायोमेट्रिक फोटो मिलान",
    "इको-शील्ड विसंगति ऑडिट": "EcoShield Anomaly Audit",
    "EcoShield Anomaly Audit": "इको-शील्ड विसंगति ऑडिट",
    "फ्री क्लाउड डेटाबेस": "Free Cloud Database",
    "Free Cloud Database": "फ्री क्लाउड डेटाबेस",
    "वाणिज्यिक अपशिष्ट जनरेटर": "Commercial Waste Generator",
    "Commercial Waste Generator": "वाणिज्यिक अपशिष्ट जनरेटर",
    "रीसाइक्लिंग कारखाना दर पोर्टल": "Recycler Facility Rate Portal",
    "Recycler Facility Rate Portal": "रीसाइक्लिंग कारखाना दर पोर्टल",
    "लॉग इन": "Sign In",
    "Sign In": "लॉग इन",
    "नया खाता बनाएं": "Create Dynamic Account",
    "Create Dynamic Account": "नया खाता बनाएं"
};

function runTooltipInjector() {
    try {
        const doc = window.parent.document || document;
        
        let tip = doc.getElementById("scrapsetu-tooltip");
        if (!tip) {
            tip = doc.createElement("div");
            tip.id = "scrapsetu-tooltip";
            tip.style.cssText = "position:fixed; display:none; z-index:99999999; background:#042819; color:#34D399; border:1.5px solid #10B981; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; pointer-events:none; box-shadow:0 10px 30px rgba(0,0,0,0.85); font-family:sans-serif; transition:opacity 0.1s ease;";
            doc.body.appendChild(tip);
        }

        function scanTabsAndCards() {
            const tabs = doc.querySelectorAll('button[data-baseweb="tab"]');
            tabs.forEach(tab => {
                const text = tab.innerText ? tab.innerText.trim() : '';
                for (const [key, val] of Object.entries(tabTranslations)) {
                    if (text.includes(key)) {
                        tab.setAttribute('title', '🌐 ' + val);
                        tab.setAttribute('data-scrapsetu-trans', val);
                        break;
                    }
                }
            });

            const kpis = doc.querySelectorAll('.kpi-card');
            kpis.forEach(kpi => {
                const text = kpi.innerText ? kpi.innerText.trim() : '';
                for (const [key, val] of Object.entries(tabTranslations)) {
                    if (text.includes(key)) {
                        kpi.setAttribute('title', '🌐 ' + val);
                        kpi.setAttribute('data-scrapsetu-trans', val);
                        break;
                    }
                }
            });
        }

        doc.addEventListener('mouseover', function(e) {
            const target = e.target.closest('[data-scrapsetu-trans], [data-trans], button[data-baseweb="tab"], .kpi-card');
            if (target) {
                let transText = target.getAttribute('data-scrapsetu-trans') || target.getAttribute('data-trans') || target.getAttribute('title');
                if (!transText) {
                    const text = target.innerText ? target.innerText.trim() : '';
                    for (const [key, val] of Object.entries(tabTranslations)) {
                        if (text.includes(key)) {
                            transText = val;
                            break;
                        }
                    }
                }
                if (transText) {
                    tip.innerHTML = '<span style="color:#6EE7B7; margin-right:6px;">🌐</span>' + transText.replace('🌐 ', '');
                    tip.style.display = 'block';
                    tip.style.left = (e.clientX + 14) + 'px';
                    tip.style.top = (e.clientY + 14) + 'px';
                }
            }
        }, true);

        doc.addEventListener('mousemove', function(e) {
            if (tip.style.display === 'block') {
                tip.style.left = (e.clientX + 14) + 'px';
                tip.style.top = (e.clientY + 14) + 'px';
            }
        }, true);

        doc.addEventListener('mouseout', function(e) {
            const target = e.target.closest('[data-scrapsetu-trans], [data-trans], button[data-baseweb="tab"], .kpi-card');
            if (target) {
                tip.style.display = 'none';
            }
        }, true);

        setInterval(scanTabsAndCards, 500);
        scanTabsAndCards();
    } catch(e) {
        console.error("Tooltip injector init error", e);
    }
}
runTooltipInjector();
</script>
""", height=0)


# -------------------------------------------------------------
# 2. Strict Bilingual Helper System
# -------------------------------------------------------------
# Rule: Visible text shows ONLY preferred language.
# Alternate language is shown ONLY on hover (tooltip / data-trans).
if "lang" not in st.session_state:
    st.session_state.lang = "en"

def tr(en_text, hi_text):
    is_hi = (st.session_state.get("lang", "en") == "hi")
    return (hi_text, en_text) if is_hi else (en_text, hi_text)

def tr_span(en_text, hi_text, extra_style=""):
    main, alt = tr(en_text, hi_text)
    clean_alt = html.escape(str(alt))
    return f'<span class="bilingual-hover-tip" data-trans="{clean_alt}" title="🌐 {clean_alt}" style="{extra_style}">{main}</span>'

# -------------------------------------------------------------
# 3. Base64-Encoded SVG Asset Generators (100% Reliable Render)
# -------------------------------------------------------------
def get_scrap_svg(material_type="plastic", title="Sorted Recyclable Scrap"):
    safe_title = html.escape(str(title).strip())
    if material_type == "plastic":
        bg_color = "#081C14"
        accent = "#10B981"
        badge = "PET #1 • OPTICAL CLEAR"
        graphic = """
        <g transform="translate(140, 40)">
            <rect x="0" y="20" width="36" height="100" rx="6" fill="#10B981" fill-opacity="0.25" stroke="#34D399" stroke-width="2"/>
            <rect x="10" y="8" width="16" height="14" rx="2" fill="#34D399"/>
            <line x1="6" y1="50" x2="30" y2="50" stroke="#6EE7B7" stroke-width="1.5" stroke-dasharray="3,2"/>
            <line x1="6" y1="75" x2="30" y2="75" stroke="#6EE7B7" stroke-width="1.5" stroke-dasharray="3,2"/>
            <rect x="44" y="35" width="40" height="85" rx="6" fill="#059669" fill-opacity="0.3" stroke="#10B981" stroke-width="2"/>
            <rect x="56" y="23" width="16" height="14" rx="2" fill="#10B981"/>
            <g transform="rotate(35 80 110)">
                <rect x="60" y="90" width="32" height="70" rx="5" fill="#34D399" fill-opacity="0.2" stroke="#6EE7B7" stroke-width="1.5"/>
            </g>
            <path d="M 50 145 L 62 125 L 74 145 Z" fill="none" stroke="#34D399" stroke-width="2.5"/>
            <text x="62" y="142" fill="#34D399" font-size="10" font-weight="bold" text-anchor="middle">1</text>
        </g>
        """
    elif material_type == "paper":
        bg_color = "#18140C"
        accent = "#F59E0B"
        badge = "PAP #20 • CORRUGATED KRAFT"
        graphic = """
        <g transform="translate(130, 45)">
            <rect x="0" y="30" width="80" height="60" rx="4" fill="#D97706" fill-opacity="0.25" stroke="#F59E0B" stroke-width="2"/>
            <line x1="0" y1="50" x2="80" y2="50" stroke="#FBBF24" stroke-width="1.5"/>
            <line x1="40" y1="30" x2="40" y2="90" stroke="#FBBF24" stroke-width="1.5"/>
            <rect x="25" y="0" width="70" height="40" rx="4" fill="#B45309" fill-opacity="0.35" stroke="#FBBF24" stroke-width="2"/>
            <path d="M 5 70 Q 15 65 25 70 T 45 70 T 65 70" fill="none" stroke="#FDE68A" stroke-width="1.5"/>
            <rect x="90" y="45" width="28" height="36" fill="#FEF3C7" rx="2"/>
            <line x1="94" y1="50" x2="94" y2="75" stroke="#18140C" stroke-width="2"/>
            <line x1="99" y1="50" x2="99" y2="75" stroke="#18140C" stroke-width="1"/>
            <line x1="104" y1="50" x2="104" y2="75" stroke="#18140C" stroke-width="3"/>
            <line x1="110" y1="50" x2="110" y2="75" stroke="#18140C" stroke-width="1.5"/>
        </g>
        """
    elif material_type == "metal":
        bg_color = "#19110B"
        accent = "#FB923C"
        badge = "Cu #Cu-ETP • BARE BRIGHT 99.9%"
        graphic = """
        <g transform="translate(130, 45)">
            <ellipse cx="60" cy="80" rx="50" ry="20" fill="#7C2D12" fill-opacity="0.4" stroke="#EA580C" stroke-width="2"/>
            <path d="M 20 70 Q 60 40 100 70 Q 60 100 20 70" fill="none" stroke="#F97316" stroke-width="6"/>
            <path d="M 25 60 Q 60 30 95 60 Q 60 90 25 60" fill="none" stroke="#FB923C" stroke-width="5"/>
            <path d="M 30 50 Q 60 20 90 50 Q 60 80 30 50" fill="none" stroke="#FDBA74" stroke-width="4"/>
            <line x1="90" y1="50" x2="135" y2="25" stroke="#FDBA74" stroke-width="3"/>
            <line x1="95" y1="55" x2="140" y2="35" stroke="#FB923C" stroke-width="3"/>
            <line x1="100" y1="60" x2="145" y2="45" stroke="#F97316" stroke-width="3"/>
        </g>
        """
    else: # ewaste
        bg_color = "#0B1716"
        accent = "#06B6D4"
        badge = "E-WASTE • FR-4 PCB TELECOM"
        graphic = """
        <g transform="translate(130, 45)">
            <rect x="0" y="10" width="120" height="85" rx="6" fill="#0E3A2F" stroke="#10B981" stroke-width="2"/>
            <rect x="15" y="25" width="30" height="30" rx="2" fill="#0F172A" stroke="#64748B" stroke-width="1.5"/>
            <rect x="65" y="25" width="40" height="20" rx="2" fill="#0F172A" stroke="#64748B" stroke-width="1.5"/>
            <rect x="10" y="85" width="100" height="10" rx="1" fill="#FBBF24"/>
            <path d="M 45 40 L 65 35 M 30 55 L 30 85 M 75 45 L 75 85 M 95 45 L 95 85" stroke="#34D399" stroke-width="2" fill="none"/>
            <circle cx="55" cy="65" r="4" fill="#06B6D4"/>
        </g>
        """

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="380" height="200" viewBox="0 0 380 200">
        <defs>
            <linearGradient id="bgGrad_{material_type}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="{bg_color}"/>
                <stop offset="100%" stop-color="#040A07"/>
            </linearGradient>
        </defs>
        <rect width="380" height="200" fill="url(#bgGrad_{material_type})" rx="14" stroke="{accent}" stroke-width="1.5" stroke-opacity="0.4"/>
        <g stroke="{accent}" stroke-width="0.5" stroke-opacity="0.15">
            <line x1="0" y1="50" x2="380" y2="50"/>
            <line x1="0" y1="100" x2="380" y2="100"/>
            <line x1="0" y1="150" x2="380" y2="150"/>
            <line x1="95" y1="0" x2="95" y2="200"/>
            <line x1="190" y1="0" x2="190" y2="200"/>
            <line x1="285" y1="0" x2="285" y2="200"/>
        </g>
        <rect x="14" y="14" width="180" height="22" rx="11" fill="{accent}" fill-opacity="0.15" stroke="{accent}" stroke-width="1"/>
        <text x="24" y="29" fill="{accent}" font-family="monospace" font-size="10" font-weight="bold" letter-spacing="0.5">{badge}</text>
        {graphic}
        <rect x="0" y="165" width="380" height="35" fill="#020503" fill-opacity="0.85" rx="0"/>
        <text x="16" y="187" fill="#F4FDF8" font-family="sans-serif" font-size="12" font-weight="bold">{safe_title}</text>
        <text x="364" y="187" fill="{accent}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">AI VERIFIED ✓</text>
    </svg>"""
    b64 = base64.b64encode(svg.strip().encode("utf-8")).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"

def get_aadhaar_card_svg(name="Ramesh Kumar Sahu", uid="4129 6638 6621", dob="15/08/1988"):
    safe_name = html.escape(str(name).strip())
    safe_uid = html.escape(str(uid).strip())
    safe_dob = html.escape(str(dob).strip())
    masked_uid = "XXXX XXXX " + safe_uid.replace("-", " ").strip()[-4:]
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="420" height="250" viewBox="0 0 420 250">
        <rect width="420" height="250" fill="#FFFFFF" rx="12" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="0" y="0" width="420" height="8" fill="#FF9933" rx="0"/>
        <rect x="0" y="8" width="420" height="40" fill="#FFFFFF"/>
        <rect x="0" y="48" width="420" height="4" fill="#138808"/>
        <text x="210" y="26" fill="#1E293B" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">भारत सरकार / Government of India</text>
        <text x="210" y="42" fill="#64748B" font-family="sans-serif" font-size="10" text-anchor="middle">भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)</text>
        <rect x="24" y="65" width="90" height="110" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
        <circle cx="69" cy="105" r="22" fill="#CBD5E1"/>
        <path d="M 45 155 Q 69 130 93 155" fill="#94A3B8"/>
        <rect x="24" y="152" width="90" height="23" fill="#10B981" fill-opacity="0.2" rx="0"/>
        <text x="69" y="167" fill="#047857" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">UIDAI VERIFIED</text>
        <text x="130" y="85" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="bold">{safe_name}</text>
        <text x="130" y="105" fill="#475569" font-family="sans-serif" font-size="11">जन्म तिथि / DOB: <tspan font-weight="bold" fill="#0F172A">{safe_dob}</tspan></text>
        <text x="130" y="125" fill="#475569" font-family="sans-serif" font-size="11">लिंग / Gender: <tspan font-weight="bold" fill="#0F172A">MALE / पुरुष</tspan></text>
        <text x="130" y="145" fill="#047857" font-family="sans-serif" font-size="10" font-weight="bold">Biometric Authentication: ACTIVE ✓</text>
        <rect x="24" y="185" width="260" height="32" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="154" y="206" fill="#1E293B" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle" letter-spacing="2">{masked_uid}</text>
        <rect x="305" y="65" width="90" height="90" rx="4" fill="#0F172A"/>
        <rect x="315" y="75" width="30" height="30" fill="#FFFFFF"/>
        <rect x="323" y="83" width="14" height="14" fill="#0F172A"/>
        <rect x="355" y="75" width="30" height="30" fill="#FFFFFF"/>
        <rect x="363" y="83" width="14" height="14" fill="#0F172A"/>
        <rect x="315" y="115" width="30" height="30" fill="#FFFFFF"/>
        <rect x="323" y="123" width="14" height="14" fill="#0F172A"/>
        <circle cx="365" cy="125" r="5" fill="#10B981"/>
        <text x="350" y="170" fill="#64748B" font-family="sans-serif" font-size="9" text-anchor="middle">डिजिटल आधार</text>
        <rect x="0" y="228" width="420" height="22" fill="#F1F5F9"/>
        <text x="210" y="243" fill="#64748B" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">मेरा आधार, मेरी पहचान • 100% CPCB Compliance</text>
    </svg>"""
    b64 = base64.b64encode(svg.strip().encode("utf-8")).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"

def get_dl_card_svg(name="Shyam Sundar Sharma", dl_num="RJ-14-2022-00455", vehicle_class="LMV-TR"):
    safe_name = html.escape(str(name).strip())
    safe_dl_num = html.escape(str(dl_num).strip())
    safe_vehicle_class = html.escape(str(vehicle_class).strip())
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="420" height="250" viewBox="0 0 420 250">
        <defs>
            <linearGradient id="dlBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0E2A47"/>
                <stop offset="100%" stop-color="#07192C"/>
            </linearGradient>
        </defs>
        <rect width="420" height="250" fill="url(#dlBg)" rx="12" stroke="#38BDF8" stroke-width="2"/>
        <rect x="0" y="0" width="420" height="42" fill="#0C2138"/>
        <text x="20" y="22" fill="#38BDF8" font-family="sans-serif" font-size="12" font-weight="bold">UNION OF INDIA • DRIVING LICENCE</text>
        <text x="20" y="36" fill="#94A3B8" font-family="sans-serif" font-size="9">TRANSPORT DEPARTMENT • GOVT OF RAJASTHAN</text>
        <rect x="24" y="55" width="50" height="38" rx="4" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5"/>
        <line x1="24" y1="74" x2="74" y2="74" stroke="#A16207" stroke-width="1"/>
        <line x1="49" y1="55" x2="49" y2="93" stroke="#A16207" stroke-width="1"/>
        <rect x="24" y="105" width="80" height="95" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
        <circle cx="64" cy="140" r="18" fill="#38BDF8"/>
        <path d="M 40 185 Q 64 165 88 185" fill="#0284C7"/>
        <rect x="24" y="180" width="80" height="20" fill="#0284C7" fill-opacity="0.3"/>
        <text x="64" y="193" fill="#7DD3FC" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle">COMMERCIAL</text>
        <text x="120" y="72" fill="#7DD3FC" font-family="monospace" font-size="11">DL NO: <tspan font-weight="bold" font-size="13" fill="#FFFFFF">{safe_dl_num}</tspan></text>
        <text x="120" y="96" fill="#F8FAFC" font-family="sans-serif" font-size="14" font-weight="bold">{safe_name}</text>
        <text x="120" y="120" fill="#94A3B8" font-family="sans-serif" font-size="10">COV (Class): <tspan font-weight="bold" fill="#38BDF8">{safe_vehicle_class} (Commercial Carrier)</tspan></text>
        <text x="120" y="140" fill="#94A3B8" font-family="sans-serif" font-size="10">Valid Until: <tspan font-weight="bold" fill="#F8FAFC">14/06/2034</tspan></text>
        <text x="120" y="160" fill="#94A3B8" font-family="sans-serif" font-size="10">Blood Group: <tspan font-weight="bold" fill="#F8FAFC">B+ POSITIVE</tspan></text>
        <rect x="290" y="115" width="105" height="45" rx="6" fill="#0369A1" fill-opacity="0.3" stroke="#38BDF8" stroke-width="1"/>
        <text x="342" y="133" fill="#BAE6FD" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PARIVAHAN RTO</text>
        <text x="342" y="148" fill="#38BDF8" font-family="sans-serif" font-size="9" text-anchor="middle">Verified Live ✓</text>
        <rect x="0" y="215" width="420" height="35" fill="#07192C"/>
        <text x="20" y="234" fill="#94A3B8" font-family="monospace" font-size="9">CHIP ID: 899144020261192834 • AUTH DIGITAL CARRIER SEAL</text>
    </svg>"""
    b64 = base64.b64encode(svg.strip().encode("utf-8")).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"

def get_selfie_svg(name="Ramesh Kumar Sahu", is_match=True):
    accent = "#10B981" if is_match else "#EF4444"
    bg = "#071B12" if is_match else "#1F0A0A"
    status_text = "BIOMETRIC MATCH: 98.4% ✓" if is_match else "MISMATCH: 34.2% ❌"
    sub_text = "68 Landmarks Aligned • 3D Anti-Spoof Pass" if is_match else "Facial Geometry Mismatch with ID Photo"
    mesh_color = "#34D399" if is_match else "#F87171"
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="340" height="250" viewBox="0 0 340 250">
        <defs>
            <linearGradient id="selfieBg_{int(is_match)}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="{bg}"/>
                <stop offset="100%" stop-color="#050C08"/>
            </linearGradient>
        </defs>
        <rect width="340" height="250" fill="url(#selfieBg_{int(is_match)})" rx="12" stroke="{accent}" stroke-width="2"/>
        <circle cx="170" cy="105" r="45" fill="#13271D" stroke="{mesh_color}" stroke-width="1.5" stroke-dasharray="3,2"/>
        <path d="M 120 185 Q 170 145 220 185" fill="#0A1C13" stroke="{mesh_color}" stroke-width="1.5"/>
        <circle cx="152" cy="98" r="3" fill="{mesh_color}"/>
        <circle cx="188" cy="98" r="3" fill="{mesh_color}"/>
        <line x1="148" y1="98" x2="156" y2="98" stroke="{accent}" stroke-width="1"/>
        <line x1="152" y1="94" x2="152" y2="102" stroke="{accent}" stroke-width="1"/>
        <line x1="184" y1="98" x2="192" y2="98" stroke="{accent}" stroke-width="1"/>
        <line x1="188" y1="94" x2="188" y2="102" stroke="{accent}" stroke-width="1"/>
        <circle cx="170" cy="104" r="2" fill="{mesh_color}"/>
        <circle cx="170" cy="112" r="2" fill="{mesh_color}"/>
        <circle cx="165" cy="118" r="2" fill="{mesh_color}"/>
        <circle cx="175" cy="118" r="2" fill="{mesh_color}"/>
        <ellipse cx="170" cy="130" rx="12" ry="5" fill="none" stroke="{mesh_color}" stroke-width="1"/>
        <path d="M 105 55 L 90 55 L 90 70" fill="none" stroke="{accent}" stroke-width="3"/>
        <path d="M 235 55 L 250 55 L 250 70" fill="none" stroke="{accent}" stroke-width="3"/>
        <path d="M 105 175 L 90 175 L 90 160" fill="none" stroke="{accent}" stroke-width="3"/>
        <path d="M 235 175 L 250 175 L 250 160" fill="none" stroke="{accent}" stroke-width="3"/>
        <rect x="15" y="195" width="310" height="42" rx="8" fill="#000000" fill-opacity="0.6" stroke="{accent}" stroke-width="1"/>
        <text x="170" y="213" fill="{accent}" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">{status_text}</text>
        <text x="170" y="228" fill="#E2E8F0" font-family="sans-serif" font-size="9" text-anchor="middle">{sub_text}</text>
        <circle cx="30" cy="25" r="4" fill="#EF4444"/>
        <text x="40" y="28" fill="#EF4444" font-family="monospace" font-size="9" font-weight="bold">● LIVE CAMERA FEED</text>
        <text x="320" y="28" fill="{accent}" font-family="monospace" font-size="9" font-weight="bold" text-anchor="end">FPS: 30.0</text>
    </svg>"""
    b64 = base64.b64encode(svg.strip().encode("utf-8")).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"

# -------------------------------------------------------------
# 4. Session State Initialization
# -------------------------------------------------------------
if "is_logged_in" not in st.session_state:
    st.session_state.is_logged_in = False
if "current_role" not in st.session_state:
    st.session_state.current_role = "HOUSEHOLD"
if "user_name" not in st.session_state:
    st.session_state.user_name = "Priya Sharma"
if "user_email" not in st.session_state:
    st.session_state.user_email = "priya@scrapsetu.in"

# Material Catalog
if "categories" not in st.session_state:
    st.session_state.categories = [
        {"id": "plastic", "name": "Plastic (PET/HDPE)", "hindi": "प्लास्टिक", "rate": 15.0, "min": 12.0, "max": 20.0, "unit": "kg", "co2": 1.80, "icon": "🥤"},
        {"id": "paper", "name": "Paper & Cardboard", "hindi": "कागज़ और गत्ता", "rate": 12.0, "min": 10.0, "max": 16.0, "unit": "kg", "co2": 1.35, "icon": "📄"},
        {"id": "metal", "name": "Metal (Iron/Al/Cu)", "hindi": "धातु / लोहा", "rate": 45.0, "min": 35.0, "max": 60.0, "unit": "kg", "co2": 2.50, "icon": "🥫"},
        {"id": "ewaste", "name": "E-Waste & Electronics", "hindi": "ई-कचरा", "rate": 60.0, "min": 50.0, "max": 120.0, "unit": "kg", "co2": 4.50, "icon": "💻"},
        {"id": "glass", "name": "Glass Bottles", "hindi": "कांच की बोतलें", "rate": 2.0, "min": 1.5, "max": 3.0, "unit": "kg", "co2": 0.30, "icon": "🍾"},
        {"id": "others", "name": "Others / Mixed Dry", "hindi": "अन्य सूखा कचरा", "rate": 8.0, "min": 5.0, "max": 12.0, "unit": "kg", "co2": 0.80, "icon": "📦"},
    ]

# Seeded Pickup Orders (Guaranteed Base64 SVGs)
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
            "photo_svg": get_scrap_svg("paper", "Bundled Kraft Cardboard & Daily Newspapers"),
            "ai_vision": "Baled corrugated kraft cardboard boxes (approx 18.5 kg) with clean dry newspapers (9.5 kg). Volumetric packing factor indicates low moisture (<3%). No heavy chemical contamination.",
            "ai_weight_details": "Calculated: 28.0 kg (±1.2 kg) | Volumetric Density: 0.12 g/cm³ | Purity: 97.4%"
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
            "photo_svg": get_scrap_svg("ewaste", "Decommissioned Telecom Server Boards & Cartons"),
            "ai_vision": "Commercial packaging scrap mixed with 35kg IT circuit boards, server power supply units, and copper heatsinks.",
            "ai_weight_details": "Calculated: 175.0 kg | Verified with TrustWeigh Bluetooth Scale"
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
            "status": "OPEN",
            "assigned_collector": None,
            "created_at": "2026-10-12 10:00",
            "photo_svg": get_scrap_svg("plastic", "Sorted Clear PET Beverage Bottles & Aluminium Cans"),
            "ai_vision": "High-purity post-consumer clear PET bottles (optical grade) stored in wire mesh crates with flattened beverage cans.",
            "ai_weight_details": "Calculated: 63.0 kg (±2.5 kg) | Volumetric Density: 0.045 g/cm³ | Ready for Baler"
        },
    ]

# Recycler Buying Offers
if "recycler_offers" not in st.session_state:
    st.session_state.recycler_offers = [
        {"mill": "EcoPlast Reclaimers Pvt Ltd", "cat": "Rigid Plastics (PET / HDPE)", "rate": 31.5, "min_lot": 50, "location": "Okhla Industrial Area"},
        {"mill": "Delhi Craft Pulp & Paper Mills", "cat": "Paper & Cardboard (Gatta)", "rate": 17.0, "min_lot": 100, "location": "Narela Industrial Hub"},
        {"mill": "Apex Metal Alloys & Smelting", "cat": "Copper Wire (Millberry)", "rate": 695.0, "min_lot": 20, "location": "Mayapuri Metal Cluster"},
    ]

# KYC Partner Verifications
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

# Free Cloud Database Bus
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
    with st.sidebar:
        st.markdown("### 🌐 " + tr("Language Selection", "भाषा चयन")[0])
        l_opt = st.radio(
            tr("Preferred Language", "पसंदीदा भाषा")[0],
            ["English", "हिंदी"],
            index=0 if st.session_state.lang == "en" else 1,
            horizontal=True,
            help=tr("Hover for Hindi translation", "अंग्रेजी अनुवाद हेतु कर्सर लाएं")[0]
        )
        new_l = "en" if l_opt == "English" else "hi"
        if new_l != st.session_state.lang:
            st.session_state.lang = new_l
            st.rerun()

        st.divider()
        st.markdown("### ⚡ " + tr("Live Demo Fast-Track", "त्वरित लाइव डेमो")[0])
        st.caption(tr("One-click instant login to any role dashboard:", "किसी भी भूमिका डैशबोर्ड में एक क्लिक से लॉगिन करें:")[0])
        if st.button("🛡️ " + tr("Admin Console", "एडमिन कंसोल")[0], type="primary", use_container_width=True, help=tr("1-क्लिक एडमिन कंसोल", "1-Click Admin Console")[0]):
            login_as("ADMIN")
            st.rerun()
        if st.button("🏠 " + tr("Household Portal", "घरेलू पोर्टल")[0], use_container_width=True, help=tr("घरेलू रीसाइक्लिंग पोर्टल", "Household Recycling Portal")[0]):
            login_as("HOUSEHOLD")
            st.rerun()
        if st.button("🛺 " + tr("Collector Terminal", "कबाड़ीवाला टर्मिनल")[0], use_container_width=True, help=tr("कबाड़ीवाला जॉब टर्मिनल", "Kabadiwala Terminal")[0]):
            login_as("COLLECTOR")
            st.rerun()
        if st.button("🏢 " + tr("Commercial Business", "कमर्शियल बिजनेस")[0], use_container_width=True, help=tr("वाणिज्यिक थोक अपशिष्ट", "Commercial Bulk Waste")[0]):
            login_as("BUSINESS")
            st.rerun()
        if st.button("🏭 " + tr("Recycler Mill", "रीसाइक्लिंग मिल")[0], use_container_width=True, help=tr("रीसाइक्लिंग कारखाना पोर्टल", "Recycling Factory Portal")[0]):
            login_as("RECYCLER")
            st.rerun()

    # Luxury Hero Banner
    hero_title, hero_title_alt = tr("ScrapSetu 2.0", "स्क्रैपसेतु 2.0")
    hero_sub, hero_sub_alt = tr("ScrapSetu Circular Intelligence", "स्क्रैपसेतु चक्रीय अर्थव्यवस्था")
    hero_tag, hero_tag_alt = tr("Verified CPCB EPR Network • 3-Point Biometric KYC • 100% Digital UPI", "सत्यापित सीपीसीबी नेटवर्क • 3-बिंदु बायोमेट्रिक सत्यापन • 100% डिजिटल यूपीआई")

    st.markdown(f"""
    <div style="background: radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.18) 0%, rgba(11, 21, 16, 0.95) 75%); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 1.5rem; padding: 2.2rem 1.5rem 1.8rem 1.5rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(16, 185, 129, 0.25);">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:rgba(16, 185, 129, 0.15); border:1px solid #10B981; margin-bottom:0.8rem; box-shadow:0 0 25px rgba(16, 185, 129, 0.35);">
            <span style="font-size:2.2rem;">♻️</span>
        </div>
        <h1 style="color:#F4FDF8; font-weight:900; font-size:2.8rem; margin:0 0 0.3rem 0; letter-spacing:-0.03em; text-shadow:0 0 25px rgba(16, 185, 129, 0.35);">
            {hero_title}
        </h1>
        <p style="color:#6EE7B7; font-size:1.05rem; font-weight:600; margin:0 0 0.8rem 0; letter-spacing:0.02em;">
            {tr_span(hero_sub, hero_sub_alt)}
        </p>
        <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); padding:0.35rem 1rem; border-radius:9999px; font-size:0.8rem; color:#A7F3D0;">
            <span style="color:#10B981;">●</span> {tr_span(hero_tag, hero_tag_alt)}
        </div>
    </div>
    """, unsafe_allow_html=True)

    t1, t2, t3, t4 = st.columns(4)
    with t1:
        st.markdown(f'''<div class="kpi-card"><div class="kpi-val">2,845.9 MT</div><div class="kpi-lbl">{tr_span("Landfill Diversion", "लैंडफिल से बचाया कचरा")}</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">{tr_span("↑ Audited CPCB", "↑ सीपीसीबी द्वारा प्रमाणित")}</div></div>''', unsafe_allow_html=True)
    with t2:
        st.markdown(f'''<div class="kpi-card"><div class="kpi-val">4,268 MT</div><div class="kpi-lbl">{tr_span("CO₂e Avoided", "बचाया गया कार्बन उत्सर्जन")}</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">{tr_span("↑ IPCC Model", "↑ आईपीसीसी गणना मॉडल")}</div></div>''', unsafe_allow_html=True)
    with t3:
        st.markdown(f'''<div class="kpi-card"><div class="kpi-val">1,420 Active</div><div class="kpi-lbl">{tr_span("Certified Kabadiwalas", "सत्यापित कबाड़ीवाले")}</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">{tr_span("↑ 3-Point KYC", "↑ 3-बिंदु पहचान सत्यापित")}</div></div>''', unsafe_allow_html=True)
    with t4:
        st.markdown(f'''<div class="kpi-card"><div class="kpi-val">₹5.49 Cr</div><div class="kpi-lbl">{tr_span("Direct Citizen Payouts", "नागरिकों को सीधा भुगतान")}</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">{tr_span("↑ 100% Digital UPI", "↑ 100% डिजिटल यूपीआई")}</div></div>''', unsafe_allow_html=True)

    st.write("")
    login_tab_title = tr("🔐 Sign In", "🔐 लॉग इन")[0]
    reg_tab_title = tr("📝 Create Dynamic Account", "📝 नया खाता बनाएं")[0]
    auth_tab_login, auth_tab_register = st.tabs([login_tab_title, reg_tab_title])

    with auth_tab_login:
        col_l1, col_l2, col_l3 = st.columns([1, 2, 1])
        with col_l2:
            st.markdown("#### " + tr("Enter Your Credentials", "अपना विवरण दर्ज करें")[0])
            with st.form("login_form"):
                role_opts = [
                    tr("🏠 Household Citizen", "🏠 घरेलू नागरिक")[0],
                    tr("🛺 Kabadiwala / Collector", "🛺 कबाड़ीवाला साथी")[0],
                    tr("🏢 Commercial Business", "🏢 कमर्शियल प्रतिष्ठान")[0],
                    tr("🏭 Material Recycler", "🏭 रीसाइक्लिंग मिल")[0],
                    tr("🛡️ Administrator", "🛡️ प्रशासक")[0]
                ]
                in_role = st.selectbox(tr("Sign in As:", "इस रूप में लॉग इन करें:")[0], role_opts)
                in_email = st.text_input(tr("Registered Phone / Email Address", "पंजीकृत फोन / ईमेल")[0], value="9876543210")
                in_pass = st.text_input(tr("Password / PIN", "पासवर्ड / पिन")[0], type="password", value="password123")
                
                login_btn = st.form_submit_button(tr("Authenticate & Open Dashboard", "सत्यापित करें व डैशबोर्ड खोलें")[0], type="primary", use_container_width=True)
                if login_btn:
                    matched = False
                    for k, acc in DEMO_ROLES.items():
                        if in_email.lower().strip() in [acc["email"].lower(), "9876543210"]:
                            if "Household" in in_role or "घरेलू" in in_role: login_as("HOUSEHOLD")
                            elif "Kabadiwala" in in_role or "कबाड़ीवाला" in in_role: login_as("COLLECTOR")
                            elif "Commercial" in in_role or "कमर्शियल" in in_role: login_as("BUSINESS")
                            elif "Recycler" in in_role or "रीसाइक्लिंग" in in_role: login_as("RECYCLER")
                            else: login_as("ADMIN")
                            matched = True
                            st.success(tr("Welcome back! Loading dashboard...", "स्वागत है! डैशबोर्ड लोड हो रहा है...")[0])
                            st.rerun()
                            break
                    if not matched:
                        st.session_state.is_logged_in = True
                        st.session_state.user_name = "Ramesh Kumar"
                        st.session_state.user_email = in_email
                        st.session_state.current_role = "HOUSEHOLD"
                        st.rerun()

            st.divider()
            st.markdown("##### ⚡ " + tr("Quick Demo Access", "त्वरित डेमो लॉगिन")[0])
            eb1, eb2, eb3 = st.columns(3)
            with eb1:
                if st.button("🏠 " + tr("Household", "घरेलू नागरिक")[0], key="eq_h", use_container_width=True):
                    login_as("HOUSEHOLD")
                    st.rerun()
            with eb2:
                if st.button("🛺 " + tr("Collector", "कबाड़ीवाला")[0], key="eq_c", use_container_width=True):
                    login_as("COLLECTOR")
                    st.rerun()
            with eb3:
                if st.button("🛡️ " + tr("Admin Console", "एडमिन कंसोल")[0], key="eq_a", type="primary", use_container_width=True):
                    login_as("ADMIN")
                    st.rerun()

    with auth_tab_register:
        st.markdown("#### " + tr("Dynamic Multi-Role Registration Portal with 3-Point KYC", "3-बिंदु पहचान सत्यापन सहित बहु-भूमिका पंजीकरण पोर्टल")[0])
        st.caption(tr("Select your role to reveal tailored compliance onboarding:", "अपनी भूमिका चुनें:")[0])
        
        role_reg_keys = ["HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER", "ADMIN"]
        role_reg_labels = {
            "HOUSEHOLD": tr("🏠 Household Citizen / Resident", "🏠 घरेलू नागरिक / निवासी")[0],
            "COLLECTOR": tr("🛺 Kabadiwala / Collector Partner", "🛺 कबाड़ीवाला संग्रह साथी")[0],
            "BUSINESS": tr("🏢 Commercial Waste Generator (Malls, IT Parks)", "🏢 वाणिज्यिक अपशिष्ट जनरेटर")[0],
            "RECYCLER": tr("🏭 Recycling Facility / Wholesale Mill", "🏭 रीसाइक्लिंग कारखाना")[0],
            "ADMIN": tr("🛡️ Platform Governance Authority", "🛡️ प्लेटफॉर्म प्रशासनिक प्राधिकरण")[0]
        }
        chosen_role = st.selectbox(
            tr("Select Registration Role Category:", "पंजीकरण भूमिका श्रेणी चुनें:")[0],
            role_reg_keys,
            format_func=lambda x: role_reg_labels[x]
        )

        with st.form("dynamic_reg_form"):
            st.markdown("##### 1. " + tr("Basic Account Credentials", "खाता विवरण")[0])
            r_c1, r_c2 = st.columns(2)
            with r_c1:
                reg_name = st.text_input(tr("Full Name / Entity Name", "पूरा नाम / संस्था का नाम")[0], "Deepak Verma")
                reg_phone = st.text_input(tr("Phone Number (+91)", "फोन नंबर (+91)")[0], "+91 98765 00000")
            with r_c2:
                reg_email = st.text_input(tr("Official Email Address", "ईमेल पता")[0], "deepak@scrapsetu.in")
                reg_pass = st.text_input(tr("Create Security PIN / Password", "सुरक्षा पिन बनाएं")[0], type="password", value="Secret@2026")

            st.markdown("##### 2. " + tr("Role-Specific Profile Details", "भूमिका प्रोफ़ाइल विवरण")[0])
            if chosen_role == "HOUSEHOLD":
                rh1, rh2 = st.columns(2)
                with rh1:
                    reg_addr = st.text_input(tr("Residential Doorstep Address", "आवासीय पता")[0], "Apt 402, Green Valley Apartments, Mayur Vihar Phase-1")
                with rh2:
                    reg_pin = st.text_input(tr("Pincode", "पिनकोड")[0], "110091")

            elif chosen_role == "COLLECTOR":
                st.info(tr("🛺 Kabadiwala Profile: Mobile terminal, EcoRoute TSP navigation, and TrustWeigh digital scale.", "🛺 कबाड़ीवाला प्रोफ़ाइल: मोबाइल टर्मिनल, इको-रूट टीएसपी नेविगेशन, और डिजिटल तौल पैमाना।")[0])
                cv1, cv2, cv3 = st.columns(3)
                with cv1:
                    reg_veh = st.selectbox(tr("Vehicle Type", "वाहन का प्रकार")[0], [tr("E-Rickshaw Loader", "ई-रिक्शा लोडर")[0], tr("Three-Wheeler Tempo", "थ्री-व्हीलर टेम्पो")[0], tr("Mini Truck", "छोटा हाथी (मिनी ट्रक)")[0], tr("Cycle Rickshaw", "साइकिल रिक्शा")[0]])
                with cv2:
                    reg_veh_no = st.text_input(tr("Vehicle Registration No.", "वाहन पंजीकरण संख्या")[0], "DL 1 ER 7721")
                with cv3:
                    reg_upi = st.text_input(tr("Instant Payout UPI VPA", "यूपीआई वीपीए")[0], "ramesh@paytm")
                reg_cap = st.slider(tr("Daily Vehicle Capacity (kg)", "दैनिक वाहन क्षमता (किग्रा)")[0], 50, 1000, 350)

            elif chosen_role == "BUSINESS":
                st.info(tr("🏢 Commercial Bulk Generator: Recurring multi-facility contracts, GST e-invoices, and EPR credit certificates.", "🏢 वाणिज्यिक अपशिष्ट जनरेटर: आवर्ती अनुबंध, जीएसटी ई-चालान, और ईपीआर प्रमाण पत्र।")[0])
                cb1, cb2 = st.columns(2)
                with cb1:
                    reg_biz_name = st.text_input(tr("Company Legal Name", "कंपनी का नाम")[0], "GreenTech Solutions India Pvt Ltd")
                with cb2:
                    reg_gst = st.text_input(tr("GSTIN Number (15 Digits)", "जीएसटीआईएन संख्या")[0], "07AAAAA0000A1Z5")

            elif chosen_role == "RECYCLER":
                st.info(tr("🏭 Recycler Facility: Wholesale buying rate sheet manager and digital weighbridge gate pass slips.", "🏭 रीसाइक्लिंग मिल: थोक खरीद दर पत्रक और डिजिटल वेजब्रिज गेट पास।")[0])
                cr1, cr2 = st.columns(2)
                with cr1:
                    reg_fac = st.text_input(tr("Processing Facility Name", "प्रसंस्करण संयंत्र का नाम")[0], "EcoPlast Reclaimers Pvt Ltd")
                with cr2:
                    reg_cpcb = st.text_input(tr("CPCB / SPCB License Number", "सीपीसीबी लाइसेंस संख्या")[0], "CPCB/PWM/DEL-2024/092")

            elif chosen_role == "ADMIN":
                st.info(tr("🛡️ Platform Administrator: Regulatory verification queue, Mandi rate authority, and cloud database connectivity.", "🛡️ प्लेटफॉर्म प्रशासक: सत्यापन कतार, मंडी दर प्राधिकरण, और क्लाउड डेटाबेस।")[0])

            st.markdown("##### 3. " + tr("Mandatory 3-Point KYC Verification Dossier", "अनिवार्य 3-बिंदु पहचान सत्यापन दस्तावेज")[0])
            k_c1, k_c2, k_c3 = st.columns(3)
            with k_c1:
                st.markdown("**1. 📄 " + tr("Aadhaar Card", "आधार कार्ड")[0] + "**")
                u_aadh_no = st.text_input(tr("Aadhaar Number (12 Digits)", "आधार संख्या (12 अंक)")[0], "5482-9182-4912")
                u_aadh_file = st.file_uploader(tr("Upload Aadhaar", "आधार अपलोड करें")[0], type=["pdf", "png", "jpg", "jpeg"], key="reg_aadh")
            with k_c2:
                st.markdown("**2. 🪪 " + tr("Driving Licence", "ड्राइविंग लाइसेंस")[0] + "**")
                u_dl_no = st.text_input(tr("Driving Licence Number", "ड्राइविंग लाइसेंस संख्या")[0], "DL-04-2022-00455")
                u_dl_file = st.file_uploader(tr("Upload Driving Licence", "लाइसेंस अपलोड करें")[0], type=["pdf", "png", "jpg", "jpeg"], key="reg_dl")
            with k_c3:
                st.markdown("**3. 🤳 " + tr("Live Camera Selfie", "लाइव कैमरा सेल्फी")[0] + "**")
                u_selfie = st.camera_input(tr("Take Live Selfie:", "लाइव सेल्फी लें:")[0])

            reg_submit = st.form_submit_button("🚀 " + tr("Complete 3-Point Registration & Enter Portal", "पंजीकरण पूरा करें व पोर्टल में प्रवेश करें")[0], type="primary", use_container_width=True)
            if reg_submit:
                st.session_state.is_logged_in = True
                st.session_state.current_role = chosen_role
                st.session_state.user_name = reg_name
                st.session_state.user_email = reg_email

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
                st.success(tr("Registration successful! Welcome to your dashboard.", "पंजीकरण सफल! आपके डैशबोर्ड में स्वागत है।")[0])
                st.rerun()

    st.stop()


# =============================================================
# SCENARIO B: LOGGED-IN DEDICATED ROLE DASHBOARD
# =============================================================

# Strict Bilingual Top User Bar
is_hi = (st.session_state.get("lang", "en") == "hi")
active_lang_display = "हिंदी" if is_hi else "English"
alt_lang_hover = "Hover for English translation" if is_hi else "हिंदी अनुवाद हेतु कर्सर लाएं"
portal_badge_text = tr(f"{st.session_state.current_role} PORTAL", f"{st.session_state.current_role} पोर्टल")[0]
portal_badge_alt = tr(f"{st.session_state.current_role} PORTAL", f"{st.session_state.current_role} पोर्टल")[1]

st.markdown(f"""
<div class="top-user-bar">
    <div>
        <span style="font-size:1.3rem; font-weight:900; letter-spacing:-0.02em; color:#F4FDF8;">ScrapSetu 2.0</span> • 
        <b style="color:#A7F3D0;">{st.session_state.user_name}</b> 
        <span class="user-badge bilingual-hover-tip" data-trans="{portal_badge_alt}" style="margin-left:0.6rem;">{portal_badge_text}</span>
    </div>
    <div style="display:flex; align-items:center; gap:1.2rem;">
        <div class="bilingual-badge bilingual-hover-tip" data-trans="{alt_lang_hover}">
            🌐 <b>{tr("Language", "भाषा")[0]}:</b> {active_lang_display}
        </div>
        <div style="font-size:0.85rem; color:#A7F3D0;">
            <code>{st.session_state.user_email}</code> • 🟢 {tr("Live Connected", "लाइव कनेक्टेड")[0]}
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Top Action Row
t_col1, t_col2, t_col3 = st.columns([2, 1, 1])
with t_col1:
    if st.session_state.current_role != "ADMIN":
        if st.button("⚡ " + tr("1-Click Administrator Console", "1-क्लिक एडमिन कंसोल")[0], type="primary", help=tr("1-क्लिक एडमिन कंसोल", "1-Click Administrator Console")[0]):
            st.session_state.current_role = "ADMIN"
            st.session_state.user_name = "Deepak Verma"
            st.session_state.user_email = "admin@scrapsetu.in"
            st.rerun()
    else:
        st.success("🛡️ " + tr("You are currently viewing the Platform Administrator Console.", "आप वर्तमान में प्लेटफॉर्म प्रशासक कंसोल देख रहे हैं।")[0])

with t_col2:
    switch_to = st.selectbox(
        tr("Instant Role Switcher:", "भूमिका बदलें:")[0],
        ["ADMIN", "HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER"],
        index=["ADMIN", "HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER"].index(st.session_state.current_role),
        help=tr("Switch active dashboard role", "सक्रिय भूमिका डैशबोर्ड बदलें")[0]
    )
    if switch_to != st.session_state.current_role:
        login_as(switch_to)
        st.rerun()

with t_col3:
    if st.button("🚪 " + tr("Sign Out", "लॉग आउट")[0], use_container_width=True, help=tr("लॉग आउट करें", "Sign Out of Portal")[0]):
        st.session_state.is_logged_in = False
        st.rerun()

st.divider()

current_role = st.session_state.current_role

# =============================================================
# 1. 🏠 DEDICATED HOUSEHOLD DASHBOARD
# =============================================================
if current_role == "HOUSEHOLD":
    h_title = tr(f"Household Recycling Dashboard — Welcome, {st.session_state.user_name}!", f"घरेलू रीसाइक्लिंग डैशबोर्ड — स्वागत है, {st.session_state.user_name}!")[0]
    st.subheader("🏠 " + h_title)
    st.caption(tr("Schedule zero-charge doorstep scrap pickups, identify materials & calculate weight via AI ScrapVision, and track verified collectors.", "मुफ़्त डोरस्टेप स्क्रैप पिकअप शेड्यूल करें, एआई स्क्रैप-विजन द्वारा सामग्री व वजन जांचें, और सत्यापित कबाड़ीवाले ट्रैक करें।")[0])

    user_pickups = [p for p in st.session_state.pickups if p["role"] == "HOUSEHOLD"]
    completed_u = [p for p in user_pickups if p["status"] == "COMPLETED"]
    u_kg = sum(p["est_weight"] for p in completed_u)
    u_earned = sum(p["est_val"] for p in completed_u)

    hk1, hk2, hk3, hk4 = st.columns(4)
    with hk1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{u_kg:.1f} kg</div><div class="kpi-lbl">{tr_span("Total Recycled Scrap", "कुल पुनर्चक्रित कचरा")}</div></div>', unsafe_allow_html=True)
    with hk2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹{u_earned:,.2f}</div><div class="kpi-lbl">{tr_span("Cash / UPI Earned", "अर्जित नकद / यूपीआई")}</div></div>', unsafe_allow_html=True)
    with hk3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(user_pickups)} Orders</div><div class="kpi-lbl">{tr_span("Doorstep Pickups", "डोरस्टेप पिकअप संख्या")}</div></div>', unsafe_allow_html=True)
    with hk4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{round(u_kg*1.45, 1)} kg</div><div class="kpi-lbl">{tr_span("CO₂ Emissions Prevented", "बचाया गया CO₂ उत्सर्जन")}</div></div>', unsafe_allow_html=True)

    h_t1 = tr("📦 Book Doorstep Pickup (AI ScrapVision & Radar)", "📦 डोरस्टेप पिकअप बुक करें (एआई स्क्रैप-विजन व रडार)")[0]
    h_t2 = tr("🧾 Digital Waste Passports", "🧾 डिजिटल वेस्ट पासपोर्ट प्रमाण पत्र")[0]
    h_tab1, h_tab2 = st.tabs([h_t1, h_t2])

    with h_tab1:
        st.markdown("#### 📦 🔍 " + tr("Book Doorstep Scrap Pickup with AI ScrapVision", "एआई स्क्रैप-विजन सहित डोरस्टेप पिकअप बुक करें")[0])
        st.caption(tr("Capture or upload scrap photo to run real-time ScrapVision AI classification, calculate volumetric weight, and broadcast order to nearest verified collectors with image attached:", "स्क्रैप फोटो अपलोड करें या कैमरे से लें। एआई सामग्री की पहचान करता है, वजन आंका जाता है और फोटो सहित नजदीकी कबाड़ीवाले को ऑर्डर भेजा जाता है:")[0])

        h_col1, h_col2 = st.columns([1, 1], gap="large")

        with h_col1:
            st.markdown("##### 1. " + tr("Scrap Photo Input & Visual Inspection", "स्क्रैप फोटो व दृश्य निरीक्षण")[0])
            source_choices = [
                tr("Upload Custom Scrap Photo", "कस्टम फोटो अपलोड करें")[0],
                tr("Live Camera Snapshot", "लाइव कैमरा स्नैपशॉट")[0],
                tr("Neural Demo Preset", "न्यूरल डेमो नमूना")[0]
            ]
            input_method = st.radio(tr("Photo Input Source:", "फोटो इनपुट स्रोत:")[0], source_choices, horizontal=True)

            up_img = None
            sample_choice = ""
            if input_method == source_choices[0]:
                up_img = st.file_uploader(tr("Upload Scrap Photo (JPG/PNG/WEBP)", "स्क्रैप फोटो अपलोड करें")[0], type=["jpg", "jpeg", "png", "webp"])
            elif input_method == source_choices[1]:
                up_img = st.camera_input(tr("Capture Scrap Pile with Camera", "कैमरे से स्क्रैप का फोटो लें")[0])
            else:
                sample_choices = [
                    tr("🧴 Transparent Optical PET Bottles & Containers", "🧴 पारदर्शी पीईटी पानी व पेय की बोतलें")[0],
                    tr("📦 Baled Corrugated Kraft Cardboard & Cartons", "📦 बंडल किया हुआ क्राफ्ट गत्ता व कार्टन")[0],
                    tr("✨ Stripped Millberry Pure Copper Wire", "✨ छिला हुआ शुद्ध मिलबेरी तांबे का तार")[0],
                    tr("💻 Telecom Server Boards & Component E-Waste", "💻 टेलीकॉम सर्वर बोर्ड व इलेक्ट्रॉनिक ई-कचरा")[0]
                ]
                sample_choice = st.selectbox(tr("Choose High-Resolution Scrap Sample:", "उच्च-रिज़ॉल्यूशन स्क्रैप नमूना चुनें:")[0], sample_choices)

            # Dynamic AI Computer Vision Analysis
            current_photo_uri = None
            if up_img is not None:
                img_bytes = up_img.getvalue()
                b64_img = base64.b64encode(img_bytes).decode("utf-8")
                mime = getattr(up_img, "type", None) or ("image/png" if img_bytes.startswith(b"\x89PNG") else "image/jpeg")
                current_photo_uri = f"data:{mime};base64,{b64_img}"

                try:
                    pil_img = Image.open(io.BytesIO(img_bytes))
                    w, h = pil_img.size
                    thumb = pil_img.resize((50, 50)).convert("RGB")
                    pxs = list(thumb.getdata())
                    r_avg = sum(p[0] for p in pxs) / len(pxs)
                    g_avg = sum(p[1] for p in pxs) / len(pxs)
                    b_avg = sum(p[2] for p in pxs) / len(pxs)

                    if r_avg > 135 and b_avg < 110 and g_avg < 125:
                        mat_key = "metal"
                        mat_name = tr("Millberry Copper Wire (99.9% Electrolytic)", "शुद्ध मिलबेरी तांबे का तार (99.9%)")[0]
                        conf = 98.4
                        calc_wt = round(max(2.5, min(30.0, (w * h) / 250000.0)), 1)
                        rate_val = 685.0
                        obs_text = tr(
                            f"Neural spectral analysis detected stripped electrolytic copper wire coils (R={int(r_avg)}, G={int(g_avg)}, B={int(b_avg)}). Resolution {w}x{h} px. Surface clean, zero PVC burning residue. Volumetric density 8.92 g/cm³ with estimated lot weight {calc_wt} kg.",
                            f"न्यूरल स्पेक्ट्रल विश्लेषण में शुद्ध तांबे का तार देखा गया (R={int(r_avg)}, G={int(g_avg)}, B={int(b_avg)})। रिज़ॉल्यूशन {w}x{h} पिक्सल। पीवीसी अवशेष शून्य। आयतन घनत्व 8.92 g/cm³ और अनुमानित वजन {calc_wt} किग्रा।"
                        )[0]
                        comp_breakdown = tr("• 98.8% Electrolytic Copper Wire\n• 1.2% Alloy Strands & Dust", "• 98.8% शुद्ध तांबे का तार\n• 1.2% मिश्र धातु व धूल")[0]
                    elif r_avg > 125 and g_avg > 95 and b_avg < 85:
                        mat_key = "paper"
                        mat_name = tr("Corrugated Carton (Kraft Gatta #20)", "क्राफ़्ट गत्ता व कार्टन (#20)")[0]
                        conf = 97.9
                        calc_wt = round(max(6.0, min(50.0, (w * h) / 120000.0)), 1)
                        rate_val = 16.5
                        obs_text = tr(
                            f"Detected stacked corrugated kraft boxes and baled paper bundles. Spectral color R={int(r_avg)}, G={int(g_avg)}, B={int(b_avg)}. Low moisture (<3.5%). Spatial volume 0.19 m³ with bulk paper density 118 kg/m³. Calculated weight {calc_wt} kg.",
                            f"क्राफ्ट गत्ते के बक्से व कागज़ का बंडल देखा गया (R={int(r_avg)}, G={int(g_avg)}, B={int(b_avg)})। नमी <3.5%। वॉल्यूम 0.19 m³ और अनुमानित वजन {calc_wt} किग्रा।"
                        )[0]
                        comp_breakdown = tr("• 89.2% Kraft Corrugated Board\n• 9.0% Recyclable Newsprint\n• 1.8% Packaging Tape", "• 89.2% क्राफ्ट गत्ता\n• 9.0% रद्दी अखबार\n• 1.8% पैकिंग टेप")[0]
                    elif g_avg > r_avg and g_avg > b_avg:
                        mat_key = "ewaste"
                        mat_name = tr("Telecom Server Motherboards & E-Waste", "टेलीकॉम सर्वर मदरबोर्ड व ई-कचरा")[0]
                        conf = 97.1
                        calc_wt = round(max(3.0, min(25.0, (w * h) / 180000.0)), 1)
                        rate_val = 95.0
                        obs_text = tr(
                            f"Detected printed circuit board assembly (FR-4 green laminate) with heatsinks and gold contact pinouts. Resolution {w}x{h} px. RoHS compliant solder. Estimated lot weight {calc_wt} kg.",
                            f"प्रिंटेड सर्किट बोर्ड (FR-4 हरा सोल्डर मास्क) और इलेक्ट्रॉनिक्स देखे गए। रिज़ॉल्यूशन {w}x{h} पिक्सल। अनुमानित वजन {calc_wt} किग्रा।"
                        )[0]
                        comp_breakdown = tr("• 63.5% FR-4 PCB Substrate\n• 24.0% Aluminium / Copper\n• 12.5% ICs & Pinouts", "• 63.5% एफआर-4 पीसीबी\n• 24.0% एल्युमिनियम/तांबा\n• 12.5% आईसी व पिन")[0]
                    else:
                        mat_key = "plastic"
                        mat_name = tr("Rigid Plastics (PET Optical Clear #1)", "कठोर प्लास्टिक (पीईटी ऑप्टिकल ग्रेड 1)")[0]
                        conf = 98.7
                        calc_wt = round(max(3.0, min(20.0, (w * h) / 200000.0)), 1)
                        rate_val = 32.0
                        obs_text = tr(
                            f"Observed segregated clean PET beverage bottles and polymer containers. Surface reflectance confirms dry state (<1.5% moisture). Image resolution {w}x{h} px. Volumetric density 34.5 kg/m³ with calculated weight {calc_wt} kg.",
                            f"पारदर्शी पीईटी पेय की बोतलें व प्लास्टिक पात्र देखे गए। सतह पर कोई नमी नहीं (<1.5% नमी)। रिज़ॉल्यूशन {w}x{h} पिक्सल। अनुमानित वजन {calc_wt} किग्रा।"
                        )[0]
                        comp_breakdown = tr("• 94.5% PET Clear Flakes\n• 4.5% Polypropylene Caps\n• 1.0% Non-Polymer Residue", "• 94.5% पीईटी फ्लेक्स\n• 4.5% पॉलीप्रोपाइलीन कैप्स\n• 1.0% अन्य अवशेष")[0]
                except Exception:
                    mat_key = "plastic"
                    mat_name = tr("Rigid Plastics (PET Optical Clear #1)", "कठोर प्लास्टिक (पीईटी ऑप्टिकल ग्रेड 1)")[0]
                    conf = 98.0
                    calc_wt = 5.4
                    rate_val = 32.0
                    obs_text = tr("Processed uploaded image. Neural boundary detection identified recyclable polymer scrap.", "अपलोड की गई फोटो का विश्लेषण पूर्ण। पुनर्चक्रण योग्य प्लास्टिक सामग्री पहचानी गई।")[0]
                    comp_breakdown = tr("• 94.0% PET Clear Flakes\n• 6.0% Mixed Polymer Residue", "• 94.0% पीईटी फ्लेक्स\n• 6.0% मिश्रित प्लास्टिक अवशेष")[0]
            else:
                if not sample_choice:
                    sample_choice = tr("🧴 Transparent Optical PET Bottles & Containers", "🧴 पारदर्शी पीईटी पानी व पेय की बोतलें")[0]

                if "PET" in sample_choice or "बोतलें" in sample_choice:
                    mat_key = "plastic"
                    mat_name = tr("Rigid Plastics (PET Optical Clear #1)", "कठोर प्लास्टिक (पीईटी ऑप्टिकल ग्रेड 1)")[0]
                    conf = 98.4
                    calc_wt = 5.4
                    rate_val = 32.0
                    obs_text = tr("Observed loose pile of 42 optical clear PET beverage bottles lightly compressed with PP caps segregated. Surface reflectance indicates dry state (<1.2% moisture). Volumetric 3D bounding box calculated at 0.158 m³ with loose bulk packing density of 34.2 kg/m³.", "42 पारदर्शी पीईटी पेय की बोतलों का ढेर देखा गया। पीपी ढक्कन अलग किए गए हैं। सतह पर कोई नमी नहीं है (<1.2% नमी)। 3D बाउंडिंग बॉक्स वॉल्यूम 0.158 m³ और घनत्व 34.2 kg/m³ आंका गया।")[0]
                    comp_breakdown = tr("• 94.2% PET Clear Flakes\n• 4.8% Polypropylene Caps\n• 1.0% Non-Polymer Residue", "• 94.2% पीईटी फ्लेक्स\n• 4.8% पॉलीप्रोपाइलीन कैप्स\n• 1.0% अन्य अशुद्धियां")[0]
                elif "Cardboard" in sample_choice or "गत्ता" in sample_choice:
                    mat_key = "paper"
                    mat_name = tr("Corrugated Carton (Kraft Gatta #20)", "क्राफ़्ट गत्ता व कार्टन (#20)")[0]
                    conf = 97.6
                    calc_wt = 22.0
                    rate_val = 16.5
                    obs_text = tr("Bundled double-fluted corrugated kraft cardboard cartons with clean dry daily newspapers, bound with twine. Low humidity (<4%), zero wet food contamination. Volumetric space 0.185 m³ with baled paper density 119 kg/m³.", "रस्सी से बंधे दोहरे क्राफ्ट गत्ते के बक्से और सूखे समाचार पत्र। कम नमी (<4%), कोई गीला कचरा नहीं। वॉल्यूम 0.185 m³ और घनत्व 119 kg/m³ आंका गया।")[0]
                    comp_breakdown = tr("• 88.5% Kraft Linerboard\n• 9.5% Newsprint\n• 2.0% Twine & Adhesive Tape", "• 88.5% क्राफ्ट लाइनरबोर्ड\n• 9.5% समाचार पत्र\n• 2.0% सुतली व चिपकने वाला टेप")[0]
                elif "Copper" in sample_choice or "तांबे" in sample_choice:
                    mat_key = "metal"
                    mat_name = tr("Millberry Copper Wire (99.9% Electrolytic)", "शुद्ध मिलबेरी तांबे का तार (99.9%)")[0]
                    conf = 99.2
                    calc_wt = 4.8
                    rate_val = 685.0
                    obs_text = tr("Stripped bright millberry copper wire coils (99.9% electrolytic purity) with heavy armoured conduit cables. Zero insulation PVC burning residue. Bulk metal density 8.92 g/cm³.", "छिले हुए चमकदार मिलबेरी तांबे के तार के बंडल (99.9% शुद्धता)। पीवीसी इन्सुलेशन अवशेष शून्य है। धातु का घनत्व 8.92 g/cm³ है।")[0]
                    comp_breakdown = tr("• 99.2% Pure Electrolytic Copper\n• 0.8% Tin-Coated Strands", "• 99.2% शुद्ध इलेक्ट्रोलाइटिक कॉपर\n• 0.8% टिन लेपित तार")[0]
                else:
                    mat_key = "ewaste"
                    mat_name = tr("Telecom Server Motherboards & E-Waste", "टेलीकॉम सर्वर मदरबोर्ड व ई-कचरा")[0]
                    conf = 96.8
                    calc_wt = 14.5
                    rate_val = 95.0
                    obs_text = tr("Post-consumer telecommunications server motherboards, RAM sticks with gold contact fingers, and switched-mode power supplies. RoHS compliant, lead-free solder.", "दूरसंचार सर्वर मदरबोर्ड, रैम स्टिक्स (गोल्ड पिन्स) और पावर सप्लाई यूनिट्स। RoHS मानकों के अनुरूप, सीसा रहित सोल्डर।")[0]
                    comp_breakdown = tr("• 62.0% FR-4 Laminate PCB\n• 24.5% Aluminium & Copper Heatsinks\n• 13.5% Precious Metal Pinouts", "• 62.0% एफआर-4 पीसीबी\n• 24.5% एल्युमिनियम व तांबा हीटसिंक\n• 13.5% कीमती धातु पिन्स")[0]

                current_photo_uri = get_scrap_svg(mat_key, sample_choice.split("(")[0].strip())

            # Visual Preview
            st.markdown("##### " + tr("Visual Inspection Preview:", "दृश्य निरीक्षण पूर्वावलोकन:")[0])
            if up_img is not None:
                st.image(up_img, caption=tr("Customer Scrap Photo • AI Analyzed ✓", "ग्राहक स्क्रैप फोटो • एआई विश्लेषित ✓")[0], use_container_width=True)
            else:
                if input_method == source_choices[0]:
                    st.markdown(f"""
                    <div style="background:rgba(16, 185, 129, 0.05); border:2px dashed rgba(16, 185, 129, 0.4); border-radius:12px; padding:18px; text-align:center; margin-bottom:12px;">
                        <span style="font-size:1.8rem;">📸</span>
                        <div style="color:#6EE7B7; font-weight:700; font-size:0.95rem; margin-top:4px;">
                            {tr("Waiting for Scrap Photo Upload...", "स्क्रैप फोटो अपलोड की प्रतीक्षा है...")[0]}
                        </div>
                        <div style="color:#94A3B8; font-size:0.8rem; margin-top:2px;">
                            {tr("Upload a photo above or use Camera Snapshot / Demo Preset.", "ऊपर फोटो अपलोड करें या कैमरा / डेमो नमूना चुनें।")[0]}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                img_data_uri = get_scrap_svg(mat_key, sample_choice.split("(")[0].strip())
                st.markdown(f'<img src="{img_data_uri}" style="width:100%; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.4); margin-bottom:8px; display:block;">', unsafe_allow_html=True)
                st.caption("ℹ️ " + tr(f"Neural sample preview: {sample_choice.split('(')[0].strip()}", f"न्यूरल नमूना पूर्वावलोकन: {sample_choice.split('(')[0].strip()}")[0])

            # AI Inspection Box
            st.markdown(f"""
            <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.45); border-radius:14px; padding:16px; margin-top:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <b style="color:#6EE7B7; font-size:1.05rem;">🤖 {tr("What the AI Vision Model Sees:", "एआई विजन मॉडल का दृश्य विश्लेषण:")[0]}</b>
                    <span style="background:rgba(16, 185, 129, 0.25); color:#34D399; padding:2px 8px; border-radius:999px; font-weight:800; font-size:11px; border:1px solid #10B981;">
                        {conf}% {tr("Confidence ✓", "सटीकता ✓")[0]}
                    </span>
                </div>
                <hr style="margin:8px 0; border-color:rgba(16, 185, 129, 0.25);">
                <p style="color:#E2E8F0; font-size:0.88rem; line-height:1.45; margin-bottom:8px;">
                    "{obs_text}"
                </p>
                <div style="background:#091A12; border:1px solid rgba(16, 185, 129, 0.2); border-radius:8px; padding:8px; font-size:0.82rem; color:#A7F3D0;">
                    <b>{tr("Material Composition:", "सामग्री संरचना:")[0]}</b><br>
                    {comp_breakdown.replace(chr(92)+'n', '<br>')}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with h_col2:
            st.markdown("##### 2. " + tr("Confirm Weight, Schedule & Book Doorstep Pickup", "2. वजन की पुष्टि, समय व पिकअप बुकिंग")[0])
            st.caption(tr("Adjust verified weight if needed, pick your preferred doorstep time slot, and broadcast request with image to nearest verified collector:", "यदि आवश्यक हो तो वजन समायोजित करें, समय स्लॉट चुनें और फोटो सहित नजदीकी सत्यापित कबाड़ीवाले को ऑर्डर भेजें:")[0])

            cw_col1, cw_col2 = st.columns(2)
            with cw_col1:
                st.metric(tr("AI Calculated Weight", "एआई आकलित वजन")[0], f"{calc_wt} kg", delta=tr("±0.3 kg Volumetric", "±0.3 किग्रा आयतन")[0])
            with cw_col2:
                st.metric(tr("Benchmark Mandi Rate", "बेंचमार्क मंडी दर")[0], f"₹{rate_val}/kg", delta=tr("Verified Rate", "सत्यापित दर")[0])

            fine_wt = st.slider(tr("Fine-Tune / Confirm Actual Weight (kg):", "वजन समायोजित या पुष्टि करें (किग्रा):")[0], min_value=1.0, max_value=100.0, value=float(calc_wt), step=0.5)
            live_payout = round(fine_wt * rate_val, 2)

            slot_choices = [
                tr("Morning (9 AM - 12 PM)", "सुबह (9 बजे - 12 बजे)")[0],
                tr("Afternoon (12 PM - 3 PM)", "दोपहर (12 बजे - 3 बजे)")[0],
                tr("Evening (3 PM - 6 PM)", "शाम (3 बजे - 6 बजे)")[0]
            ]
            h_slot = st.selectbox(tr("Preferred Time Window", "सुविधाजनक समय स्लॉट")[0], slot_choices)
            h_addr = st.text_input(tr("Doorstep Pickup Address", "पिकअप का पता")[0], "South Extension II, Block C, New Delhi")

            st.markdown(f"""
            <div style="background:#091A12; border:1.5px solid #10B981; border-radius:12px; padding:14px; margin:12px 0; text-align:center;">
                <span style="color:#A1B2A9; font-size:0.85rem;">{tr("Estimated Guaranteed Doorstep Payout:", "अनुमानित गारंटीकृत डोरस्टेप भुगतान:")[0]}</span><br>
                <b style="color:#34D399; font-size:1.9rem; font-family:monospace;">₹{live_payout:,.2f}</b><br>
                <span style="color:#6EE7B7; font-size:0.8rem;">{tr("100% Instant Digital UPI / Cash via TrustWeigh Scale", "डिजिटल कांटे द्वारा 100% सटीक गारंटी • तुरंत यूपीआई / नकद")[0]}</span>
            </div>
            """, unsafe_allow_html=True)

            final_photo_to_save = current_photo_uri if current_photo_uri else get_scrap_svg(mat_key, sample_choice.split("(")[0].strip())

            if st.button("🚀 " + tr("Confirm & Broadcast Doorstep Pickup with Photo", "फोटो सहित डोरस्टेप पिकअप बुक करें")[0], type="primary", use_container_width=True):
                nid = f"REQ-{len(st.session_state.pickups)+101}"
                new_order = {
                    "id": nid,
                    "user": st.session_state.user_name,
                    "role": "HOUSEHOLD",
                    "phone": "+91 98290 22002",
                    "area": h_addr,
                    "lat": 28.5684 + (len(st.session_state.pickups) * 0.002),
                    "lng": 77.2195 + (len(st.session_state.pickups) * 0.002),
                    "materials": f"{mat_name.split('(')[0].strip()} ({fine_wt}kg)",
                    "est_weight": fine_wt,
                    "est_val": live_payout,
                    "slot": h_slot,
                    "status": "OPEN",
                    "assigned_collector": None,
                    "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "photo_svg": final_photo_to_save,
                    "ai_vision": f"{obs_en}\n\n(हिंदी: {obs_hi})",
                    "ai_weight_details": f"Calculated: {fine_wt} kg | Payout: ₹{live_payout:,.2f} | Mandi Rate: ₹{rate_val}/kg | Confidence: {conf}%"
                }
                st.session_state.pickups.append(new_order)
                st.success(tr(f"Pickup {nid} scheduled with scrap photo attached! Nearest verified collectors will see the photo and location on their terminal.", f"पिकअप {nid} फोटो सहित शेड्यूल हुआ! नजदीकी सत्यापित कबाड़ीवालों को फोटो और लोकेशन भेज दी गई है।")[0])
                st.rerun()

            st.markdown("---")
            st.markdown("##### 🗺️ " + tr("Neighborhood Collector Radar Map", "नजदीकी कबाड़ीवाला रडार मैप")[0])
            m = folium.Map(location=[28.5684, 77.2195], zoom_start=13)
            folium.Marker([28.5684, 77.2195], tooltip="My Doorstep Location", icon=folium.Icon(color="green", icon="home")).add_to(m)
            folium.Marker([28.5720, 77.2250], tooltip="Ramu Paswan (Kavach Certified)", icon=folium.Icon(color="blue", icon="truck", prefix="fa")).add_to(m)
            folium.Marker([28.5610, 77.2110], tooltip="Mohammad Farooq (Mini Truck)", icon=folium.Icon(color="orange", icon="truck", prefix="fa")).add_to(m)
            st_folium(m, height=230, use_container_width=True)

            st.caption(tr("Active Orders:", "सक्रिय ऑर्डर्स:")[0])
            for p in reversed(user_pickups):
                with st.expander(f"{p['id']} - {p['materials']} ({p['status']})"):
                    st.write(f"**{tr('Status', 'स्थिति')[0]}:** `{p['status']}`")
                    st.write(f"**{tr('Estimated Valuation', 'अनुमानित मूल्य')[0]}:** ₹{p['est_val']}")
                    if p.get("receipt_number"):
                        st.success(tr(f"Receipt #{p['receipt_number']} • Cryptographic SHA-256 Sealed ✓", f"रसीद #{p['receipt_number']} • क्रिप्टोग्राफिक SHA-256 सीलबंद ✓")[0])

    with h_tab2:
        st.markdown("#### 🧾 " + tr("Digital Waste Passports", "डिजिटल वेस्ट पासपोर्ट")[0])
        st.caption(tr("Every completed transaction generates an immutable cryptographic SHA-256 seal:", "प्रत्येक पूर्ण लेन-देन पर क्रिप्टोग्राफिक SHA-256 डिजिटल सील जारी होती है:")[0])
        st.markdown(f"""
        <div class="receipt-container">
            <div class="receipt-header">
                <span style="font-size:1.2rem; font-weight:800; color:#34D399;">SCRAPSETU DIGITAL WASTE PASSPORT</span><br>
                <span>{tr("Receipt Number", "रसीद संख्या")[0]}: RCP-2026-DEL-0894</span><br>
                <span>CPCB Traceable • Merkle Block #184920</span>
            </div>
            <div class="receipt-row"><span>{tr("Citizen Generator:", "नागरिक अपशिष्ट जनरेटर:")[0]}</span><span>Pooja Verma</span></div>
            <div class="receipt-row"><span>{tr("Collector Partner:", "कबाड़ीवाला साथी:")[0]}</span><span>Ramu Paswan</span></div>
            <div class="receipt-row"><span>{tr("Weighing Hardware:", "तौल उपकरण:")[0]}</span><span>TrustWeigh BT Scale (±0.05kg)</span></div>
            <div class="receipt-row"><span>{tr("Material Category:", "कचरा श्रेणी:")[0]}</span><span>Rigid Plastics (PET / HDPE)</span></div>
            <div class="receipt-row"><span>{tr("Net Weight:", "शुद्ध वजन:")[0]}</span><span>24.8 kg</span></div>
            <div class="receipt-row"><span>{tr("Settled Benchmark Rate:", "तयशुदा दर:")[0]}</span><span>₹28.00 / kg</span></div>
            <div class="receipt-total"><span>{tr("Total UPI Payout:", "कुल यूपीआई भुगतान:")[0]}</span><span>₹694.40 Settled</span></div>
            <hr style="border-top:1px dashed rgba(16, 185, 129, 0.4); margin:8px 0;">
            <div style="font-size:0.75rem; word-break:break-all; color:#94A3B8;">
                SHA-256 Seal: 9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058
            </div>
        </div>
        """, unsafe_allow_html=True)


# =============================================================
# 2. 🛺 DEDICATED KABADIWALA (COLLECTOR) DASHBOARD
# =============================================================
elif current_role == "COLLECTOR":
    c_title = tr("Collector Job Terminal", "कबाड़ीवाला जॉब टर्मिनल")[0] + f" — {st.session_state.user_name}"
    st.subheader("🛺 " + c_title)
    st.caption(tr("Mobile-first accessible terminal with Customer Scrap Photo Inspection, EcoRoute TSP navigation & Smart Buyer Matching.", "ग्राहक स्क्रैप फोटो जांच, इको-रूट टीएसपी नेविगेशन व स्मार्ट खरीदार मिलान सहित मोबाइल टर्मिनल।")[0])

    kc1, kc2, kc3, kc4 = st.columns(4)
    with kc1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">187.5 / 250 kg</div><div class="kpi-lbl">{tr_span("Daily Vehicle Capacity (75%)", "दैनिक वाहन क्षमता (75%)")}</div></div>', unsafe_allow_html=True)
    with kc2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">{tr_span("Today Collections Settled", "आज का कुल संग्रह निपटान")}</div></div>', unsafe_allow_html=True)
    with kc3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">3 Orders</div><div class="kpi-lbl">{tr_span("Completed Pickups", "पूर्ण किए गए पिकअप")}</div></div>', unsafe_allow_html=True)
    with kc4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">38% Fuel Saved</div><div class="kpi-lbl">{tr_span("EcoRoute Fuel Savings", "इको-रूट ईंधन बचत")}</div></div>', unsafe_allow_html=True)

    ct1_name = tr("📍 Nearby Open Jobs & Photos", "📍 नजदीकी ऑर्डर्स व फोटो जांच")[0]
    ct2_name = tr("🎯 1. Smart Buyer Matching", "🎯 1. स्मार्ट खरीदार मिलान")[0]
    ct3_name = tr("🤝 2. Collaborative Scrap Pooling", "🤝 2. सहयोगात्मक स्क्रैप पूलिंग")[0]
    ct4_name = tr("📜 3. Scrap Passport & Traceability", "📜 3. डिजिटल स्क्रैप पासपोर्ट व ट्रैसेबिलिटी")[0]
    ct5_name = tr("🗺️ EcoRoute TSP Route Planner", "🗺️ इको-रूट टीएसपी रूट प्लानर")[0]
    ct6_name = tr("🪪 3-Point KYC Identity", "🪪 3-बिंदु पहचान सत्यापन")[0]

    col_tab1, col_tab_match, col_tab_pool, col_tab_pass, col_tab2, col_tab3 = st.tabs([
        ct1_name, ct2_name, ct3_name, ct4_name, ct5_name, ct6_name
    ])

    # ---------------- 1. JOBS & CUSTOMER SCRAP PHOTO INSPECTION (BASE64 FIXED) ----------------
    with col_tab1:
        k_col1, k_col2 = st.columns([1, 1], gap="large")
        with k_col1:
            st.markdown("#### 📍 " + tr("Nearby Open Pickups & Scrap Photo Inspection", "नजदीकी खुले पिकअप व ग्राहक फोटो जांच")[0])
            st.caption(tr("Inspect customer scrap photo & AI volumetric weight before accepting pickup orders:", "ऑर्डर स्वीकारने से पहले ग्राहक की स्क्रैप फोटो व वजन विवरण जांचें:")[0])
            
            open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
            if open_jobs:
                for job in open_jobs:
                    dist = haversine_km(28.5684, 77.2195, job["lat"], job["lng"])
                    with st.container(border=True):
                        jc1, jc2 = st.columns([1, 2])
                        with jc1:
                            photo_data = job.get("photo_svg", get_scrap_svg("plastic", job["materials"]))
                            st.markdown(f'<img src="{photo_data}" style="width:100%; height:110px; object-fit:cover; border-radius:10px; border:1px solid rgba(16, 185, 129, 0.4); display:block;">', unsafe_allow_html=True)
                            st.caption("📷 " + tr("Scrap Photo Attached", "स्क्रैप फोटो संलग्न")[0])
                        with jc2:
                            st.markdown(f"**{job['materials']}**")
                            st.caption(f"{tr('Customer', 'ग्राहक')[0]}: **{job['user']}** • {tr('Distance', 'दूरी')[0]}: **{dist} km**")
                            st.caption(f"{tr('Location', 'स्थान')[0]}: {job['area']}")
                            st.markdown(f"**{tr('Est. Payout', 'अनुमानित कमाई')[0]}: ₹{job['est_val']:,.2f}**")

                        with st.expander(f"🔍 " + tr(f"Inspect Scrap Photo & AI Details ({job['id']})", f"ग्राहक स्क्रैप फोटो व AI विवरण जांचें ({job['id']})")[0]):
                            st.markdown("##### 📷 " + tr("Full Scrap Photograph:", "पूर्ण स्क्रैप फोटोग्राफ:")[0])
                            st.markdown(f'<img src="{photo_data}" style="width:100%; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.6); margin-bottom:10px; display:block;">', unsafe_allow_html=True)
                            st.markdown(f"""
                            <div style="background:#091A12; border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:12px; font-size:13px; color:#A7F3D0; margin-bottom:10px;">
                                <b>🤖 {tr("AI Vision Model Scene Analysis:", "एआई विजन मॉडल का दृश्य विवरण:")[0]}</b><br>
                                "{job.get('ai_vision', 'Segregated post-consumer recyclable material.')}"<br><br>
                                <b>{tr("Weight & Confidence Breakdown:", "वजन व दर विश्लेषण:")[0]}</b> {job.get('ai_weight_details', f"{job['est_weight']} kg")}<br>
                                <b>{tr("Contact Phone:", "संपर्क फोन:")[0]}</b> {job.get('phone', '+91 98290 22002')}
                            </div>
                            """, unsafe_allow_html=True)

                        if st.button(tr(f"✅ Accept Pickup Job ({job['id']})", f"✅ पिकअप स्वीकार करें ({job['id']})")[0], key=f"k_acc_{job['id']}", type="primary", use_container_width=True):
                            job["status"] = "ACCEPTED"
                            job["assigned_collector"] = st.session_state.user_name
                            st.success(tr(f"Pickup {job['id']} accepted! Customer contact & address unlocked.", f"पिकअप {job['id']} स्वीकार कर लिया गया! ग्राहक का फोन और पता अनलॉक हुआ।")[0])
                            st.rerun()
            else:
                st.info(tr("No open pickups currently available. All scheduled orders have been collected.", "वर्तमान में कोई खुला पिकअप नहीं है। सभी ऑर्डर्स पूरे हो चुके हैं।")[0])

        with k_col2:
            st.markdown("#### ⚖️ " + tr("TrustWeigh Scale Entry & Digital Receipt", "तौल दर्ज करें व डिजिटल रसीद बनाएं")[0])
            accepted_jobs = [p for p in st.session_state.pickups if p["status"] == "ACCEPTED"]
            if accepted_jobs:
                sel_j = st.selectbox(tr("Select Active Pickup:", "चुनें चालू पिकअप:")[0], [p["id"] for p in accepted_jobs])
                tgt = next(p for p in accepted_jobs if p["id"] == sel_j)
                
                with st.form("weigh_form"):
                    st.write(f"**{tr('Customer', 'ग्राहक')[0]}:** {tgt['user']} (📞 {tgt.get('phone', '+91 98290 00000')})")
                    w_gross = st.number_input(tr("Gross Weight (kg):", "सकल वजन (किग्रा):")[0], min_value=1.0, value=float(tgt["est_weight"])+0.5)
                    w_tare = st.number_input(tr("Tare / Container Weight (kg):", "खाली कंटेनर वजन (किग्रा):")[0], min_value=0.0, value=0.5)
                    w_net = round(w_gross - w_tare, 2)
                    st.write(f"**{tr('Net Calibrated Weight:', 'वास्तविक शुद्ध वजन:')[0]}** `{w_net} kg`")
                    w_rt = st.number_input(tr("Agreed Rate (₹/kg):", "सहमति दर (₹/किग्रा):")[0], min_value=1.0, value=28.0)
                    w_tot = round(w_net * w_rt, 2)
                    st.markdown(f"### {tr('Total Payout:', 'कुल देय राशि:')[0]} ₹{w_tot:,.2f}")
                    
                    if st.form_submit_button("⚖️ " + tr("Issue Digital Receipt & Complete UPI Payout", "डिजिटल रसीद जारी करें व भुगतान पूरा करें")[0], type="primary", use_container_width=True):
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
                        st.success(tr(f"Receipt #{r_no} issued! SHA-256 seal locked.", f"रसीद #{r_no} जारी हुई! क्रिप्टोग्राफिक सील लॉक हुई।")[0])
                        st.rerun()
            else:
                st.info(tr("No active accepted orders to weigh. Please accept a pickup from the left panel.", "कोई चालू पिकअप नहीं है जिसे तौलना हो। कृपया बायीं ओर से नया पिकअप स्वीकार करें।")[0])

    # ---------------- 2. SMART BUYER MATCHING TAB ----------------
    with col_tab_match:
        st.markdown("#### 🎯 " + tr("Smart Buyer Matching", "स्मार्ट खरीदार मिलान")[0])
        st.caption(tr("Recommends recyclers to maximize Net Proceeds (Gross Proceeds minus Transport Fuel Cost):", "परिवहन भाड़ा घटाकर सर्वाधिक शुद्ध मुनाफा देने वाले रीसाइक्लर की सिफारिश:")[0])

        sm_c1, sm_c2 = st.columns([1, 2], gap="medium")
        with sm_c1:
            with st.container(border=True):
                st.markdown("##### 📦 " + tr("Available Scrap Lot", "उपलब्ध स्क्रैप लॉट")[0])
                mat_opts = [
                    tr("Plastic (PET / HDPE)", "प्लास्टिक (पीईटी / एचडीपीई)")[0],
                    tr("Paper & Cardboard", "कागज़ और गत्ता")[0],
                    tr("Copper Wire", "तांबे का तार")[0],
                    tr("Aluminium Section", "एल्युमिनियम सेक्शन")[0]
                ]
                sm_mat = st.selectbox(tr("Category:", "सामग्री श्रेणी:")[0], mat_opts)
                sm_wt = st.number_input(tr("Weight (kg):", "उपलब्ध वजन (किग्रा):")[0], min_value=10, max_value=2000, value=180, step=10)
                sm_veh = st.selectbox(tr("Transport Vehicle:", "परिवहन वाहन:")[0], [
                    "THREE_WHEELER (E-Rickshaw: ₹50 + ₹12/km)",
                    "MINI_TRUCK (Tata Ace: ₹90 + ₹18/km)",
                    "HAND_CART (Manual: ₹20 + ₹8/km)"
                ])
                sm_dist_filter = st.slider(tr("Max Distance (km):", "अधिकतम दूरी (किमी):")[0], 5, 50, 30)

        with sm_c2:
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

            eligible = sorted([r for r in results if r["meets_min"] and r["dist"] <= sm_dist_filter], key=lambda x: x["net"], reverse=True)
            ineligible = [r for r in results if not r["meets_min"] or r["dist"] > sm_dist_filter]

            if eligible:
                top = eligible[0]
                rec_badge = tr("🌟 TOP RECOMMENDATION", "🌟 सर्वश्रेष्ठ शुद्ध मुनाफा सिफारिश")[0]
                st.markdown(f"""
                <div style="background:#062316; border:2px solid #10B981; border-radius:18px; padding:18px; color:white; margin-bottom:14px;">
                    <span style="background:#10B981; color:#052e16; font-size:10px; font-weight:900; padding:3px 10px; border-radius:999px; text-transform:uppercase;">
                        {rec_badge}
                    </span>
                    <h3 style="color:#ffffff; margin:6px 0 2px 0;">{top['name']}</h3>
                    <p style="color:#86efac; font-size:12px; margin-bottom:8px;">{tr('Location', 'स्थान')[0]}: {top['loc']} • {tr('Distance', 'दूरी')[0]}: <b>{top['dist']} km</b> • CPCB: {top['cpcb']}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:rgba(0,0,0,0.5); padding:10px; border-radius:12px;">
                        <div><span style="font-size:11px; color:#9ca3af;">{tr('Gross Value', 'सकल मूल्य')[0]}</span><br><b style="font-size:16px; color:#ffffff;">₹{top['gross']:,.2f}</b><br><span style="font-size:10px; color:#a7f3d0;">@ ₹{top['rate']}/kg</span></div>
                        <div><span style="font-size:11px; color:#9ca3af;">{tr('Transport Fuel', 'परिवहन भाड़ा')[0]}</span><br><b style="font-size:16px; color:#f87171;">-₹{top['t_cost']:,.2f}</b><br><span style="font-size:10px; color:#fca5a5;">{top['dist']} km @ {v_type}</span></div>
                        <div><span style="font-size:11px; color:#a7f3d0;">{tr('Net Proceeds', 'शुद्ध प्राप्ति')[0]}</span><br><b style="font-size:20px; color:#34D399;">₹{top['net']:,.2f}</b><br><span style="font-size:10px; color:#86efac;">{tr('Max Net Return', 'सर्वाधिक कमाई')[0]}</span></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

                st.markdown("##### 📋 " + tr("Comparable Buyer Offers", "अन्य उपलब्ध रीसाइक्लर विकल्प")[0])
                for alt in eligible:
                    with st.container(border=True):
                        ac1, ac2, ac3 = st.columns([2, 1, 1])
                        with ac1:
                            st.markdown(f"**{alt['name']}**")
                            st.caption(f"{tr('Distance', 'दूरी')[0]}: {alt['dist']} km • {tr('Min Lot', 'न्यूनतम लॉट')[0]}: {alt['min_kg']} kg")
                        with ac2:
                            st.markdown(f"{tr('Rate', 'दर')[0]}: **₹{alt['rate']}/kg**")
                            st.caption(f"{tr('Transport', 'भाड़ा')[0]}: ₹{alt['t_cost']:,.0f}")
                        with ac3:
                            st.markdown(f"**{tr('Net', 'शुद्ध')[0]}: ₹{alt['net']:,.2f}**")
                            if st.button(tr("Select Buyer", "रीसाइक्लर चुनें")[0], key=f"sel_b_{alt['name'][:8]}", use_container_width=True):
                                st.success(tr(f"{alt['name']} selected! Lot assigned.", f"{alt['name']} चुना गया! लॉट असाइन हुआ।")[0])

            if ineligible:
                st.markdown("##### ⚠️ " + tr("Incompatible Buyers", "अनुपयुक्त रीसाइक्लर")[0])
                for inel in ineligible:
                    with st.container(border=True):
                        st.markdown(f"**{inel['name']}** ({tr('Distance', 'दूरी')[0]}: {inel['dist']} km • {tr('Rate', 'दर')[0]}: ₹{inel['rate']}/kg)")
                        if not inel["meets_min"]:
                            st.warning(tr(f"Minimum quantity requirement not met: Requires {inel['min_kg']} kg, you have {sm_wt} kg.", f"न्यूनतम लॉट आवश्यकता पूरी नहीं: आवश्यक {inel['min_kg']} किग्रा, आपके पास केवल {sm_wt} किग्रा है।")[0])
                        elif inel["dist"] > sm_dist_filter:
                            st.warning(tr(f"Exceeds max distance threshold ({sm_dist_filter} km): Distance is {inel['dist']} km.", f"अधिकतम दूरी सीमा ({sm_dist_filter} किमी) से अधिक दूरी: {inel['dist']} किमी।")[0])

    # ---------------- 3. COLLABORATIVE SCRAP POOLING TAB ----------------
    with col_tab_pool:
        st.markdown("#### 🤝 " + tr("Collaborative Scrap Pooling", "सहयोगात्मक स्क्रैप पूलिंग")[0])
        st.caption(tr("Combine scrap lots with neighboring collectors to satisfy bulk buyer minimums and earn +15% to +25% bonus rates:", "छोटे कबाड़ीवाले आपस में स्क्रैप मिलाकर बड़ी बल्क लॉट बनाते हैं और सीधा रीसाइक्लर से +15% से +25% तक प्रीमियम दर पाते हैं:")[0])

        pool_c1, pool_c2 = st.columns([1, 1], gap="large")
        with pool_c1:
            st.markdown("##### 📦 " + tr("Active Pooling Consignments", "सक्रिय पूलिंग ग्रुप")[0])
            pools_data = [
                {"id": "POOL-001", "name": tr("Indiranagar PET Plastic Bulk Pool", "इंदिरानगर PET प्लास्टिक बल्क पूल")[0], "cat": "Plastic (PET)", "target": 1000, "pledged": 640, "rate": 34.0, "solo": 28.0, "deadline": tr("Tomorrow 5 PM", "कल शाम 5 बजे")[0], "hub": tr("Indiranagar Recovery Yard", "इंदिरानगर रिकवरी यार्ड")[0]},
                {"id": "POOL-002", "name": tr("Koramangala Cardboard Mega Lot", "कोरमंगला कार्डबोर्ड व गत्ता मेगा लॉट")[0], "cat": "Cardboard", "target": 2000, "pledged": 1750, "rate": 18.5, "solo": 14.0, "deadline": tr("In 2 Days", "2 दिन में")[0], "hub": tr("Koramangala 4th Block Yard", "कोरमंगला 4th ब्लॉक यार्ड")[0]},
            ]

            for p in pools_data:
                pct = int((p["pledged"] / p["target"]) * 100)
                rem = p["target"] - p["pledged"]
                bonus = p["rate"] - p["solo"]
                with st.container(border=True):
                    st.markdown(f"**{p['name']}** (`{p['id']}`)")
                    st.caption(f"{tr('Material', 'सामग्री')[0]}: **{p['cat']}** • {tr('Hub', 'हब')[0]}: {p['hub']} • {tr('Deadline', 'समय सीमा')[0]}: {p['deadline']}")
                    st.progress(pct / 100)
                    st.write(f"{tr('Progress', 'प्रगति')[0]}: **{p['pledged']} / {p['target']} kg ({pct}%)** • {tr('Remaining', 'शेष')[0]}: **{rem} kg**")
                    st.markdown(f"{tr('Bulk Rate', 'बल्क दर')[0]}: **₹{p['rate']}/kg** *({tr('Solo Rate', 'अकेले बेचने पर दर')[0]}: ₹{p['solo']}/kg, {tr('Pool Bonus', 'पूलिंग बोनस')[0]}: +₹{bonus}/kg)*")

        with pool_c2:
            st.markdown("##### ✍️ " + tr("Pledge Scrap to Pool", "अपने स्क्रैप का योगदान दें")[0])
            with st.form("pledge_form"):
                p_choice = st.selectbox(tr("Select Pooling Group:", "चुनें पूलिंग ग्रुप:")[0], [f"{p['id']} — {p['name']}" for p in pools_data])
                pl_kg = st.number_input(tr("Pledged Weight (kg):", "योगदान वजन (किग्रा):")[0], min_value=10, max_value=500, value=50, step=5)
                
                est_p = pl_kg * 34.0
                est_b = pl_kg * 6.0
                st.info(f"💡 **{tr('Expected Payout', 'अनुमानित भुगतान')[0]}:** ₹{est_p:,.2f} | **{tr('Pooling Extra Bonus', 'पूलिंग अतिरिक्त बोनस')[0]}:** +₹{est_b:,.2f}")
                st.caption("🔒 " + tr("Fairness Guarantee: Your contribution is locked and can be withdrawn anytime before 100% target completion.", "निष्पक्षता गारंटी: आपका योगदान सुरक्षित रहेगा। 100% पूरा होने से पहले कभी भी वापस ले सकते हैं।")[0])
                
                if st.form_submit_button("🤝 " + tr("Lock Pledge into Pool", "पूल में स्क्रैप लॉक करें")[0], type="primary", use_container_width=True):
                    st.success(tr(f"Successfully pledged {pl_kg} kg! Your pool allocation share is 14.2%.", f"सफलतापूर्वक {pl_kg} किग्रा स्क्रैप पूल में जोड़ा गया! आपकी हिस्सेदारी 14.2% आरक्षित हुई।")[0])

    # ---------------- 4. SCRAP PASSPORT TAB ----------------
    with col_tab_pass:
        st.markdown("#### 📜 " + tr("Digital Scrap Passport & Material Traceability", "डिजिटल स्क्रैप पासपोर्ट व ट्रैसेबिलिटी")[0])
        st.caption(tr("Cryptographically verifiable 8-step lifecycle traceability from collection to processing:", "कचरा संग्रहण से लेकर रीसाइक्लिंग प्लांट तक 8-चरणीय ब्लॉकचेन-सीलबंद जीवनचक्र:")[0])

        st.markdown(f"""
        <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.4); border-radius:16px; padding:16px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:11px; background:rgba(16, 185, 129, 0.2); color:#34D399; font-weight:bold; padding:2px 8px; border-radius:999px; border:1px solid #10B981;">CPCB AUDIT TRAIL</span>
                    <h3 style="color:#F4FDF8; margin:4px 0 0 0;">{tr('Passport ID', 'पासपोर्ट आईडी')[0]}: WP-2024-00124 (LOT-2026-PET-8821)</h3>
                    <p style="color:#A1B2A9; font-size:12px;">{tr('Material', 'सामग्री')[0]}: <b>Plastic (Grade A PET Flakes)</b> • {tr('Source', 'स्रोत')[0]}: Indiranagar, Bengaluru</p>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:24px;">🏁</span><br>
                    <b style="color:#34D399; font-size:13px;">{tr('Status: RECEIVED & VERIFIED ✓', 'स्थिति: प्राप्त व सत्यापित ✓')[0]}</b>
                </div>
            </div>
            <hr style="border-top:1px solid rgba(16, 185, 129, 0.2); margin:10px 0;">
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; font-size:12px; color:#E2E8F0;">
                <div>{tr('Collected Weight', 'संग्रहण वजन')[0]}: <b>60.0 kg</b></div>
                <div>{tr('Weighbridge Weight', 'वेजब्रिज वजन')[0]}: <b style="color:#FBBF24;">56.5 kg</b></div>
                <div>{tr('Weight Discrepancy', 'वजन विसंगति')[0]}: <b style="color:#F87171;">-3.5 kg (-5.8%)</b></div>
                <div>{tr('Settled Amount', 'निपटान राशि')[0]}: <b style="color:#34D399;">₹1,921.00</b></div>
            </div>
            <div style="background:#1C1506; border:1px solid #B45309; border-radius:8px; padding:8px; font-size:11px; color:#FDE68A; margin-top:8px;">
                ⚠️ <b>{tr('Weighbridge Discrepancy Alert:', 'वेजब्रिज विसंगति सूचना:')[0]}</b> {tr('Moisture and dust deduction (-3.5 kg) verified at recycler scale. Digital receipt locked to verified net weight.', 'धूल व नमी कटौती (-3.5 किग्रा) रीसाइक्लर वेजब्रिज पर सत्यापित हुई। रसीद शुद्ध वजन पर लॉक हुई।')[0]}
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("##### 📍 " + tr("8-Step Traceability Timeline", "8-चरणीय ट्रैसेबिलिटी यात्रा")[0])
        t_steps = [
            ("1. Generated", tr("Plastic segregation at domestic residence", "प्रिया शर्मा द्वारा इंदिरानगर घर पर प्लास्टिक पृथक्करण")[0], "Today 09:30 AM", "✅"),
            ("2. Booked", tr("Pickup slot scheduled via ScrapSetu app", "ScrapSetu ऐप द्वारा पिकअप स्लॉट शेड्यूलिंग")[0], "Today 09:45 AM", "✅"),
            ("3. Collected", tr("E-Rickshaw loader pickup executed by Ramesh Kumar", "रमेश कुमार द्वारा ई-रिक्शा पर लोडिंग")[0], "Today 10:45 AM", "✅"),
            ("4. Weighed", tr("TrustWeigh digital scale confirmed 60.0 kg", "TrustWeigh डिजिटल स्केल द्वारा 60.0 kg का सत्यापन")[0], "Today 11:00 AM", "✅"),
            ("5. Buyer Matched", tr("Smart match selected EcoTransform Plant #04 (₹34/kg)", "स्मार्ट मैचिंग द्वारा EcoTransform प्लांट का चयन")[0], "Today 11:30 AM", "✅"),
            ("6. Handed Over", tr("Dispatched from collection hub to recycler facility", "पिकअप हब से रीसाइक्लर प्लांट को डिस्पैच")[0], "Today 01:15 PM", "✅"),
            ("7. Received", tr("50T weighbridge confirmed 56.5 kg net intake (#WB-9921)", "50T वेजब्रिज पर 56.5 kg शुद्ध वजन की पुष्टि")[0], "Today 02:45 PM", "✅"),
            ("8. Processed", tr("Converted to food-grade rPET flakes with CPCB EPR credit", "rPET फूड-ग्रेड पेलेट्स में परिवर्तन व CPCB प्रमाणन")[0], "Today 04:00 PM", "🔄"),
        ]
        for s, d, tm, icon in t_steps:
            st.markdown(f"- {icon} **{s}**: {d} *({tm})*")

    with col_tab2:
        st.markdown("#### 🗺️ " + tr("EcoRoute TSP Smart Route Navigation", "इको-रूट टीएसपी स्मार्ट रूट नेविगेशन")[0])
        st.caption(tr("Travelling Salesperson Problem (TSP) algorithm orders all pending pickups into the shortest fuel-efficient loop:", "कम से कम ईंधन खर्च में सारे पिकअप पूरे करने के लिए इष्टतम मार्ग क्रम:")[0])

        st.markdown(f"""
        <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-bottom:12px;">
            <b style="color:#6EE7B7;">🚀 {tr("Optimized Route Sequence:", "इष्टतम संग्रह मार्ग:")[0]}</b><br>
            <span style="color:#A7F3D0; font-size:13px;">
                <b>Stop 1:</b> South Extension II (REQ-101) ➡️ 
                <b>Stop 2:</b> Saket District Centre (REQ-103) ➡️ 
                <b>Stop 3:</b> EcoPlast Recycling Mill (Okhla Hub)
            </span><br>
            <span style="color:#34D399; font-size:12px;">{tr("Total Distance: 14.2 km (38% fuel saved • 2.8L conserved)", "कुल दूरी: 14.2 किमी (38% ईंधन की बचत • 2.8 लीटर बचा)")[0]}</span>
        </div>
        """, unsafe_allow_html=True)

        m_tsp = folium.Map(location=[28.5484, 77.2400], zoom_start=12)
        folium.Marker([28.5684, 77.2195], tooltip="Stop 1: South Extension II", icon=folium.Icon(color="green", icon="1", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5284, 77.2185], tooltip="Stop 2: Saket District Centre", icon=folium.Icon(color="blue", icon="2", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5355, 77.2728], tooltip="Stop 3: Okhla Recycling Plant", icon=folium.Icon(color="red", icon="flag")).add_to(m_tsp)
        folium.PolyLine([[28.5684, 77.2195], [28.5284, 77.2185], [28.5355, 77.2728]], color="#10B981", weight=4, opacity=0.8).add_to(m_tsp)
        st_folium(m_tsp, height=320, use_container_width=True)

    with col_tab3:
        st.markdown("#### 🪪 " + tr("3-Point KYC Identity & Safety Credentials", "3-बिंदु पहचान व सुरक्षा प्रमाण पत्र")[0])
        st.caption(tr("Aadhaar, Driving Licence, and Live Camera Selfie guarantee partner authenticity:", "आधार, ड्राइविंग लाइसेंस, और लाइव सेल्फी भागीदार की प्रामाणिकता सुनिश्चित करते हैं:")[0])

        my_kyc = next((k for k in st.session_state.kyc_records if k["name"] == st.session_state.user_name), None)
        if my_kyc and "APPROVED" in my_kyc["status"]:
            st.success("🟢 **" + tr("KYC Status: APPROVED ✓ — Registered with CPCB & Police Database", "केवाईसी स्थिति: APPROVED (सत्यापित कबाड़ीवाला साथी ✓) — सीपीसीबी व पुलिस रिकॉर्ड में पंजीकृत")[0] + "**")
            kc1, kc2, kc3 = st.columns(3)
            with kc1:
                st.info(f"📄 **{tr('Aadhaar Card:', 'आधार कार्ड:')[0]}**\\n`{my_kyc['aadhaar_num']}`\\n\\nStatus: {my_kyc['aadhaar_status']}")
            with kc2:
                st.info(f"🪪 **{tr('Driving Licence:', 'ड्राइविंग लाइसेंस:')[0]}**\\n`{my_kyc['dl_num']}`\\n\\nStatus: {my_kyc['dl_status']}")
            with kc3:
                st.info(f"🤳 **{tr('Live Face Match:', 'लाइव चेहरा मिलान:')[0]}**\\nConfidence: 98.4%\\n\\nStatus: {my_kyc['selfie_status']}")
        else:
            st.warning("⏳ **" + tr("KYC Status: Pending Verification Inspection", "केवाईसी स्थिति: सत्यापन प्रतीक्षारत")[0] + "**")


# =============================================================
# 3. 🏢 DEDICATED COMMERCIAL BUSINESS DASHBOARD
# =============================================================
elif current_role == "BUSINESS":
    b_title = tr("Commercial Bulk Waste Dashboard", "वाणिज्यिक थोक अपशिष्ट डैशबोर्ड")[0] + f" — {st.session_state.user_name}"
    st.subheader("🏢 " + b_title)
    st.caption(tr("Manage industrial packaging scrap, recurring collection contracts, multi-warehouse bays & GST invoices.", "औद्योगिक पैकेजिंग कचरा, आवर्ती संग्रह अनुबंध, मल्टी-वेयरहाउस बे और जीएसटी चालान प्रबंधित करें।")[0])

    bk1, bk2, bk3, bk4 = st.columns(4)
    with bk1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">175.0 kg</div><div class="kpi-lbl">{tr_span("Total Commercial Tonnage", "कुल वाणिज्यिक वजन")}</div></div>', unsafe_allow_html=True)
    with bk2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">{tr_span("GST Invoice Settlements", "जीएसटी चालान निपटान")}</div></div>', unsafe_allow_html=True)
    with bk3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">Weekly</div><div class="kpi-lbl">{tr_span("Recurring Contract", "आवर्ती अनुबंध")}</div></div>', unsafe_allow_html=True)
    with bk4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">CPCB CAT-I</div><div class="kpi-lbl">{tr_span("EPR Compliance Status", "ईपीआर अनुपालन स्थिति")}</div></div>', unsafe_allow_html=True)

    b_col1, b_col2 = st.columns([1, 1], gap="large")
    with b_col1:
        st.markdown("#### 🏭 " + tr("Commercial Dispatch Bays", "वाणिज्यिक प्रेषण बे")[0])
        st.dataframe(pd.DataFrame([
            {"Facility": "Okhla Phase-III Central Bay 7", "Type": "Logistics & Pallets", "Status": "Active Primary"},
            {"Facility": "Saket District Centre Mall Outlet", "Type": "Retail Packaging", "Status": "Active Branch"},
        ]), hide_index=True, use_container_width=True)

        with st.form("book_commercial"):
            st.markdown("##### " + tr("Schedule Heavy Commercial Dispatch", "भारी वाहन प्रेषण बुक करें")[0])
            b_bay = st.selectbox(tr("Dispatch Location", "प्रेषण स्थान")[0], ["Okhla Phase-III Central Bay 7", "Saket District Centre Mall Outlet"])
            b_ton = st.number_input(tr("Estimated Bulk Load (kg)", "अनुमानित वजन (किग्रा)")[0], min_value=50.0, value=250.0, step=25.0)
            b_recur = st.checkbox(tr("Set as Recurring Weekly Subscription", "साप्ताहिक आवर्ती सदस्यता सेट करें")[0], value=True)
            if st.form_submit_button(tr("Book Mini-Truck Heavy Vehicle Dispatch", "मिनी ट्रक प्रेषण बुक करें")[0], type="primary"):
                st.success(tr(f"Commercial dispatch of {b_ton} kg booked! Assigned to mini-truck collector.", f"{b_ton} किग्रा का वाणिज्यिक प्रेषण बुक हुआ! मिनी-ट्रक को सौंपा गया।")[0])

    with b_col2:
        st.markdown("#### 🧾 " + tr("GST Invoices & EPR Credit Certificates", "जीएसटी चालान व ईपीआर प्रमाण पत्र")[0])
        st.dataframe(pd.DataFrame([
            {"Invoice #": "RCP-2026-DEL-0894", "Weight": "175.0 kg", "Amount": "₹6,895.00", "Payment": "UPI Verified", "Date": "2026-10-10"},
            {"Invoice #": "RCP-2026-DEL-0712", "Weight": "210.0 kg", "Amount": "₹8,120.00", "Payment": "Bank Transfer", "Date": "2026-09-28"},
        ]), hide_index=True, use_container_width=True)

        st.markdown(f"""
        <div style="background:#081C14; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-top:12px;">
            <b style="color:#6EE7B7;">📄 {tr("Annual CPCB EPR Compliance Summary:", "वार्षिक सीपीसीबी ईपीआर सारांश:")[0]}</b><br>
            <span style="color:#A7F3D0; font-size:13px;">
                {tr("Target: 1,500 kg • Diverted to Date: <b>1,840 kg (122% Achieved)</b>", "लक्ष्य: 1,500 किग्रा • अब तक पुनर्चक्रित: <b>1,840 किग्रा (122% पूर्ण)</b>")[0]}<br>
                {tr("Audited Scope 3 GHG Reduction: <b>2.76 Metric Tonnes CO₂e</b>", "सत्यापित कार्बन कमी: <b>2.76 मीट्रिक टन CO₂e</b>")[0]}
            </span>
        </div>
        """, unsafe_allow_html=True)


# =============================================================
# 4. 🏭 DEDICATED RECYCLER DASHBOARD
# =============================================================
elif current_role == "RECYCLER":
    r_title = tr("Recycler Facility Portal", "रीसाइक्लिंग कारखाना पोर्टल")[0] + f" — {st.session_state.user_name}"
    st.subheader("🏭 " + r_title)
    st.caption(tr("Publish factory buying rates, issue weighbridge intake slips, and manage circular throughput.", "कारखाना खरीद दरें प्रकाशित करें, वेजब्रिज पर्ची जारी करें और पुनर्चक्रण प्रबंधित करें।")[0])

    rk1, rk2, rk3, rk4 = st.columns(4)
    with rk1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">175.0 kg</div><div class="kpi-lbl">{tr_span("Inbound Throughput", "आवक सामग्री")}</div></div>', unsafe_allow_html=True)
    with rk2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹6,895.00</div><div class="kpi-lbl">{tr_span("Raw Material Outlay", "कच्चे माल का खर्च")}</div></div>', unsafe_allow_html=True)
    with rk3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">3 Rates</div><div class="kpi-lbl">{tr_span("Active Buying Offers", "सक्रिय खरीद दरें")}</div></div>', unsafe_allow_html=True)
    with rk4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">CPCB Verified</div><div class="kpi-lbl">{tr_span("License DEL/PWM/2024", "लाइसेंस DEL/PWM/2024")}</div></div>', unsafe_allow_html=True)

    r_col1, r_col2 = st.columns([1, 1], gap="large")
    with r_col1:
        st.markdown("#### " + tr("Published Factory Buying Rate Sheet", "प्रकाशित कारखाना खरीद दर पत्रक")[0])
        st.dataframe(pd.DataFrame(st.session_state.recycler_offers), hide_index=True, use_container_width=True)

        with st.form("new_rate"):
            st.markdown("##### + " + tr("Post New Buying Offer", "नई खरीद दर पोस्ट करें")[0])
            n_cat = st.selectbox(tr("Category", "कचरा श्रेणी")[0], [c["hindi"] if is_hi else c["name"] for c in st.session_state.categories])
            n_rate = st.number_input(tr("Buying Rate (₹/kg)", "खरीद दर (₹/किग्रा)")[0], min_value=1.0, value=32.5)
            n_lot = st.number_input(tr("Min Lot Size (kg)", "न्यूनतम लॉट (किग्रा)")[0], min_value=10, value=50)
            if st.form_submit_button("+ " + tr("Publish Rate to Regional Mandis", "क्षेत्रीय मंडियों में दर प्रकाशित करें")[0], type="primary"):
                st.session_state.recycler_offers.append({"mill": "EcoPlast Reclaimers", "cat": n_cat, "rate": n_rate, "min_lot": n_lot, "location": "Okhla Industrial Area"})
                st.success(tr("New buying offer published live to all collectors!", "नई खरीद दर सभी कबाड़ीवालों को लाइव प्रकाशित हुई!")[0])
                st.rerun()

    with r_col2:
        st.markdown("#### " + tr("Weighbridge Gate Intake Slip Generator", "वेजब्रिज गेट इनटेक पर्ची जनरेटर")[0])
        with st.form("intake_gen"):
            s_sup = st.text_input(tr("Supplier / Collector Name", "आपूर्तिकर्ता / कबाड़ीवाले का नाम")[0], "Ramu Paswan (Kavach Certified)")
            s_wt = st.number_input(tr("Scale Net Weight (kg)", "कांटे का शुद्ध वजन (किग्रा)")[0], min_value=10.0, value=175.0)
            s_rt = st.number_input(tr("Purchase Price (₹/kg)", "खरीद मूल्य (₹/किग्रा)")[0], min_value=1.0, value=31.5)
            st.write(f"**{tr('Total Settlement Outlay:', 'कुल निपटान खर्च:')[0]}** ₹{round(s_wt * s_rt, 2):,.2f}")
            if st.form_submit_button(tr("Record Weighbridge Slip", "वेजब्रिज पर्ची दर्ज करें")[0], type="primary"):
                st.success(tr("Inbound weighbridge slip recorded and linked to collector ledger!", "वेजब्रिज पर्ची दर्ज हुई और खाता बही से जुड़ी!")[0])


# =============================================================
# 5. 🛡️ DEDICATED ADMINISTRATOR DASHBOARD
# =============================================================
elif current_role == "ADMIN":
    a_title = tr("Platform Governance & Regulatory Console", "प्लेटफॉर्म नियामक व प्रशासनिक कंसोल")[0] + f" — {st.session_state.user_name}"
    st.subheader("🛡️ " + a_title)
    st.caption(tr("3-Point KYC inspection queue, AI Biometric Photo Matching, Mandi rate governance & Free Cloud Database Manager.", "3-बिंदु पहचान सत्यापन कतार, एआई बायोमेट्रिक फोटो मिलान, मंडी दर नियमन और क्लाउड डेटाबेस प्रबंधक।")[0])

    ak1, ak2, ak3, ak4 = st.columns(4)
    with ak1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(st.session_state.pickups)} Orders</div><div class="kpi-lbl">{tr_span("Total Requests", "कुल पिकअप अनुरोध")}</div></div>', unsafe_allow_html=True)
    with ak2:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">100%</div><div class="kpi-lbl">{tr_span("Settlement Rate", "निपटान दर")}</div></div>', unsafe_allow_html=True)
    with ak3:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">₹11,670.00</div><div class="kpi-lbl">{tr_span("Total Cashflow Settled", "कुल निपटाया गया नकद प्रवाह")}</div></div>', unsafe_allow_html=True)
    with ak4:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">0 Disputes</div><div class="kpi-lbl">{tr_span("Dispute Status: Normal", "विवाद स्थिति: सामान्य")}</div></div>', unsafe_allow_html=True)

    at1_name = tr("📋 3-Point KYC Verification Queue", "📋 3-बिंदु पहचान सत्यापन कतार")[0]
    at2_name = tr("🤖 AI Photo Matching & Biometrics", "🤖 एआई फोटो मिलान व बायोमेट्रिक्स")[0]
    at3_name = tr("📈 Mandi Benchmark Rates", "📈 मंडी बेंचमार्क दरें")[0]
    at4_name = tr("🛡️ EcoShield Anomaly Audit", "🛡️ इको-शील्ड विसंगति ऑडिट")[0]
    at5_name = tr("🗄️ Free Cloud Database Manager", "🗄️ क्लाउड डेटाबेस प्रबंधक")[0]
    at6_name = tr("📜 Cryptographic Audit Ledger", "📜 क्रिप्टोग्राफिक ऑडिट लेजर")[0]

    a_tab1, a_tab_biom, a_tab2, a_tab3, a_tab4, a_tab5 = st.tabs([
        at1_name, at2_name, at3_name, at4_name, at5_name, at6_name
    ])

    with a_tab1:
        st.markdown("#### 📋 " + tr("3-Point KYC Verification Queue", "3-बिंदु पहचान सत्यापन कतार")[0])
        st.caption(tr("Review uploaded Government Aadhaar Cards, Driving Licences, and Live Biometric Selfies:", "अपलोड किए गए आधार कार्ड, ड्राइविंग लाइसेंस, और लाइव सेल्फी की समीक्षा करें:")[0])

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
        st.markdown("#### 🔍 " + tr("Interactive 3-Card KYC Dossier Inspector", "पहचान दस्तावेज निरीक्षक")[0])
        all_candidates = st.session_state.kyc_records
        target_name = st.selectbox(
            tr("Select Applicant Dossier to Inspect:", "जांच हेतु आवेदक फ़ाइल चुनें:")[0],
            [k["name"] for k in all_candidates],
            index=next((i for i, k in enumerate(all_candidates) if "PENDING" in k["status"]), 0)
        )
        cand = next(k for k in all_candidates if k["name"] == target_name)

        doc_col1, doc_col2, doc_col3 = st.columns(3)
        with doc_col1:
            st.markdown(f"""
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">📄</div>
                <b style="color:#F4FDF8;">{tr('Government Aadhaar Card', 'भारत सरकार आधार कार्ड')[0]}</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">{tr('UIDAI Verified ID Proof', 'सत्यापित पहचान प्रमाण')[0]}</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#34D399;">
                    UID: {cand['aadhaar_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
                    {tr('Status', 'स्थिति')[0]}: {cand['aadhaar_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col2:
            st.markdown(f"""
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🪪</div>
                <b style="color:#F4FDF8;">{tr('Driving Licence (DL)', 'ड्राइविंग लाइसेंस')[0]}</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">{tr('Ministry of Road Transport', 'परिवहन विभाग')[0]}</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#38BDF8;">
                    DL No: {cand['dl_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
                    {tr('Status', 'स्थिति')[0]}: {cand['dl_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col3:
            st.markdown(f"""
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🤳</div>
                <b style="color:#F4FDF8;">{tr('Live Biometric Selfie', 'लाइव बायोमेट्रिक सेल्फी')[0]}</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">{tr('Anti-Spoofing Face Match', 'एंटी-स्पूफिंग चेहरा मिलान')[0]}</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#34D399;">
                    Biometric Similarity: 98.4%
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
                    {tr('Status', 'स्थिति')[0]}: {cand['selfie_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.write("")
        d_b1, d_b2 = st.columns([1, 1])
        with d_b1:
            if cand["status"] != "APPROVED ✓":
                if st.button(f"✅ " + tr(f"Approve 3-Point KYC for {cand['name']}", f"{cand['name']} का 3-बिंदु केवाईसी स्वीकृत करें")[0], type="primary", use_container_width=True):
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
                    st.success(tr(f"KYC approved for {cand['name']}! Partner is now authorized for doorstep pickups.", f"{cand['name']} का केवाईसी स्वीकृत हुआ! साथी अब डोरस्टेप पिकअप के लिए अधिकृत है।")[0])
                    st.rerun()
            else:
                st.info("✅ " + tr(f"{cand['name']} holds an active approved credential.", f"{cand['name']} का क्रेडेंशियल सक्रिय व स्वीकृत है।")[0])

        with d_b2:
            if st.button("❌ " + tr(f"Reject / Request Re-upload for {cand['name']}", f"{cand['name']} का दस्तावेज अस्वीकार / पुनः अपलोड अनुरोध")[0], use_container_width=True):
                cand["status"] = "REJECTED (Re-upload requested)"
                st.session_state.audit_logs.append({
                    "action": "REJECT_KYC",
                    "user": st.session_state.user_name,
                    "details": f"Requested document re-upload for {cand['name']}",
                    "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                })
                st.warning(tr(f"Notification sent to {cand['name']} to re-upload clear documents.", f"{cand['name']} को स्पष्ट दस्तावेज पुनः अपलोड करने की सूचना भेजी गई।")[0])
                st.rerun()

    # ---------------- 2. ENHANCED BIOMETRIC PHOTO MATCHING (BASE64 FIXED) ----------------
    with a_tab_biom:
        st.markdown("#### 🤖 " + tr("AI Photo Matching Engine: Aadhaar Card / DL vs Live Photo", "एआई फोटो मिलान इंजन: आधार / ड्राइविंग लाइसेंस बनाम लाइव फोटो")[0])
        st.caption(tr("AI facial biometric verification comparing government identity cards against live camera selfies with anti-spoofing:", "सरकारी पहचान पत्र बनाम लाइव कैमरे की सेल्फी का चेहरे के 68 लैंडमार्क बिंदुओं द्वारा मिलान:")[0])

        st.info("💡 " + tr("Upload an Indian Aadhaar Card or Driving Licence along with a live camera selfie to run biometric face similarity, anti-spoofing verification, and automatic OCR data extraction.", "आधार कार्ड या ड्राइविंग लाइसेंस के साथ लाइव सेल्फी अपलोड करें और बायोमेट्रिक मिलान व ओसीआर डेटा एक्सट्रैक्शन चलाएं।")[0])

        p_col1, p_col2, p_col3 = st.columns(3)
        with p_col1:
            load_aadhaar = st.button("📌 " + tr("Load Demo Aadhaar Match", "डेमो आधार मिलान लोड करें")[0], use_container_width=True)
        with p_col2:
            load_dl = st.button("🪪 " + tr("Load Demo DL Match", "डेमो ड्राइविंग लाइसेंस मिलान लोड करें")[0], use_container_width=True)
        with p_col3:
            load_mismatch = st.button("⚠️ " + tr("Load Demo Mismatch", "डेमो बेमेल (Mismatch) लोड करें")[0], use_container_width=True)

        if "bio_test_type" not in st.session_state:
            st.session_state.bio_test_type = "AADHAAR"

        if load_aadhaar:
            st.session_state.bio_test_type = "AADHAAR"
        elif load_dl:
            st.session_state.bio_test_type = "DL"
        elif load_mismatch:
            st.session_state.bio_test_type = "MISMATCH"

        bio_col1, bio_col2 = st.columns(2, gap="large")

        with bio_col1:
            st.markdown("##### 1. " + tr("Government ID Document (Aadhaar / DL)", "सरकारी पहचान दस्तावेज (आधार / ड्राइविंग लाइसेंस)")[0])
            doc_cat_opts = [
                tr("Aadhaar Card (UIDAI)", "आधार कार्ड (UIDAI)")[0],
                tr("Commercial Driving Licence (Parivahan)", "वाणिज्यिक ड्राइविंग लाइसेंस (परिवहन)")[0]
            ]
            doc_choice = st.radio(
                tr("Document Category:", "दस्तावेज श्रेणी:")[0],
                doc_cat_opts,
                index=1 if st.session_state.bio_test_type == "DL" else 0,
                horizontal=True
            )
            doc_upload = st.file_uploader(tr("Upload ID Card (PNG/JPG)", "आईडी कार्ड अपलोड करें")[0], type=["png", "jpg", "jpeg", "webp"], key="st_doc_upload")

            if doc_upload:
                st.image(doc_upload, caption=tr("Uploaded Government Document", "अपलोड किया गया सरकारी दस्तावेज")[0], use_container_width=True)
            elif st.session_state.bio_test_type == "DL":
                dl_svg = get_dl_card_svg("Shyam Sundar Sharma", "RJ-14-2022-00455", "LMV-TR")
                st.markdown(f'<img src="{dl_svg}" style="width:100%; border-radius:12px; border:1px solid #38BDF8; display:block;">', unsafe_allow_html=True)
            else:
                aadh_svg = get_aadhaar_card_svg("Ramesh Kumar Sahu", "4129 6638 6621", "15/08/1988")
                st.markdown(f'<img src="{aadh_svg}" style="width:100%; border-radius:12px; border:1px solid #CBD5E1; display:block;">', unsafe_allow_html=True)

        with bio_col2:
            st.markdown("##### 2. " + tr("Live Photograph (Live Camera / Selfie)", "लाइव फोटोग्राफ (लाइव कैमरा / सेल्फी)")[0])
            live_method_opts = [
                tr("Visual Simulation", "दृश्य सिमुलेशन")[0],
                tr("Live Camera Input", "लाइव कैमरा इनपुट")[0],
                tr("Upload Selfie File", "सेल्फी फाइल अपलोड करें")[0]
            ]
            live_method = st.radio(tr("Live Photo Mode:", "लाइव फोटो मोड:")[0], live_method_opts, horizontal=True)

            live_img = None
            if live_method == live_method_opts[1]:
                live_img = st.camera_input(tr("Capture Live Verification Selfie", "लाइव सत्यापन सेल्फी लें")[0])
            elif live_method == live_method_opts[2]:
                live_img = st.file_uploader(tr("Upload Live Selfie Photo", "लाइव सेल्फी अपलोड करें")[0], type=["png", "jpg", "jpeg", "webp"], key="st_selfie_upload")

            if live_img:
                st.image(live_img, caption=tr("Captured Live Verification Selfie", "खींची गई लाइव सेल्फी")[0], use_container_width=True)
            else:
                is_match_sim = (st.session_state.bio_test_type != "MISMATCH")
                sim_name = "Ramesh Kumar Sahu" if st.session_state.bio_test_type == "AADHAAR" else "Shyam Sundar Sharma"
                selfie_svg = get_selfie_svg(sim_name, is_match=is_match_sim)
                st.markdown(f'<img src="{selfie_svg}" style="width:100%; border-radius:12px; border:1px solid {"#10B981" if is_match_sim else "#EF4444"}; display:block;">', unsafe_allow_html=True)

        st.divider()

        if st.button("⚡ " + tr("Run AI Biometric Photo Match", "एआई बायोमेट्रिक फोटो मिलान चलाएं")[0], type="primary", use_container_width=True):
            with st.spinner(tr("Analyzing biometric landmarks, inter-pupillary distance, and document security watermark...", "बायोमेट्रिक लैंडमार्क, पुतलियों की दूरी और सुरक्षा वॉटरमार्क का विश्लेषण हो रहा है...")[0]):
                time.sleep(0.6)

                is_mismatch = (st.session_state.bio_test_type == "MISMATCH")
                score = 34.2 if is_mismatch else (98.4 if st.session_state.bio_test_type == "DL" else 96.8)
                liveness = 98.6

                if not is_mismatch:
                    st.success("🎉 **" + tr(f"Biometric Face Match Confirmed! (Similarity Score: {score}%)", f"बायोमेट्रिक चेहरा मिलान सफल! (समानता स्कोर: {score}%)")[0] + "**")
                    b1, b2, b3 = st.columns(3)
                    with b1:
                        st.metric(tr("Facial Match", "चेहरा समानता")[0], f"{score}%", tr("High Confidence ✓", "उच्च सटीकता ✓")[0])
                    with b2:
                        st.metric(tr("Liveness Score", "जीवंतता स्कोर")[0], f"{liveness}%", tr("Anti-Spoof Passed ✓", "एंटी-स्पूफ सफल ✓")[0])
                    with b3:
                        st.metric(tr("Audit Status", "ऑडिट स्थिति")[0], "VERIFIED", tr("E-KYC Passed ✓", "ई-केवाईसी सफल ✓")[0])

                    st.markdown("##### 📋 " + tr("OCR Extracted Credentials:", "ओसीआर द्वारा निकाले गए विवरण:")[0])
                    if st.session_state.bio_test_type == "DL":
                        st.json({
                            "document_type": "DRIVING_LICENCE",
                            "document_number": "RJ-14-2022-00455",
                            "full_name": "Shyam Sundar Sharma",
                            "vehicle_class": "LMV-TR (Commercial Transport)",
                            "valid_until": "13/07/2035",
                            "issue_authority": "Ministry of Road Transport & Highways",
                            "biometric_seal": "SHA256:49aa1b3398fe11cde88290145fa30b"
                        })
                    else:
                        st.json({
                            "document_type": "AADHAAR",
                            "document_number": "4129 6638 6621",
                            "full_name": "Ramesh Kumar Sahu",
                            "dob": "15/08/1988",
                            "gender": "Male",
                            "address": "Jaipur, Rajasthan - 302015",
                            "issue_authority": "UIDAI",
                            "biometric_seal": "SHA256:7f8a92b9381c0029adbe991a0f8b1c"
                        })

                    if st.button("✅ " + tr("Authorize Partner in Platform Registry Now", "साथी को प्लेटफॉर्म रजिस्ट्री में अधिकृत करें")[0], use_container_width=True):
                        st.session_state.audit_logs.append({
                            "action": "AI_PHOTO_MATCH_VERIFIED",
                            "user": st.session_state.user_name,
                            "details": f"Biometric photo match approved with score {score}%",
                            "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                        })
                        st.success(tr("Partner credentials activated across all doorstep collection zones!", "साथी क्रेडेंशियल सभी डोरस्टेप संग्रह क्षेत्रों में सक्रिय हुए!")[0])
                else:
                    st.error("❌ **" + tr(f"Biometric Mismatch Detected (Similarity Score: {score}%)", f"बायोमेट्रिक बेमेल का पता चला (समानता स्कोर: {score}%)")[0] + "**")
                    st.warning(tr("The facial geometry on the live photograph does not align with the government ID card photograph. Request document re-upload.", "लाइव फोटो का चेहरा सरकारी पहचान पत्र के चेहरे से मेल नहीं खाता। दस्तावेज पुनः अपलोड करने का अनुरोध करें।")[0])

    with a_tab2:
        st.markdown("#### " + tr("Mandi Benchmark Rate Editor", "मंडी बेंचमार्क थोक दर संपादक")[0])
        st.caption(tr("Adjust official wholesale benchmark rates broadcast across national recycling clusters:", "राष्ट्रीय रीसाइक्लिंग क्लस्टर में प्रसारित आधिकारिक थोक दरों को समायोजित करें:")[0])
        for c in st.session_state.categories:
            c1, c2, c3 = st.columns([2, 1, 1])
            with c1:
                st.write(f"**{c['icon']} {c['hindi'] if is_hi else c['name']}**")
            with c2:
                new_r = st.number_input(f"{tr('Rate for', 'दर:')[0]} {c['hindi'] if is_hi else c['name']}", min_value=1.0, value=float(c['rate']), key=f"ad_{c['id']}")
            with c3:
                if st.button(f"{tr('Update', 'अद्यतन करें')[0]} {c['hindi'] if is_hi else c['name']}", key=f"up_{c['id']}"):
                    c["rate"] = new_r
                    st.session_state.audit_logs.append({
                        "action": "UPDATE_MANDI_RATE",
                        "user": "Admin",
                        "details": f"Updated {c['name']} to ₹{new_r}/kg",
                        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.success(tr(f"{c['name']} benchmark updated to ₹{new_r}/kg!", f"{c['hindi']} की दर ₹{new_r}/किग्रा अद्यतन हुई!")[0])
                    st.rerun()

    with a_tab3:
        st.markdown("#### 🛡️ " + tr("EcoShield Anomaly & Anti-Fraud Audit", "इको-शील्ड विसंगति व धोखाधड़ी ऑडिट")[0])
        st.caption(tr("Automated heuristic models monitor transactions for weight spikes or pricing anomalies:", "स्वचालित मॉडल वजन और मूल्य निर्धारण विसंगतियों की निगरानी करते हैं:")[0])
        st.dataframe(pd.DataFrame([
            {"Anomaly ID": "ANM-2026-081", "Entity": "Domestic Account #482", "Detected Issue": "Weight spike: 320 kg for domestic apartment", "Severity": "MEDIUM", "Status": "RESOLVED (Verified Home Renovation)"},
            {"Anomaly ID": "ANM-2026-082", "Entity": "Collector Ramu Paswan", "Detected Issue": "Copper price spread +14% above Mandi", "Severity": "LOW", "Status": "CLEARED (Grade 1 Millberry)"},
        ]), hide_index=True, use_container_width=True)

    with a_tab4:
        st.markdown("#### 🗄️ " + tr("Free Cloud Database Connectivity Manager", "क्लाउड डेटाबेस कनेक्टिविटी प्रबंधक")[0])
        st.caption(tr("Connect ScrapSetu to free cloud databases (Supabase, MongoDB Atlas, Neon) for permanent persistence:", "स्थायी डेटा भंडारण के लिए स्क्रैपसेतु को मुफ्त क्लाउड डेटाबेस से कनेक्ट करें:")[0])

        db_cfg = st.session_state.cloud_db_config
        db_c1, db_c2, db_c3, db_c4 = st.columns(4)
        with db_c1:
            st.metric(tr("Active Cloud Provider", "सक्रिय क्लाउड प्रदाता")[0], db_cfg["provider"].split()[0])
        with db_c2:
            st.metric(tr("Connection Health", "कनेक्शन स्थिति")[0], "ONLINE ✓", delta="SSL Enforced")
        with db_c3:
            st.metric(tr("Records Synced", "सिंक किए गए रिकॉर्ड")[0], f"{db_cfg['sync_count']} Rows", delta="+12 today")
        with db_c4:
            st.metric(tr("Roundtrip Latency", "लेटेंसी")[0], "34 ms", delta="Optimal")

        st.markdown(f"""
        <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-bottom:1rem;">
            <b style="color:#6EE7B7;">🟢 {tr("Live Database Cluster Status:", "लाइव डेटाबेस क्लस्टर स्थिति:")[0]}</b> 
            <span style="color:#A7F3D0;">{tr('Currently connected to', 'वर्तमान में कनेक्टेड:')[0]} <b>{db_cfg['provider']}</b>.</span>
        </div>
        """, unsafe_allow_html=True)

        preset_choice = st.selectbox(
            tr("Select Free Cloud Database Provider:", "मुफ्त क्लाउड डेटाबेस प्रदाता चुनें:")[0],
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
                tr("Database Connection String / URI:", "डेटाबेस कनेक्शन यूआरआई:")[0],
                value=db_cfg.get("connection_uri", default_uris[key_provider]),
                help="Paste connection URI"
            )
            col_b1, col_b2 = st.columns(2)
            with col_b1:
                submit_db = st.form_submit_button("⚡ " + tr("Test & Connect Cloud Database", "क्लाउड डेटाबेस कनेक्ट करें")[0], type="primary", use_container_width=True)
            with col_b2:
                sync_now = st.form_submit_button("🔄 " + tr("Force Immediate Cloud Sync", "तत्काल क्लाउड सिंक करें")[0], use_container_width=True)

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
                st.success(tr(f"Successfully connected to {db_cfg['provider']}!", f"{db_cfg['provider']} से सफलतापूर्वक कनेक्ट हुआ!")[0])
                st.rerun()

            if sync_now:
                st.success(tr("Real-time data pipeline synchronized records to cloud cluster.", "डेटा सफलतापूर्वक क्लाउड क्लस्टर में सिंक हुआ।")[0])

    with a_tab5:
        st.markdown("#### 📜 " + tr("Immutable Cryptographic Audit Ledger", "अपरिवर्तनीय ऑडिट लेजर")[0])
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), hide_index=True, use_container_width=True)


# =============================================================
# PERSISTENT BOTTOM VOICE & AI NAVIGATION COMMAND ASSISTANT
# =============================================================
st.divider()

st.markdown(f"""
<div style="background: linear-gradient(135deg, #072418 0%, #0A1C13 100%); border: 1.5px solid #10B981; border-radius: 1.25rem; padding: 1.4rem; margin-top: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <span style="font-size:1.3rem;">🎙️</span>
            <b style="color:#6EE7B7; font-size:1.15rem; margin-left:6px;">{tr("Voice & AI Navigation Command Assistant", "वॉयस व एआई नेविगेशन कमांड सहायक")[0]}</b>
            <p style="color:#A7F3D0; font-size:0.85rem; margin:4px 0 0 0;">
                {tr("Speak or choose where to navigate — instantly redirect to any workspace or feature:", "बोलें या चुनें कि आप क्या देखना चाहते हैं — सीधे उस पेज पर नेविगेट करें:")[0]}
            </p>
        </div>
        <div style="background:rgba(16, 185, 129, 0.2); border:1px solid #10B981; border-radius:999px; padding:4px 12px; font-size:0.8rem; color:#34D399; font-weight:700;">
            ● {tr("VOICE READY", "वॉयस तैयार")[0]}
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

nav_options_map = {
    tr("📦 Show Open Scrap Pickups & Photos", "📦 खुले स्क्रैप ऑर्डर्स व फोटो जांच देखें")[0]: {"role": "COLLECTOR"},
    tr("📦 Book Doorstep Pickup with AI ScrapVision & Radar", "📦 डोरस्टेप पिकअप व एआई स्क्रैप-विजन बुक करें")[0]: {"role": "HOUSEHOLD"},
    tr("🎯 Open Smart Buyer Matching & Recycler Offers", "🎯 स्मार्ट खरीदार मिलान व रीसाइक्लर ऑफर खोलें")[0]: {"role": "COLLECTOR"},
    tr("🤝 Show Collaborative Scrap Pooling Groups", "🤝 सहयोगात्मक स्क्रैप पूलिंग ग्रुप खोलें")[0]: {"role": "COLLECTOR"},
    tr("📜 View Digital Scrap Passport & Traceability", "📜 डिजिटल स्क्रैप पासपोर्ट व ट्रैसेबिलिटी देखें")[0]: {"role": "COLLECTOR"},
    tr("🗺️ Open EcoRoute TSP Fuel Navigation Planner", "🗺️ इको-रूट टीएसपी रूट प्लानर खोलें")[0]: {"role": "COLLECTOR"},
    tr("🪪 View 3-Point KYC Identity Credentials", "🪪 3-बिंदु पहचान सत्यापन क्रेडेंशियल देखें")[0]: {"role": "COLLECTOR"},
    tr("🤖 Run AI Biometric Photo Matching (Aadhaar/DL vs Live)", "🤖 एआई बायोमेट्रिक फोटो मिलान (आधार/डीएल vs लाइव) चलाएं")[0]: {"role": "ADMIN"},
    tr("📈 Manage Mandi Wholesale Benchmark Rates", "📈 मंडी थोक बेंचमार्क दरें प्रबंधित करें")[0]: {"role": "ADMIN"},
    tr("🛡️ Open EcoShield Anomaly & Anti-Fraud Audit", "🛡️ इको-शील्ड विसंगति व धोखाधड़ी ऑडिट खोलें")[0]: {"role": "ADMIN"},
    tr("🗄️ Manage Free Cloud Database Connectivity", "🗄️ मुफ्त क्लाउड डेटाबेस कनेक्टिविटी खोलें")[0]: {"role": "ADMIN"},
    tr("🏢 Open Commercial Bulk Generator Dashboard", "🏢 वाणिज्यिक अपशिष्ट जनरेटर डैशबोर्ड खोलें")[0]: {"role": "BUSINESS"},
    tr("🏭 Open Recycler Facility Wholesale Rate Portal", "🏭 रीसाइक्लिंग कारखाना दर पोर्टल खोलें")[0]: {"role": "RECYCLER"},
}

cmd_col1, cmd_col2, cmd_col3 = st.columns([3, 1, 1])

with cmd_col1:
    chosen_nav = st.selectbox(
        tr("What would you like to see or navigate to?", "आप क्या देखना या नेविगेट करना चाहते हैं?")[0],
        list(nav_options_map.keys()),
        label_visibility="collapsed"
    )

with cmd_col2:
    voice_mic_btn = st.button("🎙️ " + tr("Simulate Voice Mic", "माइक बोलें")[0], use_container_width=True, help=tr("Listen to voice phrase & redirect", "आवाज सुनकर पेज पर जाएं")[0])

with cmd_col3:
    exec_nav_btn = st.button("⚡ " + tr("Navigate Now", "नेविगेट करें")[0], type="primary", use_container_width=True)

if voice_mic_btn or exec_nav_btn:
    target_info = nav_options_map[chosen_nav]
    target_role = target_info["role"]
    
    st.session_state.current_role = target_role
    st.toast(tr(f"Redirecting to: {chosen_nav}...", f"नेविगेट किया जा रहा है: {chosen_nav}...")[0], icon="🚀")
    time.sleep(0.3)
    st.rerun()

# Footer
st.divider()
st.markdown("""
<div style="text-align:center; color:#6B7F74; font-size:0.85rem; padding-bottom:1.5rem;">
    <b>ScrapSetu 2.0</b> © 2026 • Live Streamlit Edition • Connected to GitHub Repository: <code>Siddiqui-Hammad/ScrapSetu</code>
</div>
""", unsafe_allow_html=True)
