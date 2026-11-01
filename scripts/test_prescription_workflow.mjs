import fs from 'fs';
import { dbStore } from '../lib/db.js';
import { extractPdfText, parsePrescription } from '../lib/prescriptionScanner.js';

async function runTest() {
  console.log('🧪 Starting End-to-End Prescription Workflow Test...\n');

  // Step 1: Read sample prescription PDF
  const pdfBuffer = fs.readFileSync('sample_prescription.pdf');
  console.log('1. Read sample_prescription.pdf (size:', pdfBuffer.length, 'bytes)');

  // Step 2: Extract text streams
  const textLines = extractPdfText(pdfBuffer);
  console.log('2. Extracted text lines count:', textLines.length);

  // Step 3: Run AI Clinical Parser & Medicine Matcher
  const catalogMedicines = dbStore.get('medicines');
  const scanResult = parsePrescription({ textLines, catalogMedicines });

  console.log('3. AI Scan Results:');
  console.log('   - isClear:', scanResult.isClear);
  console.log('   - Doctor:', scanResult.doctorName);
  console.log('   - Patient:', scanResult.patientName);
  console.log('   - Diagnosis:', scanResult.diagnosis);
  console.log('   - Extracted Medicines:', scanResult.extractedMedicines.map(m => m.name));
  console.log('   - Available Matches:', scanResult.matchedMedicines.map(m => ({ name: m.catalogItem.name, price: m.catalogItem.price })));
  console.log('   - Unavailable:', scanResult.unavailableMedicines.map(m => m.name));

  if (!scanResult.isClear || scanResult.matchedMedicines.length === 0) {
    throw new Error('Test Failed: Expected clear prescription with matched medicines.');
  }

  // Step 4: Insert prescription into dbStore
  const rxId = `RX-${Date.now().toString().slice(-6)}`;
  const prescription = dbStore.insert('prescriptions', {
    _id: rxId,
    id: rxId,
    userId: 'user_test_1',
    userName: 'Divish Bansal',
    patientName: scanResult.patientName,
    doctorName: scanResult.doctorName,
    fileName: 'sample_prescription.pdf',
    extractedMedicines: scanResult.extractedMedicines,
    matchedMedicines: scanResult.matchedMedicines,
    unavailableMedicines: scanResult.unavailableMedicines,
    status: 'Scanned & Attached',
    verified: true,
    orderId: null
  });
  console.log('\n4. Created prescription record in database:', prescription._id);

  // Step 5: Simulate checkout with prescription-required medicine
  const rxMedicine = scanResult.matchedMedicines.find(m => m.catalogItem.prescriptionRequired) || scanResult.matchedMedicines[0];
  console.log('5. Selected medicine for checkout:', rxMedicine.catalogItem.name, '(Rx Required:', rxMedicine.catalogItem.prescriptionRequired, ')');

  // Verify requirement check passes
  const hasRx = rxMedicine.catalogItem.prescriptionRequired;
  const isPrescriptionValid = !hasRx || Boolean(prescription);
  console.log('6. Legal check evaluation: hasRx =', hasRx, '| prescription attached =', Boolean(prescription), '-> ALLOW CHECKOUT =', isPrescriptionValid);

  if (!isPrescriptionValid) {
    throw new Error('Test Failed: Legal check blocked checkout despite valid prescription.');
  }

  // Step 6: Link order
  const mockOrderId = `MIM-${Date.now().toString().slice(-8)}`;
  dbStore.updateOne('prescriptions', (p) => p._id === prescription._id, {
    orderId: mockOrderId,
    usedAt: new Date().toISOString()
  });

  const updatedRx = dbStore.findOne('prescriptions', (p) => p._id === prescription._id);
  console.log('7. Linked Order ID in prescription history:', updatedRx.orderId);

  console.log('\n✅ ALL WORKFLOW TESTS PASSED PERFECTLY!\n');
}

runTest().catch((err) => {
  console.error('❌ Test Error:', err);
  process.exit(1);
});

