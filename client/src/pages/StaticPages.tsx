import React from 'react';
import { Shield, EyeOff, HelpCircle, PhoneCall, CheckCircle2, Lock } from 'lucide-react';

export const SafetyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
        <Shield className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Waste Segregation & Safety Standards</h1>
        <p className="text-xs text-stone-500">Protecting informal waste workers through source segregation</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700 leading-relaxed">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-stone-900">Dry Recyclable Guidelines</h3>
        <p>• <b>Paper & Cardboard:</b> Ensure bundles are dry and free from food grease or organic contamination.</p>
        <p>• <b>Plastics:</b> Rinse beverage bottles and compress to reduce bulk volume.</p>
        <p>• <b>Glass:</b> Wrap chipped bottles in newspaper to prevent handling cuts.</p>
        <p>• <b>E-Waste:</b> Keep battery compartments intact and avoid disassembling cathode ray or lithium units.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-stone-900">Prohibited Hazardous Materials</h3>
        <p>• <b>Bio-Medical Waste:</b> Syringes, bandages, and medications must never be mixed with scrap.</p>
        <p>• <b>Flammables:</b> Unvented gas canisters, solvent cans, and explosive chemicals.</p>
        <p>• <b>Sanitary Waste:</b> Strictly segregated into municipal yellow/red containment.</p>
      </div>
    </div>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl">
        <EyeOff className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Geolocation & Personal Data Privacy</h1>
        <p className="text-xs text-stone-500">How ScrapSetu protects household identity and location data</p>
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700 leading-relaxed">
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
        🔒 Strict Privacy Rule: Exact house numbers and phone numbers are NEVER publicly shown on map pins.
      </div>

      <h3 className="text-sm font-bold text-stone-900">1. Coordinate Fuzzing</h3>
      <p>
        When a pickup request is open and waiting for collector assignment, the platform automatically obfuscates latitude and longitude by 300-500 meters. The map displays a general neighborhood perimeter rather than the user's doorstep.
      </p>

      <h3 className="text-sm font-bold text-stone-900">2. Authorized Just-In-Time Disclosure</h3>
      <p>
        Only after an authorized, KYC-verified collector clicks "Accept Pickup" does the server unlock the precise street address and contact phone number.
      </p>

      <h3 className="text-sm font-bold text-stone-900">3. Tamper-Evident Hashing</h3>
      <p>
        Digital receipts use SHA-256 cryptographic digests to guarantee authenticity without broadcasting sensitive banking coordinates.
      </p>
    </div>
  </div>
);

export const HelpPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl">
        <HelpCircle className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Disputes & Grievance Support Desk</h1>
        <p className="text-xs text-stone-500">Fast dispute resolution, scale calibration audits, and support</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-stone-900">Common Questions</h3>
        <div>
          <span className="font-bold block text-stone-800">Q: What if the collector's scale differs from mine?</span>
          <p className="text-stone-500 mt-0.5">
            All ScrapSetu certified collectors carry calibrated digital spring scales. If a dispute arises, tap "Raise Dispute" on the tracking page to freeze payment and trigger administrative verification.
          </p>
        </div>
        <div className="pt-2">
          <span className="font-bold block text-stone-800">Q: Are prices fixed or negotiable?</span>
          <p className="text-stone-500 mt-0.5">
            Rates on ScrapSetu are baseline indicative wholesale rates. Final mutually agreed amounts can incorporate clean sorting bonuses (+8%) or mixed scrap deductions (-10%).
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900">Platform Support Lines</h3>
        <div className="space-y-2">
          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <span>Toll-Free Helpline:</span>
            <span className="font-bold text-emerald-800">1800-SCRAP-SETU</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <span>Grievance Email:</span>
            <span className="font-bold text-emerald-800">compliance@scrapsetu.in</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <span>Jaipur Regional Hub:</span>
            <span className="font-bold text-stone-900">MI Road, Jaipur 302001</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
