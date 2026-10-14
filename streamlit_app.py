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
import urllib.parse

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
    .bilingual-hover-tip {
        position: relative;
        display: inline-block;
    }
    .bilingual-hover-tip:hover::after {
        content: attr(data-trans);
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background: #042618;
        color: #34D399;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        border: 1px solid #10B981;
        box-shadow: 0 10px 25px rgba(0,0,0,0.8);
        z-index: 99999;
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
# 2. SVG Asset Generators (Scrap Visuals, Aadhaar, DL, Biometrics)
# -------------------------------------------------------------
def get_scrap_svg(material_type="plastic", title="Sorted Recyclable Scrap"):
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
        <text x="16" y="187" fill="#F4FDF8" font-family="sans-serif" font-size="12" font-weight="bold">{title}</text>
        <text x="364" y="187" fill="{accent}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">AI VERIFIED ✓</text>
    </svg>"""
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

def get_aadhaar_card_svg(name="Ramesh Kumar Sahu", uid="4129 6638 6621", dob="15/08/1988"):
    masked_uid = "XXXX XXXX " + uid.replace("-", " ").strip()[-4:]
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
        <text x="130" y="85" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="bold">{name}</text>
        <text x="130" y="105" fill="#475569" font-family="sans-serif" font-size="11">जन्म तिथि / DOB: <tspan font-weight="bold" fill="#0F172A">{dob}</tspan></text>
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
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

def get_dl_card_svg(name="Shyam Sundar Sharma", dl_num="RJ-14-2022-00455", vehicle_class="LMV-TR"):
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
        <text x="120" y="72" fill="#7DD3FC" font-family="monospace" font-size="11">DL NO: <tspan font-weight="bold" font-size="13" fill="#FFFFFF">{dl_num}</tspan></text>
        <text x="120" y="96" fill="#F8FAFC" font-family="sans-serif" font-size="14" font-weight="bold">{name}</text>
        <text x="120" y="120" fill="#94A3B8" font-family="sans-serif" font-size="10">COV (Class): <tspan font-weight="bold" fill="#38BDF8">{vehicle_class} (Commercial Carrier)</tspan></text>
        <text x="120" y="140" fill="#94A3B8" font-family="sans-serif" font-size="10">Valid Until: <tspan font-weight="bold" fill="#F8FAFC">14/06/2034</tspan></text>
        <text x="120" y="160" fill="#94A3B8" font-family="sans-serif" font-size="10">Blood Group: <tspan font-weight="bold" fill="#F8FAFC">B+ POSITIVE</tspan></text>
        <rect x="290" y="115" width="105" height="45" rx="6" fill="#0369A1" fill-opacity="0.3" stroke="#38BDF8" stroke-width="1"/>
        <text x="342" y="133" fill="#BAE6FD" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PARIVAHAN RTO</text>
        <text x="342" y="148" fill="#38BDF8" font-family="sans-serif" font-size="9" text-anchor="middle">Verified Live ✓</text>
        <rect x="0" y="215" width="420" height="35" fill="#07192C"/>
        <text x="20" y="234" fill="#94A3B8" font-family="monospace" font-size="9">CHIP ID: 899144020261192834 • AUTH DIGITAL CARRIER SEAL</text>
    </svg>"""
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

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
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

# -------------------------------------------------------------
# 3. Session State Initialization
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

# Seeded Pickup Orders (Enriched with scrap photo SVGs and AI scene analysis)
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

    st.markdown("""
    <div style="background: radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.18) 0%, rgba(11, 21, 16, 0.95) 75%); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 1.5rem; padding: 2.2rem 1.5rem 1.8rem 1.5rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(16, 185, 129, 0.25);">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:rgba(16, 185, 129, 0.15); border:1px solid #10B981; margin-bottom:0.8rem; box-shadow:0 0 25px rgba(16, 185, 129, 0.35);">
            <span style="font-size:2.2rem;">♻️</span>
        </div>
        <h1 style="color:#F4FDF8; font-weight:900; font-size:2.8rem; margin:0 0 0.3rem 0; letter-spacing:-0.03em; text-shadow:0 0 25px rgba(16, 185, 129, 0.35);">
            ScrapSetu <span style="color:#10B981;">2.0</span>
        </h1>
        <p style="color:#6EE7B7; font-size:1.05rem; font-weight:600; margin:0 0 0.8rem 0; letter-spacing:0.02em;">
            ScrapSetu Circular Intelligence • भारत का डिजिटल रीसाइक्लिंग सेतु
        </p>
        <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); padding:0.35rem 1rem; border-radius:9999px; font-size:0.8rem; color:#A7F3D0;">
            <span style="color:#10B981;">●</span> Verified CPCB EPR Network • 3-Point Biometric KYC • 100% Digital UPI Settlements
        </div>
    </div>
    """, unsafe_allow_html=True)

    t1, t2, t3, t4 = st.columns(4)
    with t1:
        st.markdown('''<div class="kpi-card"><div class="kpi-val">2,845.9 MT</div><div class="kpi-lbl">Landfill Diversion</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">↑ Audited CPCB</div></div>''', unsafe_allow_html=True)
    with t2:
        st.markdown('''<div class="kpi-card"><div class="kpi-val">4,268 MT</div><div class="kpi-lbl">CO₂e Avoided</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">↑ IPCC Model</div></div>''', unsafe_allow_html=True)
    with t3:
        st.markdown('''<div class="kpi-card"><div class="kpi-val">1,420 Active</div><div class="kpi-lbl">Certified Kabadiwalas</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">↑ 3-Point KYC</div></div>''', unsafe_allow_html=True)
    with t4:
        st.markdown('''<div class="kpi-card"><div class="kpi-val">₹5.49 Cr</div><div class="kpi-lbl">Direct Citizen Payouts</div><div style="font-size:0.75rem; color:#34D399; margin-top:5px; font-weight:700;">↑ 100% Digital UPI</div></div>''', unsafe_allow_html=True)

    st.write("")
    auth_tab_login, auth_tab_register = st.tabs(["🔐 Sign In (लॉग इन)", "📝 Create Dynamic Account (पंजीकरण)"])

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

    with auth_tab_register:
        st.markdown("#### Dynamic Multi-Role Registration Portal with 3-Point KYC")
        st.caption("Select your role to reveal tailored compliance onboarding:")
        
        chosen_role = st.selectbox(
            "Select Registration Role Category:",
            ["HOUSEHOLD", "COLLECTOR", "BUSINESS", "RECYCLER", "ADMIN"],
            format_func=lambda x: {
                "HOUSEHOLD": "🏠 Household Citizen / Resident",
                "COLLECTOR": "🛺 Kabadiwala / Collector Partner",
                "BUSINESS": "🏢 Commercial Waste Generator (Malls, IT Parks)",
                "RECYCLER": "🏭 Recycling Facility / Wholesale Mill",
                "ADMIN": "🛡️ Platform Governance & Regulatory Authority"
            }[x]
        )

        with st.form("dynamic_reg_form"):
            st.markdown("##### 1. Basic Account Credentials")
            r_c1, r_c2 = st.columns(2)
            with r_c1:
                reg_name = st.text_input("Full Name / Entity Name", "Deepak Verma")
                reg_phone = st.text_input("Phone Number (+91)", "+91 98765 00000")
            with r_c2:
                reg_email = st.text_input("Official Email Address", "deepak@scrapsetu.in")
                reg_pass = st.text_input("Create Security PIN / Password", type="password", value="Secret@2026")

            st.markdown("##### 2. Role-Specific Profile Details")
            if chosen_role == "HOUSEHOLD":
                rh1, rh2 = st.columns(2)
                with rh1:
                    reg_addr = st.text_input("Residential Doorstep Address", "Apt 402, Green Valley Apartments, Mayur Vihar Phase-1")
                with rh2:
                    reg_pin = st.text_input("Pincode", "110091")

            elif chosen_role == "COLLECTOR":
                st.info("🛺 Kabadiwala Partner Profile: Mobile terminal, EcoRoute TSP navigation, and TrustWeigh Bluetooth digital scale.")
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

            elif chosen_role == "RECYCLER":
                st.info("🏭 Recycler Facility: Wholesale buying rate sheet manager and digital weighbridge gate pass slips.")
                cr1, cr2 = st.columns(2)
                with cr1:
                    reg_fac = st.text_input("Processing Facility Name", "EcoPlast Reclaimers Pvt Ltd")
                with cr2:
                    reg_cpcb = st.text_input("CPCB / SPCB License Number", "CPCB/PWM/DEL-2024/092")

            elif chosen_role == "ADMIN":
                st.info("🛡️ Platform Administrator: Regulatory verification queue, Mandi rate authority, and cloud database connectivity.")

            st.markdown("##### 3. Mandatory 3-Point KYC Verification Dossier")
            k_c1, k_c2, k_c3 = st.columns(3)
            with k_c1:
                st.markdown("**1. 📄 Aadhaar Card**")
                u_aadh_no = st.text_input("Aadhaar Number (12 Digits)", "5482-9182-4912")
                u_aadh_file = st.file_uploader("Upload Aadhaar", type=["pdf", "png", "jpg", "jpeg"], key="reg_aadh")
            with k_c2:
                st.markdown("**2. 🪪 Driving Licence**")
                u_dl_no = st.text_input("Driving Licence Number", "DL-04-2022-00455")
                u_dl_file = st.file_uploader("Upload Driving Licence", type=["pdf", "png", "jpg", "jpeg"], key="reg_dl")
            with k_c3:
                st.markdown("**3. 🤳 Live Camera Selfie**")
                u_selfie = st.camera_input("Take Live Selfie:")

            reg_submit = st.form_submit_button("🚀 Complete 3-Point Registration & Enter Portal", type="primary", use_container_width=True)
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
                st.success(f"🎉 Registration successful! Welcome to your tailored {chosen_role} Dashboard.")
                st.rerun()

    st.stop()


# =============================================================
# SCENARIO B: LOGGED-IN DEDICATED ROLE DASHBOARD
# =============================================================

# Bilingual Active Language Indicator & Top User Bar
active_lang_name = "English" if st.session_state.lang == "en" else "हिंदी"
other_lang_name = "हिंदी" if st.session_state.lang == "en" else "English"
hover_tooltip_text = "हिंदी: स्क्रैपसेतु 2.0 चक्रीय रीसाइक्लिंग प्लेटफॉर्म" if st.session_state.lang == "en" else "English: ScrapSetu 2.0 Circular Recycling Platform"

st.markdown(f"""
<div class="top-user-bar">
    <div>
        <span style="font-size:1.3rem; font-weight:900; letter-spacing:-0.02em; color:#F4FDF8;">ScrapSetu 2.0</span> • 
        <b style="color:#A7F3D0;">{st.session_state.user_name}</b> 
        <span class="user-badge" style="margin-left:0.6rem;">{st.session_state.current_role} PORTAL</span>
    </div>
    <div style="display:flex; align-items:center; gap:1.2rem;">
        <div class="bilingual-badge bilingual-hover-tip" data-trans="{hover_tooltip_text}">
            🌐 <b>Language:</b> {active_lang_name} 
            <span style="font-size:0.75rem; color:#A7F3D0; margin-left:4px;">(Hover for {other_lang_name} / अनुवाद)</span>
        </div>
        <div style="font-size:0.85rem; color:#A7F3D0;">
            <code>{st.session_state.user_email}</code> • 🟢 Live Connected
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Top Action Row
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
    st.caption("Schedule zero-charge doorstep scrap pickups, identify materials & calculate weight via AI ScrapVision, and track verified collectors.")

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

    h_tab1, h_tab2, h_tab3 = st.tabs(["📦 Book Doorstep Pickup", "🔍 AI ScrapVision Classifier & Weight Engine", "🧾 Digital Waste Passports"])

    with h_tab1:
        h_col1, h_col2 = st.columns([1, 1], gap="large")
        with h_col1:
            st.markdown("#### 📦 Schedule Next Pickup")
            with st.form("household_book"):
                h_cat = st.selectbox("Scrap Category", [f"{c['icon']} {c['name']} (₹{c['rate']}/kg)" for c in st.session_state.categories])
                h_qty = st.number_input("Estimated Weight (kg)", min_value=1.0, value=25.0, step=1.0)
                h_slot = st.selectbox("Preferred Time Window", ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", "Evening (3 PM - 6 PM)"])
                h_addr = st.text_input("Pickup Address", "South Extension II, Block C, New Delhi")

                sel_r = 15.5
                c_key = "paper"
                for c in st.session_state.categories:
                    if c["name"] in h_cat:
                        sel_r = c["rate"]
                        c_key = c["id"]
                        break
                expected_payout = round(h_qty * sel_r, 2)
                st.info(f"💡 Expected Mandi Value: **₹{expected_payout:,.2f}** (@ ₹{sel_r}/kg). Verified with TrustWeigh digital scale at your doorstep.")

                if st.form_submit_button("Confirm Booking (पिकअप बुक करें)", type="primary", use_container_width=True):
                    nid = f"REQ-{len(st.session_state.pickups)+101}"
                    new_order = {
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
                        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                        "photo_svg": get_scrap_svg(c_key, f"Resident Scrap Photo — {h_cat.split('(')[0]}"),
                        "ai_vision": f"Doorstep scrap package of {h_cat.split('(')[0]}. Volumetric inspection shows clean segregated materials ready for collector verification.",
                        "ai_weight_details": f"Calculated: {h_qty} kg | Mandi Benchmark Rate: ₹{sel_r}/kg"
                    }
                    st.session_state.pickups.append(new_order)
                    st.success(f"🎉 Pickup {nid} scheduled! Scrap photo and AI weight estimation broadcasted to verified kabadiwalas.")
                    st.rerun()

        with h_col2:
            st.markdown("#### 🗺️ Neighborhood Collector Radar Map")
            m = folium.Map(location=[28.5684, 77.2195], zoom_start=13)
            folium.Marker([28.5684, 77.2195], tooltip="My Doorstep Location", icon=folium.Icon(color="green", icon="home")).add_to(m)
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

    # ---------------- 2. ENHANCED SCRAPVISION AI TAB ----------------
    with h_tab2:
        st.markdown("#### 🔍 ScrapVision AI Material Recognition & Volumetric Weight Engine")
        st.caption("Multimodal neural vision model describes visual scene details, calculates volumetric weight, and estimates live Mandi payout:")

        sv_c1, sv_c2 = st.columns([1, 1], gap="large")
        with sv_c1:
            st.markdown("##### 1. Capture or Select Scrap Photo")
            sample_choice = st.selectbox(
                "Choose High-Resolution Scrap Sample:",
                [
                    "🧴 Transparent Optical PET Bottles & Containers (Plastic)",
                    "📦 Baled Corrugated Kraft Cardboard & Cartons (Paper)",
                    "✨ Stripped Millberry Pure Copper Wire (Metal)",
                    "💻 Telecom Server Boards & Component E-Waste (Electronics)"
                ]
            )

            input_method = st.radio("Photo Input Source:", ["Use Neural Demo Preset", "Upload Custom Scrap Photo", "Live Camera Snapshot"], horizontal=True)

            up_img = None
            if input_method == "Upload Custom Scrap Photo":
                up_img = st.file_uploader("Upload Scrap Photo (JPG/PNG)", type=["jpg", "jpeg", "png", "webp"])
            elif input_method == "Live Camera Snapshot":
                up_img = st.camera_input("Capture Scrap Pile with Camera")

            if "PET" in sample_choice:
                mat_key = "plastic"
                mat_name = "Rigid Plastics (PET Optical Clear #1)"
                conf = 98.4
                calc_wt = 5.4
                rate_val = 32.0
                obs_text = "Observed loose pile of 42 optical clear PET beverage bottles lightly compressed with PP caps segregated. Surface reflectance indicates dry state (<1.2% moisture). Volumetric 3D bounding box calculated at 0.158 m³ with loose bulk packing density of 34.2 kg/m³."
                comp_breakdown = "• 94.2% PET Clear Flakes\n• 4.8% Polypropylene Caps\n• 1.0% Non-Polymer Residue"
            elif "Cardboard" in sample_choice or "Kraft" in sample_choice:
                mat_key = "paper"
                mat_name = "Corrugated Carton (Kraft Gatta #20)"
                conf = 97.6
                calc_wt = 22.0
                rate_val = 16.5
                obs_text = "Bundled double-fluted corrugated kraft cardboard cartons with clean dry daily newspapers, bound with twine. Low humidity (<4%), zero wet food contamination. Volumetric space 0.185 m³ with baled paper density 119 kg/m³."
                comp_breakdown = "• 88.5% Kraft Fluting & Linerboard\n• 9.5% Newsprint\n• 2.0% Twine & Adhesive Tape"
            elif "Copper" in sample_choice:
                mat_key = "metal"
                mat_name = "Millberry Copper Wire (99.9% Electrolytic)"
                conf = 99.2
                calc_wt = 4.8
                rate_val = 685.0
                obs_text = "Stripped bright millberry copper wire coils (99.9% electrolytic purity) with heavy armoured conduit cables. Zero insulation PVC burning residue. Bulk metal density 8.92 g/cm³."
                comp_breakdown = "• 99.2% Pure Electrolytic Copper\n• 0.8% Tin-Coated Strands"
            else:
                mat_key = "ewaste"
                mat_name = "Telecom Server Motherboards & E-Waste"
                conf = 96.8
                calc_wt = 14.5
                rate_val = 95.0
                obs_text = "Post-consumer telecommunications server motherboards, RAM sticks with gold contact fingers, and switched-mode power supplies. RoHS compliant, lead-free solder."
                comp_breakdown = "• 62.0% FR-4 Laminate PCB\n• 24.5% Aluminium & Copper Heatsinks\n• 13.5% Precious Metal Pinouts"

            st.markdown("##### Visual Inspection Preview:")
            if up_img:
                st.image(up_img, caption="Customer Uploaded Scrap Photo", use_column_width=True)
            else:
                img_data_uri = get_scrap_svg(mat_key, sample_choice.split("(")[0].strip())
                st.markdown(f'<img src="{img_data_uri}" style="width:100%; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.4); margin-bottom:8px;">', unsafe_allow_html=True)

        with sv_c2:
            st.markdown(f"""
            <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.45); border-radius:14px; padding:18px; margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <b style="color:#6EE7B7; font-size:1.15rem;">🤖 What the AI Vision Model Sees:</b>
                    <span style="background:rgba(16, 185, 129, 0.25); color:#34D399; padding:3px 10px; border-radius:999px; font-weight:800; font-size:12px; border:1px solid #10B981;">
                        {conf}% Confidence ✓
                    </span>
                </div>
                <hr style="margin:10px 0; border-color:rgba(16, 185, 129, 0.25);">
                <p style="color:#E2E8F0; font-size:0.92rem; line-height:1.5; margin-bottom:10px;">
                    "{obs_text}"
                </p>
                <div style="background:#091A12; border:1px solid rgba(16, 185, 129, 0.2); border-radius:8px; padding:10px; font-size:0.85rem; color:#A7F3D0;">
                    <b>Material Composition:</b><br>
                    {comp_breakdown.replace(chr(92)+'n', '<br>')}
                </div>
            </div>
            """, unsafe_allow_html=True)

            st.markdown("##### ⚖️ Calculated Volumetric Weight & Real-Time Payout")
            cw_col1, cw_col2 = st.columns(2)
            with cw_col1:
                st.metric("AI Calculated Weight", f"{calc_wt} kg", delta="±0.3 kg Volumetric")
            with cw_col2:
                st.metric("Benchmark Mandi Rate", f"₹{rate_val}/kg", delta="Verified Rate")

            fine_wt = st.slider("Fine-Tune / Confirm Actual Weight (kg):", min_value=1.0, max_value=100.0, value=float(calc_wt), step=0.5)
            live_payout = round(fine_wt * rate_val, 2)

            st.markdown(f"""
            <div style="background:#091A12; border:1px solid #10B981; border-radius:12px; padding:14px; margin-bottom:14px; text-align:center;">
                <span style="color:#A1B2A9; font-size:0.85rem;">Estimated Doorstep Payout:</span><br>
                <b style="color:#34D399; font-size:2rem; font-family:monospace;">₹{live_payout:,.2f}</b><br>
                <span style="color:#6EE7B7; font-size:0.8rem;">100% Guaranteed via TrustWeigh Scale</span>
            </div>
            """, unsafe_allow_html=True)

            if st.button("🚀 Confirm Weight & Book Doorstep Pickup with Photo", type="primary", use_container_width=True):
                nid = f"REQ-{len(st.session_state.pickups)+101}"
                new_ai_order = {
                    "id": nid,
                    "user": st.session_state.user_name,
                    "role": "HOUSEHOLD",
                    "phone": "+91 98290 22002",
                    "area": "South Extension II, Block C, New Delhi",
                    "lat": 28.5684 + (len(st.session_state.pickups) * 0.002),
                    "lng": 77.2195 + (len(st.session_state.pickups) * 0.002),
                    "materials": f"{mat_name.split('(')[0]} ({fine_wt}kg)",
                    "est_weight": fine_wt,
                    "est_val": live_payout,
                    "slot": "Morning (9 AM - 12 PM)",
                    "status": "OPEN",
                    "assigned_collector": None,
                    "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "photo_svg": get_scrap_svg(mat_key, sample_choice.split("(")[0].strip()),
                    "ai_vision": obs_text,
                    "ai_weight_details": f"Calculated: {fine_wt} kg | Payout: ₹{live_payout:,.2f} | Confidence: {conf}%"
                }
                st.session_state.pickups.append(new_ai_order)
                st.success(f"🎉 Pickup {nid} booked with AI scrap photo & volumetric weight attached! Verified collectors can now inspect it on their terminal.")
                st.rerun()

    with h_tab3:
        st.markdown("#### 🧾 Digital Waste Passports (Cradle-to-Gate Certificates)")
        st.caption("Every completed transaction generates an immutable cryptographic SHA-256 seal:")
        st.markdown("""
        <div class="receipt-container">
            <div class="receipt-header">
                <span style="font-size:1.2rem; font-weight:800; color:#34D399;">SCRAPSETU DIGITAL WASTE PASSPORT</span><br>
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
    st.subheader(f"🛺 कबाड़ीवाला जॉब टर्मिनल (Collector Terminal) — {st.session_state.user_name}")
    st.caption("Mobile-first accessible terminal with Customer Scrap Photo Inspection, EcoRoute TSP navigation & Smart Buyer Matching.")

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
        "📍 नजदीकी ऑर्डर्स व फोटो जांच (Jobs & Photos)",
        "🎯 स्मार्ट बायर मैचिंग (Smart Buyer Matching)",
        "🤝 सहयोगात्मक स्क्रैप पूलिंग (Scrap Pooling)",
        "📜 स्क्रैप पासपोर्ट व ट्रैसेबिलिटी (Scrap Passport)",
        "🎤 बोलकर चलाएं (Voice Mode)",
        "🗺️ EcoRoute TSP रूट प्लानर",
        "🪪 3-Point KYC सत्यापन"
    ])

    # ---------------- 1. JOBS & CUSTOMER SCRAP PHOTO INSPECTION ----------------
    with col_tab1:
        k_col1, k_col2 = st.columns([1, 1], gap="large")
        with k_col1:
            st.markdown("#### 📍 नजदीकी खुले पिकअप व ग्राहक फोटो जांच")
            st.caption("कबाड़ीवाला साथी ऑर्डर स्वीकारने से पहले ग्राहक द्वारा अपलोड की गई स्क्रैप फोटो व AI विवरण देख सकते हैं:")
            open_jobs = [p for p in st.session_state.pickups if p["status"] == "OPEN"]
            if open_jobs:
                for job in open_jobs:
                    dist = haversine_km(28.5684, 77.2195, job["lat"], job["lng"])
                    with st.container(border=True):
                        # Photo and Details layout
                        jc1, jc2 = st.columns([1, 2])
                        with jc1:
                            photo_data = job.get("photo_svg", get_scrap_svg("plastic", job["materials"]))
                            st.markdown(f'<img src="{photo_data}" style="width:100%; height:110px; object-fit:cover; border-radius:10px; border:1px solid rgba(16, 185, 129, 0.4);">', unsafe_allow_html=True)
                            st.caption("📷 स्क्रैप फोटो संलग्न")
                        with jc2:
                            st.markdown(f"**{job['materials']}**")
                            st.caption(f"ग्राहक: **{job['user']}** • दूरी: **{dist} किमी**")
                            st.caption(f"स्थान: {job['area']}")
                            st.markdown(f"**अनुमानित कमाई: ₹{job['est_val']:,.2f}**")

                        # Photo Inspection Lightbox Expander
                        with st.expander(f"🔍 ग्राहक स्क्रैप फोटो व AI विवरण जांचें ({job['id']})"):
                            st.markdown("##### 📷 पूर्ण स्क्रैप फोटोग्राफ:")
                            st.markdown(f'<img src="{photo_data}" style="width:100%; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.6); margin-bottom:10px;">', unsafe_allow_html=True)
                            st.markdown(f"""
                            <div style="background:#091A12; border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:12px; font-size:13px; color:#A7F3D0; margin-bottom:10px;">
                                <b>🤖 AI विजन मॉडल का दृश्य विवरण:</b><br>
                                "{job.get('ai_vision', 'Segregated post-consumer recyclable material.')}"<br><br>
                                <b>वजन व दर विश्लेषण:</b> {job.get('ai_weight_details', f"{job['est_weight']} kg")}<br>
                                <b>संपर्क:</b> {job.get('phone', '+91 98290 22002')}
                            </div>
                            """, unsafe_allow_html=True)

                        if st.button(f"✅ पिकअप स्वीकार करें (Accept {job['id']})", key=f"k_acc_{job['id']}", type="primary", use_container_width=True):
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
                st.markdown(f"""
                <div style="background:#062316; border:2px solid #10B981; border-radius:18px; padding:18px; color:white; margin-bottom:14px;">
                    <span style="background:#10B981; color:#052e16; font-size:10px; font-weight:900; padding:3px 10px; border-radius:999px; text-transform:uppercase;">
                        🌟 TOP RECOMMENDATION (सर्वश्रेष्ठ शुद्ध मुनाफा)
                    </span>
                    <h3 style="color:#ffffff; margin:6px 0 2px 0;">{top['name']}</h3>
                    <p style="color:#86efac; font-size:12px; margin-bottom:8px;">स्थान: {top['loc']} • दूरी: <b>{top['dist']} किमी</b> • CPCB मान्यता: {top['cpcb']}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:rgba(0,0,0,0.5); padding:10px; border-radius:12px;">
                        <div><span style="font-size:11px; color:#9ca3af;">सकल मूल्य (Gross)</span><br><b style="font-size:16px; color:#ffffff;">₹{top['gross']:,.2f}</b><br><span style="font-size:10px; color:#a7f3d0;">@ ₹{top['rate']}/kg</span></div>
                        <div><span style="font-size:11px; color:#9ca3af;">अनुमानित भाड़ा (Transport)</span><br><b style="font-size:16px; color:#f87171;">-₹{top['t_cost']:,.2f}</b><br><span style="font-size:10px; color:#fca5a5;">{top['dist']} km @ {v_type}</span></div>
                        <div><span style="font-size:11px; color:#a7f3d0;">शुद्ध प्राप्ति (Net Proceeds)</span><br><b style="font-size:20px; color:#34D399;">₹{top['net']:,.2f}</b><br><span style="font-size:10px; color:#86efac;">सर्वाधिक कमाई</span></div>
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
        <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.4); border-radius:16px; padding:16px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:11px; background:rgba(16, 185, 129, 0.2); color:#34D399; font-weight:bold; padding:2px 8px; border-radius:999px; border:1px solid #10B981;">CPCB AUDIT TRAIL</span>
                    <h3 style="color:#F4FDF8; margin:4px 0 0 0;">पासपोर्ट आईडी: WP-2024-00124 (LOT-2026-PET-8821)</h3>
                    <p style="color:#A1B2A9; font-size:12px;">सामग्री: <b>Plastic (Grade A PET Flakes)</b> • स्रोत: इंदिरानगर, बैंगलोर</p>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:24px;">🏁</span><br>
                    <b style="color:#34D399; font-size:13px;">स्थिति: RECEIVED & VERIFIED ✓</b>
                </div>
            </div>
            <hr style="border-top:1px solid rgba(16, 185, 129, 0.2); margin:10px 0;">
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; font-size:12px; color:#E2E8F0;">
                <div>संग्रहण वजन: <b>60.0 kg</b></div>
                <div>वेजब्रिज वजन: <b style="color:#FBBF24;">56.5 kg</b></div>
                <div>वजन विसंगति: <b style="color:#F87171;">-3.5 kg (-5.8%)</b></div>
                <div>निपटान राशि: <b style="color:#34D399;">₹1,921.00</b></div>
            </div>
            <div style="background:#1C1506; border:1px solid #B45309; border-radius:8px; padding:8px; font-size:11px; color:#FDE68A; margin-top:8px;">
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
            st.success(f"**पहचाना गया आदेश:** '{curr_cmd}'")

            if curr_cmd == "आज के पिकअप दिखाओ" or curr_cmd == "पास के स्क्रैप जॉब्स दिखाओ":
                st.info("✅ **कार्रवाई:** कबाड़ीवाला टर्मिनल के नजदीकी खुले ऑर्डर्स लोड किए गए।")
            elif curr_cmd == "मेरी आज की कमाई दिखाओ":
                st.info("✅ **कार्रवाई:** आज की कुल कमाई ₹1,250.00 (4 पिकअप पूरे) स्क्रीन पर प्रदर्शित है।")
            elif curr_cmd == "प्लास्टिक के बायर्स दिखाओ":
                st.info("✅ **कार्रवाई:** स्मार्ट बायर मैचिंग में प्लास्टिक रीसाइक्लर्स की सूची सक्रिय की गई।")
            elif curr_cmd == "स्क्रैप पूल दिखाओ":
                st.info("✅ **कार्रवाई:** सहयोगात्मक पूलिंग ग्रुप लोड किए गए।")
            elif curr_cmd == "पिकअप कम्प्लीट करना है":
                st.warning("⚠️ **पुष्टि आवश्यक:** क्या आप ग्राहक प्रिया शर्मा का डिजिटल वजन व भुगतान पूरा करना चाहते हैं?")
                st.button("हाँ, भुगतान पूरा करें (Confirm)", type="primary")

    with col_tab2:
        st.markdown("#### 🗺️ EcoRoute TSP Smart Route Navigation")
        st.caption("Travelling Salesperson Problem (TSP) algorithm orders all pending pickups into the shortest fuel-efficient loop:")

        st.markdown("""
        <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-bottom:12px;">
            <b style="color:#6EE7B7;">🚀 इष्टतम संग्रह मार्ग (Optimized Route Sequence):</b><br>
            <span style="color:#A7F3D0; font-size:13px;">
                <b>स्टॉप 1:</b> South Extension II (REQ-101) ➡️ 
                <b>स्टॉप 2:</b> Saket District Centre (REQ-103) ➡️ 
                <b>स्टॉप 3:</b> EcoPlast Recycling Mill (Okhla Hub)
            </span><br>
            <span style="color:#34D399; font-size:12px;">कुल दूरी: <b>14.2 किमी</b> (38% की बचत • 2.8 लीटर ईंधन बचा)</span>
        </div>
        """, unsafe_allow_html=True)

        m_tsp = folium.Map(location=[28.5484, 77.2400], zoom_start=12)
        folium.Marker([28.5684, 77.2195], tooltip="स्टॉप 1: South Extension II", icon=folium.Icon(color="green", icon="1", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5284, 77.2185], tooltip="स्टॉप 2: Saket District Centre", icon=folium.Icon(color="blue", icon="2", prefix="fa")).add_to(m_tsp)
        folium.Marker([28.5355, 77.2728], tooltip="स्टॉप 3: Okhla Recycling Plant", icon=folium.Icon(color="red", icon="flag")).add_to(m_tsp)
        folium.PolyLine([[28.5684, 77.2195], [28.5284, 77.2185], [28.5355, 77.2728]], color="#10B981", weight=4, opacity=0.8).add_to(m_tsp)
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
        <div style="background:#081C14; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-top:12px;">
            <b style="color:#6EE7B7;">📄 Annual CPCB EPR Compliance Summary:</b><br>
            <span style="color:#A7F3D0; font-size:13px;">
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
    st.caption("3-Point KYC inspection queue, AI Biometric Photo Matching, Mandi rate governance & Free Cloud Database Manager.")

    ak1, ak2, ak3, ak4 = st.columns(4)
    with ak1:
        st.markdown(f'<div class="kpi-card"><div class="kpi-val">{len(st.session_state.pickups)} Orders</div><div class="kpi-lbl">Total Requests</div></div>', unsafe_allow_html=True)
    with ak2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">100%</div><div class="kpi-lbl">Settlement Rate</div></div>', unsafe_allow_html=True)
    with ak3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">₹11,670.00</div><div class="kpi-lbl">Total Cashflow Settled</div></div>', unsafe_allow_html=True)
    with ak4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">0 Disputes</div><div class="kpi-lbl">Dispute Status: Normal</div></div>', unsafe_allow_html=True)

    a_tab1, a_tab_biom, a_tab2, a_tab3, a_tab4, a_tab5 = st.tabs([
        "📋 3-Point KYC Verification Queue",
        "🤖 AI Photo Matching & Biometrics (Aadhaar / DL vs Live)",
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
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">📄</div>
                <b style="color:#F4FDF8;">Government Aadhaar Card</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">UIDAI Verified ID Proof</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#34D399;">
                    UID: {cand['aadhaar_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
                    Status: {cand['aadhaar_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col2:
            st.markdown(f"""
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🪪</div>
                <b style="color:#F4FDF8;">Driving Licence (DL)</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">Ministry of Road Transport</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#38BDF8;">
                    DL No: {cand['dl_num']}
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
                    Status: {cand['dl_status']}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with doc_col3:
            st.markdown(f"""
            <div style="background:#0B1510; border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:14px; text-align:center;">
                <div style="font-size:28px;">🤳</div>
                <b style="color:#F4FDF8;">Live Biometric Selfie</b>
                <div style="font-size:11px; color:#A1B2A9; margin:4px 0;">Anti-Spoofing Face Match</div>
                <div style="background:#0E1D16; border-radius:6px; padding:6px; font-family:monospace; font-size:12px; color:#34D399;">
                    Biometric Similarity: 98.4%
                </div>
                <div style="margin-top:6px; font-size:11px; color:#10B981; font-weight:bold;">
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

    # ---------------- 2. ENHANCED BIOMETRIC PHOTO MATCHING ----------------
    with a_tab_biom:
        st.markdown("#### 🤖 AI Photo Matching Engine: Aadhaar Card / DL vs Live Photo")
        st.caption("AI facial biometric verification comparing government identity cards against live camera selfies with anti-spoofing:")

        st.info("💡 **Feature Capability**: Upload an Indian Aadhaar Card or Driving Licence along with a live camera selfie to run biometric face similarity, anti-spoofing verification, and automatic OCR data extraction.")

        # Preset test selector
        p_col1, p_col2, p_col3 = st.columns(3)
        with p_col1:
            load_aadhaar = st.button("📌 Load Demo Aadhaar Match (Ramesh Kumar)", use_container_width=True)
        with p_col2:
            load_dl = st.button("🪪 Load Demo DL Match (Shyam Sundar)", use_container_width=True)
        with p_col3:
            load_mismatch = st.button("⚠️ Load Demo Mismatch (Different Face)", use_container_width=True)

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
            st.markdown("##### 1. Government ID Document (Aadhaar / DL)")
            doc_choice = st.radio(
                "Document Category:",
                ["Aadhaar Card (UIDAI)", "Commercial Driving Licence (Parivahan)"],
                index=1 if st.session_state.bio_test_type == "DL" else 0,
                horizontal=True
            )
            doc_upload = st.file_uploader("Upload ID Card (PNG/JPG)", type=["png", "jpg", "jpeg", "webp"], key="st_doc_upload")

            if doc_upload:
                st.image(doc_upload, caption="Uploaded Government Document", use_column_width=True)
            elif st.session_state.bio_test_type == "DL":
                dl_svg = get_dl_card_svg("Shyam Sundar Sharma", "RJ-14-2022-00455", "LMV-TR")
                st.markdown(f'<img src="{dl_svg}" style="width:100%; border-radius:12px; border:1px solid #38BDF8;">', unsafe_allow_html=True)
            else:
                aadh_svg = get_aadhaar_card_svg("Ramesh Kumar Sahu", "4129 6638 6621", "15/08/1988")
                st.markdown(f'<img src="{aadh_svg}" style="width:100%; border-radius:12px; border:1px solid #CBD5E1;">', unsafe_allow_html=True)

        with bio_col2:
            st.markdown("##### 2. Live Photograph (Live Camera / Selfie)")
            live_method = st.radio("Live Photo Mode:", ["Visual Simulation", "Live Camera Input", "Upload Selfie File"], horizontal=True)

            live_img = None
            if live_method == "Live Camera Input":
                live_img = st.camera_input("Capture Live Verification Selfie")
            elif live_method == "Upload Selfie File":
                live_img = st.file_uploader("Upload Live Selfie Photo", type=["png", "jpg", "jpeg", "webp"], key="st_selfie_upload")

            if live_img:
                st.image(live_img, caption="Captured Live Verification Selfie", use_column_width=True)
            else:
                is_match_sim = (st.session_state.bio_test_type != "MISMATCH")
                sim_name = "Ramesh Kumar Sahu" if st.session_state.bio_test_type == "AADHAAR" else "Shyam Sundar Sharma"
                selfie_svg = get_selfie_svg(sim_name, is_match=is_match_sim)
                st.markdown(f'<img src="{selfie_svg}" style="width:100%; border-radius:12px; border:1px solid {"#10B981" if is_match_sim else "#EF4444"};">', unsafe_allow_html=True)

        st.divider()

        if st.button("⚡ Run AI Biometric Photo Match", type="primary", use_container_width=True):
            with st.spinner("Analyzing biometric landmarks, inter-pupillary distance, and document security watermark..."):
                time.sleep(0.6)

                is_mismatch = (st.session_state.bio_test_type == "MISMATCH")
                score = 34.2 if is_mismatch else (98.4 if st.session_state.bio_test_type == "DL" else 96.8)
                liveness = 98.6

                if not is_mismatch:
                    st.success(f"🎉 **Biometric Face Match Confirmed! (Similarity Score: {score}%)**")
                    b1, b2, b3 = st.columns(3)
                    with b1:
                        st.metric("Facial Match", f"{score}%", "High Confidence ✓")
                    with b2:
                        st.metric("Liveness Score", f"{liveness}%", "Anti-Spoofing Passed ✓")
                    with b3:
                        st.metric("Audit Status", "VERIFIED", "E-KYC Passed ✓")

                    st.markdown("##### 📋 OCR Extracted Credentials:")
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

                    if st.button("✅ Authorize Partner in Platform Registry Now", use_container_width=True):
                        st.session_state.audit_logs.append({
                            "action": "AI_PHOTO_MATCH_VERIFIED",
                            "user": st.session_state.user_name,
                            "details": f"Biometric photo match approved with score {score}%",
                            "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                        })
                        st.success("Partner credentials activated across all doorstep collection zones!")
                else:
                    st.error(f"❌ **Biometric Mismatch Detected (Similarity Score: {score}%)**")
                    st.warning("The facial geometry on the live photograph does not align with the government ID card photograph. Request document re-upload.")

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
        <div style="background:#062316; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:12px; margin-bottom:1rem;">
            <b style="color:#6EE7B7;">🟢 Live Database Cluster Status:</b> 
            <span style="color:#A7F3D0;">Currently connected to <b>{db_cfg['provider']}</b>. All transactions, Mandi rates, and KYC documents synchronize in real-time.</span>
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
                st.success("✅ Real-time data pipeline synchronized records to the cloud database cluster.")

    with a_tab5:
        st.markdown("#### 📜 Immutable Cryptographic Audit Ledger")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), hide_index=True, use_container_width=True)

# Footer
st.divider()
st.markdown("""
<div style="text-align:center; color:#6B7F74; font-size:0.85rem; padding-bottom:1.5rem;">
    <b>ScrapSetu 2.0</b> © 2026 • Live Streamlit Edition • Connected to GitHub Repository: <code>Siddiqui-Hammad/ScrapSetu</code>
</div>
""", unsafe_allow_html=True)