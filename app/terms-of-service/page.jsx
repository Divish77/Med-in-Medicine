'use client';

import React from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Scale,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export default function TermsOfServicePage() {
  const highlights = [
    {
      icon: <Clock size={20} />,
      title: '10-Minute Delivery Target',
      desc: 'Hyperlocal dispatch from licensed pharmacies within 2 km; delivery times are operational estimates.',
      bgColor: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Valid Prescription Required',
      desc: 'Schedule H & X drugs strictly require a valid prescription. AI OCR is an assistance tool.',
      bgColor: '#e0f2fe',
      iconColor: '#0284c7'
    },
    {
      icon: <RotateCcw size={20} />,
      title: 'Regulated Returns',
      desc: 'Opened medicines cannot be returned under drug safety laws. Damaged items refunded promptly.',
      bgColor: '#fef3c7',
      iconColor: '#d97706'
    }
  ];

  const toc = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'user-responsibilities', label: '2. User Responsibilities' },
    { id: 'medicine-orders', label: '3. Medicine Orders' },
    { id: 'prescription-medicines', label: '4. Prescription Medicines & AI' },
    { id: 'payments', label: '5. Payments & Pricing' },
    { id: 'delivery', label: '6. 10-Minute Delivery' },
    { id: 'returns-refunds', label: '7. Returns & Refunds' },
    { id: 'limitation-of-liability', label: '8. Limitation of Liability' },
    { id: 'contact-info', label: '9. Contact Information' }
  ];

  return (
    <LegalPageLayout
      title="Terms of Service"
      badgeText="USER AGREEMENT & SERVICE POLICIES"
      badgeIcon={FileText}
      subtitle="Please review these Terms of Service carefully before ordering medicines or using the Med-in-Minutes platform."
      lastUpdated="November 1, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Introduction */}
      <section id="introduction" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          1. Introduction &amp; Nature of Service
        </h2>
        <p style={{ marginBottom: '14px' }}>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Customer&rdquo;, or &ldquo;you&rdquo;) and <strong>Med-in-Minutes Healthcare Technologies Pvt Ltd</strong> (&ldquo;Med-in-Minutes&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), governing your access to and use of our website, mobile interface, APIs, and medicine delivery services.
        </p>
        <p style={{ marginBottom: '14px' }}>
          <strong>Platform Intermediary Role:</strong> Med-in-Minutes operates an on-demand medical logistics and pharmacy aggregator platform. We digitally connect customers with registered, state-licensed retail pharmacies located in close geographic proximity (typically within 1.5 to 2 kilometers). Medicine inventory display, pricing verification, and statutory dispensing are conducted exclusively by licensed partner pharmacies through their certified pharmacists.
        </p>
        <p>
          By creating an account, browsing products, uploading prescriptions, or placing an order, you agree to be bound by these Terms. If you do not agree to all terms, please refrain from using the platform.
        </p>
      </section>

      {/* 2. User Responsibilities */}
      <section id="user-responsibilities" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          2. User Responsibilities &amp; Lawful Use
        </h2>
        <p style={{ marginBottom: '16px' }}>
          When accessing or utilizing Med-in-Minutes, you agree to the following operational commitments:
        </p>

        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '16px' }}>
          <li>
            <strong>Accurate Registration &amp; Contact Information:</strong> You agree to provide true, accurate, and current personal details, including your full name, functional mobile phone number, email address, and exact physical delivery address with correct landmark and pincode.
          </li>
          <li>
            <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials, login passwords, and OTP verification codes. You agree to notify us immediately of any unauthorized account activity.
          </li>
          <li>
            <strong>Lawful Personal Use:</strong> The service is provided strictly for bona fide personal or family medical consumption. You agree not to purchase medications for commercial resale, unauthorized redistribution, or illegal off-label use.
          </li>
          <li>
            <strong>Authentic Prescriptions:</strong> You certify that any prescription uploaded to the platform is genuine, issued by a registered medical practitioner (RMP), unexpired, and unaltered. Uploading forged, tampered, or stolen prescriptions is a criminal offense under the law and will result in immediate account termination and reporting to competent authorities.
          </li>
        </ul>
      </section>

      {/* 3. Medicine Orders */}
      <section id="medicine-orders" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          3. Medicine Orders &amp; Product Availability
        </h2>
        <p style={{ marginBottom: '14px' }}>
          The display of pharmaceutical products, surgical devices, and wellness items on Med-in-Minutes is subject to the following statutory and commercial conditions:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              A. Dynamic Stock Availability
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Product availability is updated dynamically based on real-time inventory feeds from partner pharmacies in your delivery radius. An item indicated as in stock at the time of browsing may become depleted before order packaging. Orders are confirmed only when accepted by the fulfilling pharmacy.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              B. Pricing &amp; Batch Updates
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              All prices displayed are in Indian Rupees (INR) and include applicable taxes (GST). While we make every effort to display accurate Maximum Retail Prices (MRP), manufacturers periodically revise prices across batches. In the event of a discrepancy between the platform display and the actual manufacturer printed MRP on the dispensed batch, the customer will be notified before dispatch.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              C. Order Rejection or Cancellation
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              A partner pharmacy or Med-in-Minutes reserves the right to decline or cancel any order if: (i) the requested medicine is out of stock; (ii) the uploaded prescription is invalid, expired, or illegible; (iii) the delivery address is outside the serviceable radius; or (iv) the medicine cannot legally be dispensed under applicable drug regulations.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Prescription Medicines & AI Scanner */}
      <section id="prescription-medicines" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          4. Prescription Medicines &amp; AI Scanning Disclaimers
        </h2>
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="#059669" /> Statutory Prescription Compliance
          </div>
          <p style={{ fontSize: '0.875rem', color: '#047857', lineHeight: 1.6 }}>
            In accordance with the Drugs and Cosmetics Act and Rules, medicines classified under Schedule H, Schedule H1, and Schedule X can only be dispensed against a valid prescription issued by a Registered Medical Practitioner. Orders containing prescription medications cannot be fulfilled without an attached, authentic prescription document.
          </p>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Crucial Clarification on AI Prescription OCR Scanning
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
          Med-in-Minutes features an intelligent optical character recognition (OCR) and Named Entity Recognition (NER) scanning tool. <strong>AI-based prescription scanning is an assistance feature and does not replace professional or legally required checks.</strong>
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569', marginBottom: '16px' }}>
          <li>
            <strong>Assistance Tool Only:</strong> AI-based prescription scanning is solely an automated customer convenience tool designed to expedite item search and catalog matching.
          </li>
          <li>
            <strong>Does Not Replace Professional Judgment:</strong> The AI engine does <strong>not</strong> make clinical decisions, suggest medical treatments, or replace statutory verification by certified pharmacists.
          </li>
          <li>
            <strong>No Automatic Substitution:</strong> The platform will never automatically substitute your prescribed medication with an alternative chemical brand or strength without customer consent and legal verification.
          </li>
          <li>
            <strong>Final Verification Mandate:</strong> No prescription medication will be packed or dispatched until statutory checks have been satisfied by the fulfilling licensed pharmacy.
          </li>
        </ul>
      </section>

      {/* 5. Payments */}
      <section id="payments" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          5. Payments, Billing &amp; Transaction Safety
        </h2>
        <p style={{ marginBottom: '14px' }}>
          We offer secure, convenient electronic payment options powered by certified payment gateway integrations:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Supported Methods</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking, and Cash on Delivery (COD where eligible).
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Payment Confirmation</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Your order is placed as soon as the payment gateway confirms authorization. A digital invoice is instantly generated with detailed GST breakdowns.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Failed Transactions</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              If your bank account is debited but the order fails to confirm, the payment gateway initiates an automatic reversal within 24 to 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Delivery */}
      <section id="delivery" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          6. Delivery Protocol &amp; 10-Minute Target
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Med-in-Minutes is engineered to deliver critical medications with unprecedented speed through a dense network of licensed neighborhood chemists located within 1.5 to 2 kilometers of delivery zones:
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} color="#059669" /> 10-Minute Delivery Target &amp; Operational Reality
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#065f46', lineHeight: 1.6, marginBottom: '12px' }}>
            The 10-minute delivery target is an operational benchmark achieved by dispatching dedicated electric delivery riders immediately upon pharmacy packaging. While our platform achieves an average delivery time under 10 minutes in serviceable zones, delivery times are <strong>estimates</strong> and are not an unconditional legal guarantee in every circumstance.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#047857' }}>
            <strong>Factors That May Influence Delivery Timelines:</strong> Severe adverse weather (monsoon storms, extreme fog), heavy city traffic, unexpected road closures, peak festival demand, or necessary pharmacist clarification on complex prescription dosages.
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#475569' }}>
          <strong>Secure Handover Code (OTP):</strong> To ensure your medicines reach only you and prevent misplacement, deliveries require providing the 4-digit handover code (OTP) shown on your active order screen to the courier partner upon arrival.
        </p>
      </section>

      {/* 7. Returns and Refunds */}
      <section id="returns-refunds" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          7. Returns, Replacements &amp; Refund Policy
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Because pharmaceutical products are directly related to human health and patient safety, return and refund policies are strictly governed by legal and regulatory frameworks:
        </p>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '18px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, marginBottom: '6px' }}>
            <AlertTriangle size={18} color="#d97706" /> Statutory Return Restrictions on Pharmaceuticals
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5 }}>
            Under applicable pharmaceutical safety regulations, opened, unsealed, or temperature-sensitive medicines (such as insulins and vaccines) cannot be returned or resold once accepted by the customer. This safeguard prevents contamination, counterfeiting, and cold-chain disruption.
          </p>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
          When You Are Eligible for a Full Refund or Free Replacement:
        </h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569', marginBottom: '16px' }}>
          <li>
            <strong>Damaged or Leaking Packaging:</strong> The product package arrived punctured, torn, broken, or leaking at the time of delivery.
          </li>
          <li>
            <strong>Incorrect Medicine Delivered:</strong> The item delivered differs in brand, strength, or quantity from what was ordered and verified on your invoice.
          </li>
          <li>
            <strong>Expired or Near-Expiry Stock:</strong> The delivered product has passed its manufacturer expiry date or has less than 3 months of shelf life remaining (unless explicitly sold as short-dated clearance).
          </li>
          <li>
            <strong>Pre-Dispatch Cancellation:</strong> The order was cancelled by you before the fulfilling pharmacy packaged and handed the parcel to the delivery partner.
          </li>
        </ul>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Refunds are credited back to the original source payment method within <strong>3 to 5 business days</strong> following verification by our support desk.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section id="limitation-of-liability" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          8. Limitation of Liability &amp; Medical Disclaimer
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Med-in-Minutes is a medical logistics and technology provider. The platform does not manufacture pharmaceuticals, diagnose medical conditions, or provide clinical treatments.
        </p>
        <p style={{ marginBottom: '14px', fontSize: '0.875rem', color: '#475569' }}>
          To the maximum extent permitted by applicable law, Med-in-Minutes and its directors, employees, and logistics affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from: (i) any adverse drug reaction or side effect caused by medications properly dispensed per the manufacturer label; (ii) user failure to comply with prescribing doctor instructions; or (iii) unavoidable delivery delays caused by natural disasters, strikes, or municipal emergencies.
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Nothing in these Terms shall limit or exclude any liability that cannot legally be excluded under Indian consumer protection and pharmaceutical laws.
        </p>
      </section>

      {/* 9. Contact */}
      <section id="contact-info">
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          9. Contact Information
        </h2>
        <p style={{ marginBottom: '16px' }}>
          For inquiries or assistance regarding these Terms of Service:
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Helpline</div>
              <a href="tel:1800633646" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>1800-633-646</a>
              <div style={{ fontSize: '0.75rem', color: '#059669' }}>24x7 Support Available</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Legal &amp; Support Email</div>
              <a href="mailto:care@medinminutes.com" style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>care@medinminutes.com</a>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Response in &lt;15 minutes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', gridColumn: '1 / -1' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Corporate Office</div>
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

