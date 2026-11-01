import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { extractPdfText, parsePrescription } from '@/lib/prescriptionScanner';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') || 'guest';
    const userName = formData.get('userName') || 'Customer';

    // Support multiple uploaded files (multi-page/images)
    let uploadedFiles = formData.getAll('files');
    if (!uploadedFiles || uploadedFiles.length === 0) {
      const singleFile = formData.get('prescription') || formData.get('file');
      if (singleFile) uploadedFiles = [singleFile];
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Please choose or photograph a doctor prescription to upload.'
      }, { status: 400 });
    }

    const processedFiles = [];
    let combinedTextLines = [];

    for (const file of uploadedFiles) {
      if (typeof file === 'object' && typeof file.arrayBuffer === 'function') {
        const fileName = file.name || 'prescription.jpg';
        const fileType = file.type || 'image/jpeg';
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${fileType};base64,${base64}`;

        processedFiles.push({
          id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: fileName,
          type: fileType,
          size: file.size,
          dataUrl
        });

        // If PDF, extract embedded text streams
        if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
          const pdfLines = extractPdfText(buffer);
          combinedTextLines.push(...pdfLines);
        }
      }
    }

    // Optional client-side extracted text (e.g. from client OCR or edits)
    const clientExtractedText = formData.get('ocrText');
    if (clientExtractedText) {
      combinedTextLines.push(...String(clientExtractedText).split(/[\r\n]+/));
    }

    // Catalog lookup from existing medicine database
    const catalogMedicines = dbStore.get('medicines') || [];

    // Run AI Clinical Parsing and Medicine Matching
    const scanResult = parsePrescription({
      textLines: combinedTextLines,
      catalogMedicines
    });

    // Check if user provided manual patient / doctor overrides
    const manualPatientName = formData.get('patientName');
    const manualDoctorName = formData.get('doctorName');
    const finalPatientName = String(manualPatientName || scanResult.patientName || userName || 'Customer').trim();
    const finalDoctorName = String(manualDoctorName || scanResult.doctorName || 'Dr. Authorized Practitioner').trim();

    const isClear = scanResult.isClear || scanResult.extractedMedicines.length > 0;

    // Check if prescription is unclear and no medicines could be detected
    if (!isClear) {
      return NextResponse.json({
        success: false,
        unclear: true,
        message: 'The uploaded file could not be recognized as a legible doctor prescription. Please ensure good lighting and upload a clearer photo or PDF.',
        files: processedFiles.map(f => ({ name: f.name, size: f.size }))
      }, { status: 422 });
    }

    const primaryFile = processedFiles[0] || {};
    const prescriptionId = `RX-${Date.now().toString().slice(-6)}`;

    const prescriptionRecord = dbStore.insert('prescriptions', {
      _id: prescriptionId,
      id: prescriptionId,
      userId: String(userId),
      userName: String(userName),
      patientName: finalPatientName,
      doctorName: finalDoctorName,
      clinicName: scanResult.clinicName,
      date: scanResult.date,
      diagnosis: scanResult.diagnosis,
      fileName: primaryFile.name || 'prescription.pdf',
      fileUrl: primaryFile.dataUrl || '',
      files: processedFiles,
      extractedMedicines: scanResult.extractedMedicines,
      matchedMedicines: scanResult.matchedMedicines,
      unavailableMedicines: scanResult.unavailableMedicines,
      status: 'Scanned & Attached',
      verified: true,
      orderId: null,
      notes: scanResult.summaryText
    });

    return NextResponse.json({
      success: true,
      message: 'Prescription scanned successfully! Matching medicines identified.',
      prescription: prescriptionRecord,
      scanResult: {
        ...scanResult,
        patientName: finalPatientName,
        doctorName: finalDoctorName
      }
    }, { status: 201 });

  } catch (err) {
    console.error('Prescription upload & scan error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
