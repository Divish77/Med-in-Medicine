import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId');
    const userName = formData.get('userName');
    const patientName = formData.get('patientName');
    const doctorName = formData.get('doctorName');
    const file = formData.get('prescription');

    if (!userId || !userName || !String(patientName || '').trim() || !String(doctorName || '').trim()) {
      return NextResponse.json({ success: false, message: 'Signed-in customer, patient name, and prescribing doctor are required.' }, { status: 400 });
    }

    let fileUrl = '';
    let fileName = 'prescription.jpg';

    if (file && typeof file === 'object') {
      fileName = file.name || 'prescription.jpg';
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mime = file.type || 'image/jpeg';
      fileUrl = `data:${mime};base64,${base64}`;
    }

    const prescriptionRecord = dbStore.insert('prescriptions', {
      userId: String(userId),
      userName: String(userName),
      fileName,
      fileUrl,
      patientName: String(patientName).trim(),
      doctorName: String(doctorName).trim(),
      status: 'Pending Verification',
      pharmacistNotes: '',
      verifiedBy: '',
      verifiedAt: null
    });

    return NextResponse.json({
      success: true,
      message: 'Prescription uploaded and is awaiting pharmacist review.',
      prescription: prescriptionRecord
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
