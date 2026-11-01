const fs = require('fs');
const path = require('path');

function createPrescriptionPdf(outputPath) {
  // A4 dimensions in PDF points: 595.28 x 841.89
  const W = 595.28;
  const H = 841.89;

  let stream = '';

  function text(font, size, x, y, str, r = 0, g = 0, b = 0) {
    const safeStr = str.replace(/[()\\]/g, '\\$&');
    stream += `BT /${font} ${size} Tf ${r} ${g} ${b} rg 1 0 0 1 ${x} ${y} Tm (${safeStr}) Tj ET\n`;
  }

  function line(x1, y1, x2, y2, r = 0.8, g = 0.8, b = 0.8, w = 1) {
    stream += `${r} ${g} ${b} RG ${w} w ${x1} ${y1} m ${x2} ${y2} l S\n`;
  }

  function rect(x, y, w, h, fillR = 0.96, fillG = 0.98, fillB = 0.97, strokeR = 0.02, strokeG = 0.59, strokeB = 0.41, strokeW = 1) {
    stream += `${fillR} ${fillG} ${fillB} rg ${strokeR} ${strokeG} ${strokeB} RG ${strokeW} w ${x} ${y} ${w} ${h} B\n`;
  }

  // Clinic Header Box
  rect(36, H - 115, W - 72, 85, 0.94, 0.98, 0.96, 0.02, 0.59, 0.41, 1.5);
  text('F2', 17, 50, H - 62, 'APOLLO CLINIC & HEALTHCARE CENTRE', 0.02, 0.45, 0.32);
  text('F1', 9.5, 50, H - 78, 'Licensed Multi-Speciality Clinic & Certified Diagnostic Tele-Healthcare Facility', 0.25, 0.35, 0.4);
  text('F1', 9, 50, H - 93, 'Connaught Place, Central Delhi - 110001 | 24x7 Helpline: 1800-633-646 | Reg: DL-MED-99410', 0.35, 0.4, 0.45);

  // Doctor Info
  text('F2', 13, 36, H - 142, 'Dr. Rajesh Sharma, MBBS, M.D.', 0.08, 0.15, 0.25);
  text('F1', 9.5, 36, H - 157, 'Senior Consultant Physician & Internal Medicine Specialist', 0.25, 0.3, 0.35);
  text('F1', 9, 36, H - 171, 'Reg. No: DMC / 48291 / 2012 (Delhi Medical Council)', 0.4, 0.45, 0.5);

  text('F2', 10, W - 180, H - 142, 'Date: 01 November 2026', 0.1, 0.1, 0.1);
  text('F1', 9, W - 180, H - 157, 'Prescription #: RX-2026-90412', 0.3, 0.3, 0.3);
  text('F1', 9, W - 180, H - 171, 'Validity: 30 Days from issue', 0.3, 0.3, 0.3);

  line(36, H - 182, W - 36, H - 182, 0.02, 0.59, 0.41, 2);

  // Patient Card
  rect(36, H - 246, W - 72, 54, 0.98, 0.99, 1.0, 0.85, 0.9, 0.95, 1);
  text('F2', 10, 48, H - 206, 'PATIENT NAME:', 0.2, 0.25, 0.3);
  text('F2', 11, 140, H - 206, 'Divish Bansal', 0.05, 0.1, 0.2);
  text('F2', 10, 310, H - 206, 'AGE / GENDER:', 0.2, 0.25, 0.3);
  text('F1', 10.5, 400, H - 206, '24 Yrs / Male', 0.1, 0.1, 0.1);

  text('F2', 10, 48, H - 230, 'DIAGNOSIS:', 0.2, 0.25, 0.3);
  text('F1', 10, 140, H - 230, 'Acute URI, Mild Pyrexia (Fever) & Non-Productive Cough', 0.15, 0.2, 0.25);
  text('F2', 10, 430, H - 230, 'VITALS:', 0.2, 0.25, 0.3);
  text('F1', 9, 482, H - 230, 'BP 120/80 | SpO2 99%', 0.3, 0.3, 0.3);

  // Rx Heading
  text('F2', 26, 36, H - 286, 'Rx', 0.02, 0.45, 0.32);
  text('F1', 9.5, 76, H - 280, '(Prescribed Medicines - Take strictly as directed by physician)', 0.4, 0.45, 0.5);

  line(36, H - 296, W - 36, H - 296, 0.85, 0.85, 0.85, 1);

  // Medications List
  const medicines = [
    {
      num: '1.',
      name: 'Tab. Dolo 650 mg (Paracetamol)',
      dose: '1 Tablet - Thrice Daily (After food)',
      dur: '3 Days',
      note: 'For fever, headache & body aches'
    },
    {
      num: '2.',
      name: 'Tab. Azithral 500 mg (Azithromycin)',
      dose: '1 Tablet - Once Daily (1 hour before food)',
      dur: '3 Days',
      note: 'Schedule H Antibiotic - Complete full 3-day course'
    },
    {
      num: '3.',
      name: 'Tab. Pan 40 mg (Pantoprazole)',
      dose: '1 Tablet - Once Daily (Morning empty stomach)',
      dur: '5 Days',
      note: 'Take 30 mins before breakfast to prevent acidity'
    },
    {
      num: '4.',
      name: 'Syp. Benadryl Cough Formula',
      dose: '10 ml - Twice Daily (After meals)',
      dur: '5 Days',
      note: 'For throat irritation and persistent dry cough'
    }
  ];

  let curY = H - 325;
  medicines.forEach((m) => {
    rect(36, curY - 26, W - 72, 42, 0.98, 0.99, 0.99, 0.88, 0.92, 0.92, 0.8);
    text('F2', 11, 46, curY, m.num, 0.02, 0.45, 0.32);
    text('F2', 11, 64, curY, m.name, 0.08, 0.15, 0.25);
    text('F2', 9.5, W - 130, curY, 'Duration: ' + m.dur, 0.2, 0.3, 0.4);
    text('F1', 9.5, 64, curY - 16, 'Dosage: ' + m.dose + '  |  ' + m.note, 0.3, 0.35, 0.4);
    curY -= 54;
  });

  // General Instructions
  curY -= 15;
  text('F2', 11, 36, curY, 'General Advice & Precautions:', 0.08, 0.15, 0.25);
  curY -= 18;
  const advices = [
    '• Maintain adequate oral hydration (drink 2.5 - 3 liters of warm water daily).',
    '• Steam inhalation twice daily for throat and nasal passage soothing.',
    '• Avoid cold beverages, oily / spicy food, and direct air conditioner exposure.',
    '• If temperature persists above 101 F after 48 hours, follow up immediately.'
  ];
  advices.forEach((adv) => {
    text('F1', 9.5, 42, curY, adv, 0.3, 0.35, 0.4);
    curY -= 16;
  });

  // Digital Signature & Seal Stamp
  const stampY = 120;
  rect(W - 220, stampY, 184, 82, 0.97, 0.99, 0.98, 0.02, 0.59, 0.41, 1.2);
  text('F2', 9, W - 208, stampY + 64, 'VERIFIED & DIGITALLY SIGNED', 0.02, 0.45, 0.32);
  text('F2', 11, W - 208, stampY + 46, 'Dr. Rajesh Sharma, MD', 0.08, 0.15, 0.25);
  text('F1', 8.5, W - 208, stampY + 30, 'Delhi Medical Council Reg # 48291', 0.3, 0.35, 0.4);
  text('F1', 8, W - 208, stampY + 14, 'Authorized Clinical E-Prescription Seal', 0.4, 0.5, 0.4);

  // Footer Disclaimer
  line(36, 60, W - 36, 60, 0.85, 0.85, 0.85, 1);
  text('F1', 8, 36, 44, 'This electronic prescription is compliant under the Indian Information Technology Act 2000 & Drugs and Cosmetics Rules.', 0.5, 0.55, 0.6);
  text('F1', 8, 36, 32, 'Dispensing pharmacist must verify batch numbers and patient identity upon fulfillment on Med-in-Minutes.', 0.5, 0.55, 0.6);

  // Assemble PDF Structure
  const streamLen = Buffer.byteLength(stream, 'utf-8');

  let pos = [];
  let pdf = '%PDF-1.4\n';

  function addObj(content) {
    pos.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += content + '\n';
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  addObj(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj`);
  addObj(`4 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}endstream\nendobj`);
  addObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  addObj('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += 'xref\n0 7\n0000000000 65535 f \n';
  for (let i = 0; i < 6; i++) {
    pdf += String(pos[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF';

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(pdf, 'utf-8'));
  console.log('Successfully generated:', outputPath);
}

// Generate in public/ and root directory
createPrescriptionPdf('public/sample_prescription.pdf');
createPrescriptionPdf('sample_prescription.pdf');

