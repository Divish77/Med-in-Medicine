'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  EyeOff,
  Server,
  Cookie,
  Mail,
  PhoneCall,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export default function PrivacyPolicyPage() {
  const highlights = [
    {
      icon: <Lock size={20} />,
      title: 'End-to-End Encryption',
      desc: 'All prescription uploads and health records are encrypted in transit and at rest.',
      bgColor: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      icon: <EyeOff size={20} />,
      title: 'Zero Third-Party Ad Sharing',
      desc: 'Your clinical and prescription data is strictly never sold or used for ad targeting.',
      bgColor: '#e0f2fe',
      iconColor: '#0284c7'
    },
    {
      icon: <Database size={20} />,
      title: 'Row Level Security',
      desc: 'Isolated database controls ensure customers can only access their own records.',
      bgColor: '#fef3c7',
      iconColor: '#d97706'
    }
  ];

  const toc = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'information-we-collect', label: '2. Information We Collect' },
    { id: 'how-we-use-information', label: '3. How We Use Information' },
    { id: 'prescription-privacy', label: '4. Prescription Privacy' },
    { id: 'data-security', label: '5. Data Security' },
    { id: 'cookies', label: '6. Cookies & Tracking' },
    { id: 'customer-rights', label: '7. Customer Rights' },
    { id: 'contact-information', label: '8. Contact Information' }
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      badgeText="PATIENT CONFIDENTIALITY & DATA SECURITY"
      badgeIcon={ShieldCheck}
      subtitle="At Med-in-Minutes, your health records, prescriptions, and personal information are treated with the highest level of security, confidentiality, and care."
      lastUpdated="November 1, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Introduction */}
      <section id="introduction" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          1. Introduction &amp; Commitment
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Welcome to <strong>Med-in-Minutes</strong> (operated by <strong>Med-in-Minutes Healthcare Technologies Pvt Ltd</strong>, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We provide an on-demand medical logistics and hyperlocal pharmacy fulfillment platform connecting customers with licensed neighborhood pharmacies for genuine medicine delivery in 10 minutes.
        </p>
        <p style={{ marginBottom: '14px' }}>
          We understand the deeply sensitive nature of personal health and prescription information. This Privacy Policy describes transparently what information we collect when you use our website, mobile interface, AI prescription scanning tools, and delivery services, how we protect it, and your legal rights regarding your data.
        </p>
        <div style={{ background: '#f8fafc', borderLeft: '4px solid #059669', padding: '16px 20px', borderRadius: '0 8px 8px 0', fontSize: '0.875rem' }}>
          <strong>Core Privacy Principle:</strong> We collect and process personal and clinical information solely to provide, fulfill, and verify medicine orders. We do not monetize, rent, or sell your health records.
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-we-collect" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          2. Information We Collect
        </h2>
        <p style={{ marginBottom: '16px' }}>
          To process urgent medicine orders, verify prescription legality, and deliver medications safely to your location within 10 minutes, we collect the following categories of information:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              A. Customer Name &amp; Contact Details
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Your full name, mobile telephone number, alternate phone number (if provided), and communication preferences used for order confirmation, delivery OTPs, and pharmacist consultations.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              B. Email Address &amp; Delivery Address
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Your verified email address (for order receipts, invoices, and account security notifications), complete physical delivery address (flat/house number, building, street, landmark, pincode), and GPS coordinates where location access is granted to assign the closest partner pharmacy within 1.5 to 2 kilometers.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              C. Account &amp; Login Information
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Account identifiers, securely hashed passwords (using bcrypt algorithms), session authentication tokens, saved delivery addresses, and account preferences. Plaintext passwords are never stored or accessible by our staff.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              D. Order &amp; Transaction Details
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Medicines ordered, strengths, dosage forms, quantities, timestamps, transaction amounts, payment method selected, invoice numbers, delivery handover codes (OTP), and order delivery logs.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              E. Prescription Images &amp; Clinical Information
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Where submitted by you: uploaded prescription files (PDF, JPG, JPEG, PNG), camera snapshots, and clinical information extracted by our AI OCR assistance engine (including doctor name, clinic name, date, patient name, prescribed medications, dosage instructions, and duration).
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b', marginBottom: '6px' }}>
              F. Website Usage &amp; Technical Information
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Technical telemetry including browser type, operating system, device characteristics, IP address, referral URLs, error logs, and performance metrics collected to prevent fraud and ensure platform stability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How We Use Information */}
      <section id="how-we-use-information" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          3. How We Use Information
        </h2>
        <p style={{ marginBottom: '14px' }}>
          We use personal and operational data strictly for lawful, healthcare-related purposes:
        </p>

        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
          <li>
            <strong>Creating &amp; Managing Customer Accounts:</strong> Enabling user authentication, saving delivery preferences, and maintaining your personal order history.
          </li>
          <li>
            <strong>Processing Medicine Orders:</strong> Transmitting order line-items and prescription documents to the licensed neighborhood pharmacy fulfilling your order.
          </li>
          <li>
            <strong>Delivering Orders in 10 Minutes:</strong> Providing delivery riders with the optimal routing, delivery address, customer name, and contact details to ensure accurate doorstep delivery and secure handover via 4-digit OTP.
          </li>
          <li>
            <strong>Processing Payments:</strong> Transmitting transaction amounts securely to integrated payment gateway providers and verifying successful payment completion.
          </li>
          <li>
            <strong>Providing Customer Support:</strong> Assisting you via our 24x7 medical helpline (1800-633-646), automated MedAI chat assistant, or email for order adjustments and queries.
          </li>
          <li>
            <strong>Improving Website Performance &amp; Security:</strong> Monitoring API response times, identifying server errors, preventing unauthorized bot activity, and protecting against distributed denial-of-service (DDoS) threats.
          </li>
        </ul>
      </section>

      {/* 4. Prescription Privacy */}
      <section id="prescription-privacy" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          4. Prescription Privacy &amp; Health Data Safeguards
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Medical prescriptions contain highly confidential clinical data. Med-in-Minutes enforces rigorous data governance rules for all prescription documents:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <Lock size={18} color="#059669" /> Encrypted Storage
            </div>
            <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
              Prescription documents are stored in private, access-controlled repositories. Files are never stored in public directories or indexed by public web crawlers.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <UserCheck size={18} color="#059669" /> Need-to-Know Access Only
            </div>
            <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
              Only licensed pharmacists responsible for dispensing Schedule H medicines and authorized fulfillment personnel can access prescription records.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <EyeOff size={18} color="#059669" /> No Unrelated Advertising
            </div>
            <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
              Prescription details and diagnosed medical conditions are never used for commercial advertising, marketing profiling, or third-party behavioral targeting.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#064e3b', fontWeight: 700, marginBottom: '6px' }}>
              <ShieldCheck size={18} color="#059669" /> Account Isolation
            </div>
            <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
              Prescriptions uploaded to your account are permanently tied to your customer ID. Other platform customers cannot view, download, or access your files.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Data Security */}
      <section id="data-security" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          5. Data Security &amp; Infrastructure
        </h2>
        <p style={{ marginBottom: '14px' }}>
          We employ state-of-the-art administrative, technical, and physical safeguards to protect your personal and healthcare information from unauthorized disclosure, loss, or alteration:
        </p>

        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
          <li>
            <strong>Supabase Row Level Security (RLS):</strong> Our database utilizes strict Row Level Security policies. API queries are authenticated with JSON Web Tokens (JWT), guaranteeing that user queries only return records belonging to the authenticated user ID.
          </li>
          <li>
            <strong>Encryption in Transit:</strong> All communications between your browser, mobile device, and our application servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS).
          </li>
          <li>
            <strong>PCI-DSS Compliant Payment Handling:</strong> Payments are processed directly through authorized, certified payment gateways. Med-in-Minutes does not store, capture, or have access to your full credit/debit card numbers, CVV codes, or net banking passwords.
          </li>
          <li>
            <strong>Access Restrictions &amp; Audit Logs:</strong> Access to production servers and administrative controls is strictly restricted to verified personnel and monitored through automated access logs.
          </li>
        </ul>
      </section>

      {/* 6. Cookies */}
      <section id="cookies" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          6. Cookies &amp; Local Storage Technologies
        </h2>
        <p style={{ marginBottom: '14px' }}>
          Our website utilizes standard browser cookies and browser local storage mechanisms (such as <code>localStorage</code> and <code>sessionStorage</code>) for necessary platform functionality:
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '14px' }}>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <li>
              <strong>Essential Authentication Cookies:</strong> Maintaining your active login session securely so you don&apos;t have to log in on every page reload.
            </li>
            <li>
              <strong>Shopping Cart &amp; Location State:</strong> Storing medicines added to your cart, active delivery location, and prescription attachments during your active ordering session.
            </li>
            <li>
              <strong>Security &amp; Abuse Prevention:</strong> Verifying authentic user sessions and preventing Cross-Site Request Forgery (CSRF).
            </li>
            <li>
              <strong>Performance Analytics:</strong> Aggregate, anonymized metrics measuring page load speeds and service availability.
            </li>
          </ul>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          You can adjust your browser settings to refuse or delete cookies. Please note that disabling essential cookies will prevent logging in, shopping cart persistence, and ordering medicines.
        </p>
      </section>

      {/* 7. Customer Rights */}
      <section id="customer-rights" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          7. Customer Rights &amp; Data Retention
        </h2>
        <p style={{ marginBottom: '14px' }}>
          As a valued customer, you have specific rights regarding your personal information:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
            <div>
              <strong>Right to Access:</strong> You can view your past orders, delivery addresses, and uploaded prescriptions at any time by logging into your account.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
            <div>
              <strong>Right to Rectification:</strong> You can update or correct your profile details, contact numbers, and saved delivery addresses through the website interface or by contacting support.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
            <div>
              <strong>Right to Deletion:</strong> You may request the deletion of your account and personal data.
            </div>
          </div>
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '16px', fontSize: '0.85rem', color: '#92400e' }}>
          <strong>Statutory Record Retention Notice:</strong> Under the Drugs and Cosmetics Act and applicable pharmacy practice regulations, records of Schedule H, H1, and X medicine sales, including copies of verified prescriptions, must be retained by licensed dispensing pharmacies for statutory audit periods (typically 2 to 3 years). Such records cannot be deleted prior to the expiration of the legally mandated retention period.
        </div>
      </section>

      {/* 8. Contact Information */}
      <section id="contact-information">
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
          8. Contact Information &amp; Data Grievance
        </h2>
        <p style={{ marginBottom: '16px' }}>
          If you have questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, please reach out to our dedicated privacy and support desk:
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Toll-Free Helpline</div>
              <a href="tel:1800633646" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>1800-633-646</a>
              <div style={{ fontSize: '0.75rem', color: '#059669' }}>24x7 Support Active</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Email Support</div>
              <a href="mailto:care@medinminutes.com" style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>care@medinminutes.com</a>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Response in &lt;15 minutes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', gridColumn: '1 / -1' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Registered Office</div>
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

