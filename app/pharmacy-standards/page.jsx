'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ThermometerSnowflake,
  PackageCheck,
  HeartHandshake,
  Bike,
  FileCheck2,
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export default function PharmacyStandardsPage() {
  const highlights = [
    {
      icon: <ShieldCheck size={20} />,
      title: 'Licensed Pharmacy Network',
      desc: 'All medicines sourced exclusively from state-licensed retail and distributor pharmacies.',
      bgColor: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      icon: <ThermometerSnowflake size={20} />,
      title: 'Cold-Chain Integrity',
      desc: 'Insulated thermal pouches for temperature-sensitive insulins, drops, and biologicals.',
      bgColor: '#e0f2fe',
      iconColor: '#0284c7'
    },
    {
      icon: <PackageCheck size={20} />,
      title: 'Triple-Point Inspection',
      desc: 'Pharmacist verification of brand, strength, expiry date, and packaging before dispatch.',
      bgColor: '#fef3c7',
      iconColor: '#d97706'
    }
  ];

  const toc = [
    { id: 'introduction', label: '1. Quality Commitment' },
    { id: 'medicine-quality', label: '2. Medicine Quality & Sourcing' },
    { id: 'prescription-guidelines', label: '3. Prescription Guidelines' },
    { id: 'storage-handling', label: '4. Storage & Cold Chain' },
    { id: 'order-accuracy', label: '5. Order Accuracy Verification' },
    { id: 'customer-safety', label: '6. Customer Safety & Advice' },
    { id: 'delivery-standards', label: '7. Delivery Standards' },
    { id: 'contact-standards', label: '8. Support & Queries' }
  ];

  return (
    <LegalPageLayout
      title="Pharmacy Standards"
      badgeText="MEDICINE QUALITY & OPERATIONAL ASSURANCE"
      badgeIcon={ShieldCheck}
      subtitle="How Med-in-Minutes and our partner pharmacies maintain rigorous medicine quality, cold-chain safety, and responsible dispensing standards."
      lastUpdated="November 1, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Introduction */}
      <section id="introduction" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          1. Our Quality Commitment
        </h2>
        <p style={{ marginBottom: '14px' }}>
          When ordering urgent medications, patients must be able to trust that every pill, syrup, or injection is 100% authentic, uncompromised, and safely transported. At <strong>Med-in-Minutes</strong>, our mission of 10-minute delivery is grounded in an uncompromising standard: <strong>speed must never sacrifice patient safety</strong>.
        </p>
        <p style={{ marginBottom: '14px' }}>
          This page outlines the operational standards, quality assurance guidelines, and pharmaceutical handling protocols that govern our platform and partner fulfillment pharmacies. We present these as real, operational commitments implemented across our logistics chain.
        </p>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '16px 20px', fontSize: '0.875rem', color: '#064e3b' }}>
          <strong>Clear Operational Disclosure:</strong> Med-in-Minutes is an on-demand medical logistics and aggregator technology platform. Physical medicines are stocked, verified, and dispensed exclusively by licensed retail pharmacies operating under applicable State Drug Control licenses.
        </div>
      </section>

      {/* 2. Medicine Quality */}
      <section id="medicine-quality" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          2. Medicine Quality &amp; Sourcing Standards
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Counterfeit, sub-potent, or compromised pharmaceuticals represent a severe hazard to public health. We enforce strict sourcing requirements across all fulfillment partners:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={18} color="#059669" /> Licensed Suppliers Only
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              All medicines supplied through the platform must originate from authorized pharmaceutical manufacturers and be procured via licensed distributors with genuine invoice and batch trails.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={18} color="#059669" /> Mandatory Expiry Checks
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Every product&apos;s expiry date is inspected before dispatch. Partner pharmacies are strictly prohibited from dispensing any medicine with an expired date or near-expiry shelf life.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={18} color="#059669" /> Packaging &amp; Seal Integrity
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Blister packs, foil strips, and bottle safety seals must be completely intact. Any item exhibiting pinholes, tears, crushing, or water damage is quarantined and rejected.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={18} color="#059669" /> No Loose or Unlabeled Stock
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Medicines are dispensed exclusively in manufacturer original strips, bottles, or packaging with clear labeling, composition details, batch numbers, and manufacturer data.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Prescription Guidelines */}
      <section id="prescription-guidelines" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          3. Prescription Guidelines &amp; AI-Assisted OCR
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Dispensing prescription-only drugs without proper medical authorization is illegal and clinically dangerous. We adhere strictly to statutory requirements:
        </p>

        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px' }}>
          <li>
            <strong>Mandatory Doctor Prescription:</strong> Schedule H, Schedule H1, and Schedule X medicines strictly require a valid, legible prescription issued by a Registered Medical Practitioner (RMP).
          </li>
          <li>
            <strong>Prescription Validity Criteria:</strong> The uploaded prescription must clearly display the prescribing doctor&apos;s name, medical registration number, clinic or hospital name, patient name, prescription date, and clear dosage instructions.
          </li>
          <li>
            <strong>Secure Prescription Handling:</strong> Prescription images and scanned text are stored securely with encrypted access controls and are restricted solely to authorized dispensing personnel.
          </li>
        </ul>

        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#d97706" /> Explicit Standard: Role of AI Prescription Scanning
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.6 }}>
            Our integrated AI OCR system operates solely as an <strong>assistance tool</strong> to extract medication names and dosage strings for faster catalog discovery by the customer. The AI does not diagnose illnesses, does not approve prescriptions, and cannot override legal dispensing protocols. Statutory checks must be fulfilled by licensed pharmacy professionals before medicines are dispensed.
          </p>
        </div>
      </section>

      {/* 4. Storage and Handling */}
      <section id="storage-handling" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          4. Storage, Handling &amp; Cold-Chain Protocols
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Pharmaceutical compounds degrade rapidly if exposed to excessive heat, moisture, or direct ultraviolet radiation. All partner pharmacies and courier partners implement standardized environmental controls:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Controlled Room Temperature (15&deg;C &ndash; 25&deg;C)
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              Tablets, capsules, syrups, and dry ointments are stored in climate-controlled pharmacy shelves, shielded from direct sunlight, humidity, and atmospheric pollutants.
            </p>
          </div>

          <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ThermometerSnowflake size={18} color="#0284c7" /> Cold-Chain Protocol (2&deg;C &ndash; 8&deg;C)
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#075985', lineHeight: 1.6 }}>
              Temperature-sensitive medications &mdash; including insulins, eye drops, biological injections, and reconstituted vaccines &mdash; are stored in medical refrigerators and transported in certified insulated thermal bags with cold-gel packs.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Order Accuracy */}
      <section id="order-accuracy" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          5. Order Accuracy &amp; Triple-Point Verification
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Medication errors can have dangerous consequences. To prevent dispensing mistakes, all orders pass through a structured 3-stage validation process before leaving the pharmacy:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
              1
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Prescription &amp; Item Matching</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Verifying that the item picked matches the exact chemical salt, brand name, and strength specified in the prescription (e.g., verifying Paracetamol 650mg vs 500mg).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
              2
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Physical Inspection &amp; Seal</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Checking foil strips and bottle caps for micro-tears or leaks, verifying the printed batch number and expiry date, and sealing items into a tamper-evident, opaque delivery pouch.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
              3
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Secure Handover via Customer OTP</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Couriers require the customer to provide their unique 4-digit handover OTP upon arrival. This ensures the medicine is handed directly to the intended patient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Safety & Medical Advice */}
      <section id="customer-safety" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          6. Customer Safety &amp; Healthcare Ethics
        </h2>
        <div style={{ background: '#f8fafc', borderLeft: '4px solid #0284c7', padding: '20px', borderRadius: '0 12px 12px 0', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={18} color="#0284c7" /> Always Follow Your Doctor&apos;s Instructions
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
            Med-in-Minutes strongly advises all customers to administer medications strictly according to the written guidance of their consulting physician or qualified healthcare provider. Do not alter dosages, discontinue courses prematurely, or share prescription medications with others.
          </p>
        </div>

        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
          <li>
            <strong>No AI-Generated Diagnoses:</strong> Our conversational assistant (MedAI) and automated tools provide factual medicine metadata (usage, category, standard manufacturer guidance), but do <strong>not</strong> generate clinical diagnoses or prescribe personalized treatment plans.
          </li>
          <li>
            <strong>Emergency Situations:</strong> If you or a loved one are experiencing acute medical emergencies &mdash; including chest pain, severe allergic anaphylaxis, profuse bleeding, or loss of consciousness &mdash; please call national emergency services (112 or 108) or proceed immediately to the nearest hospital emergency room.
          </li>
        </ul>
      </section>

      {/* 7. Delivery Standards */}
      <section id="delivery-standards" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          7. Delivery Standards &amp; Transit Handling
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Our hyperlocal delivery model is engineered specifically for pharmaceuticals. Medicine parcels are not handled as ordinary general merchandise:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}>
              <PackageCheck size={18} color="#059669" /> Hygienic &amp; Weatherproof Packaging
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Every order is placed inside an opaque, waterproof, tamper-evident sealed pouch to protect sensitive medication boxes from rain, dust, and handling.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}>
              <Bike size={18} color="#0284c7" /> Upright &amp; Anti-Shock Stowage
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Liquid cough syrups, suspensions, and glass ampoules are packed with shock-absorbing bubble cushioning and kept upright inside dedicated courier storage boxes.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}>
              <ShieldCheck size={18} color="#059669" /> Trained Courier Network
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Delivery partners receive dedicated briefing on handling urgent medicines, avoiding direct sunlight exposure, and prioritizing patient handover with care.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Contact & Standards Desk */}
      <section id="contact-standards">
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          8. Standards Inquiries &amp; Pharmacist Support
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Have questions regarding medicine quality, batch records, or storage guidelines? Reach our medical standards desk anytime:
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pharmacist Helpline</div>
              <a href="tel:1800633646" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>1800-633-646</a>
              <div style={{ fontSize: '0.75rem', color: '#059669' }}>Available 24x7</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Quality &amp; Standards Email</div>
              <a href="mailto:care@medinminutes.com" style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>care@medinminutes.com</a>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Direct Pharmacist Review</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', gridColumn: '1 / -1' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Fulfillment Headquarters</div>
              <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                Med-in-Minutes Healthcare Technologies Pvt Ltd, Inner Circle, Connaught Place, New Delhi - 110001
              </div>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}

