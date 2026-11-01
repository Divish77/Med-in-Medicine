import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

const KNOWLEDGE_BASE = [
  {
    keywords: ['delivery', 'time', 'how long', 'fast', '10 min', '10 minutes', 'speed'],
    reply: "⚡ **Med in Minutes Delivery Promise:**\nWe deliver genuine medicines in **10 minutes**! We partner with licensed local retail pharmacies within 2 km of your location. Our electric scooter delivery partners dispatch immediately once orders are packaged."
  },
  {
    keywords: ['prescription', 'rx', 'schedule h', 'doctor', 'upload prescription'],
    reply: "📋 **Prescription Upload Policy:**\n- OTC medicines (like vitamins, antacids, band-aids) do not need a prescription.\n- Schedule H & H1 medications (like antibiotics and chronic care drugs) require a valid doctor's prescription.\n- Simply click **'Upload Prescription'** at the top or during checkout. Our registered pharmacist verifies it within 2 minutes!"
  },
  {
    keywords: ['return', 'refund', 'cancel', 'exchange'],
    reply: "🔄 **Returns & Refund Policy:**\n- Unopened medicines in their original sterile packaging can be returned if damaged or incorrect upon delivery.\n- You can cancel your order from the **Track Order** page before the rider is dispatched for a 100% instant refund."
  },
  {
    keywords: ['payment', 'cod', 'cash', 'upi', 'card', 'pay'],
    reply: "💳 **Accepted Payment Methods:**\nWe accept **Cash on Delivery (COD)**, **UPI (Google Pay, PhonePe, Paytm)**, **Credit/Debit Cards**, and **Net Banking**. Payment on delivery via QR code is also available with our rider."
  },
  {
    keywords: ['genuine', 'authentic', 'quality', 'fake', 'expiry'],
    reply: "🛡️ **100% Genuine Medicine Guarantee:**\nAll medicines are sourced strictly from licensed distributor pharmacies with manufacturer batch verification and temperature-controlled storage. No expired or unsealed medications are ever dispatched."
  },
  {
    keywords: ['night', '24x7', 'late', 'hours', 'open'],
    reply: "🌙 **24x7 Night Delivery Availability:**\nYes! We operate round-the-clock with dedicated 24x7 licensed night pharmacies for late-night fevers, pediatric emergencies, and pain relief."
  }
];

export async function POST(request) {
  try {
    const { message, context = {} } = await request.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({
        reply: "Hello! I am your **MedAI Pharmacist Assistant**. How can I help you today? You can ask about medicines, delivery times, track an order, or check PIN code serviceability."
      });
    }

    const cleanMsg = message.trim();
    const lower = cleanMsg.toLowerCase();

    // 1. Order ID Lookup (e.g. MIM-123456 or MIM-xxxx)
    const orderMatch = cleanMsg.match(/MIM-?\d{4,8}/i);
    const lookupOrderId = orderMatch ? orderMatch[0].toUpperCase().replace('MIM', 'MIM-') : context.activeOrderId;

    if (lower.includes('track') || lower.includes('order') || orderMatch) {
      if (lookupOrderId) {
        const order = dbStore.findOne('orders', (o) => 
          o.orderId.toLowerCase() === lookupOrderId.toLowerCase() ||
          o.orderId.replace('-', '').toLowerCase() === lookupOrderId.replace('-', '').toLowerCase()
        );

        if (order) {
          const itemsList = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');
          return NextResponse.json({
            reply: `📦 **Order Status for ${order.orderId}:**\n` +
                   `• **Status:** ${order.status}\n` +
                   `• **Current Stage:** ${order.currentStage || order.status}\n` +
                   `• **ETA:** ~${order.etaMinutes || 10} minutes\n` +
                   `• **Delivery Partner:** ${order.deliveryPartner?.name || 'Rahul Sharma'} (${order.deliveryPartner?.phone || '+91 98765 43210'})\n` +
                   `• **Items:** ${itemsList}\n` +
                   `• **Total:** ₹${order.total}\n\n` +
                   `You can view the live GPS scooter map by clicking **'Track Order'** in the navigation bar!`,
            action: { type: 'TRACK_ORDER', orderId: order.orderId }
          });
        }
      }
      if (lower.includes('my order') && !orderMatch) {
        return NextResponse.json({
          reply: "To check your order status, please provide your **Order ID** (e.g. *MIM-497766*) or click the **Track Order** button in the navigation bar."
        });
      }
    }

    // 2. PIN Code Serviceability Check (6 digits)
    const pinMatch = cleanMsg.match(/\b[1-9]\d{5}\b/);
    if (pinMatch || lower.includes('pincode') || lower.includes('pin code') || lower.includes('serviceable')) {
      const pin = pinMatch ? pinMatch[0] : context.pincode;
      if (pin) {
        const pharmacies = dbStore.get('pharmacies');
        const pharmacy = pharmacies.find((p) => p.pincode === pin && p.isOpen !== false);
        if (pharmacy) {
          return NextResponse.json({
            reply: `✅ **PIN Code ${pin} is Serviceable for 10-Minute Delivery!**\n` +
                   `• **Partner Pharmacy:** ${pharmacy.name}\n` +
                   `• **Estimated Delivery Time:** ~${pharmacy.etaMinutes || 10} minutes\n` +
                   `• **Delivery Fee:** ${pharmacy.expressAvailable ? 'FREE' : '₹25'}\n` +
                   `• **City:** ${pharmacy.city || 'Delhi NCR'}\n\n` +
                   `You can place your order now for instant dispatch!`,
            action: { type: 'SET_PINCODE', pincode: pin }
          });
        } else {
          return NextResponse.json({
            reply: `📍 **PIN Code ${pin} Serviceability:**\n` +
                   `Standard delivery is available for ${pin} (2-3 business days). 10-minute instant delivery is currently live in select hubs including Connaught Place (110001), Saket (110017), Dwarka (110075), Indirapuram (201014), Chandigarh (160017), and Patiala (147001).`
          });
        }
      }
    }

    // 3. Medicine Search & Recommendations
    const medicines = dbStore.get('medicines');
    const matchedMeds = medicines.filter(m => {
      const name = m.name.toLowerCase();
      const generic = (m.genericName || '').toLowerCase();
      const cat = (m.category || '').toLowerCase();
      const benefits = (m.benefits || '').toLowerCase();

      return lower.split(/\s+/).some(word => 
        word.length > 2 && (name.includes(word) || generic.includes(word) || cat.includes(word) || benefits.includes(word))
      );
    }).slice(0, 3);

    if (matchedMeds.length > 0) {
      const medListText = matchedMeds.map(m => 
        `💊 **${m.name}**\n` +
        `• **Price:** ₹${m.price} ${m.mrp ? `~~₹${m.mrp}~~ (${m.discountPercent || 10}% OFF)` : ''}\n` +
        `• **Generic:** ${m.genericName || m.category}\n` +
        `• **Prescription Needed:** ${m.prescriptionRequired ? 'Yes (Rx Required)' : 'No (OTC Available)'}\n` +
        `• **Pack Size:** ${m.packSize || 'Standard pack'}`
      ).join('\n\n');

      return NextResponse.json({
        reply: `Here are available medicines matching your inquiry:\n\n${medListText}\n\n*Note: Always read label directions before consumption. For chronic ailments or severe symptoms, please consult a registered medical practitioner.*`,
        medicines: matchedMeds
      });
    }

    // 4. Common FAQs lookup
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => lower.includes(k))) {
        return NextResponse.json({ reply: item.reply });
      }
    }

    // 5. Default friendly response with quick suggestion prompts
    return NextResponse.json({
      reply: `I am your **MedAI Pharmacist Assistant** for Med in Minutes ⚡.\n\n` +
             `Here are some things I can help you with:\n` +
             `• **Check Delivery Speed:** "How fast is delivery?"\n` +
             `• **Check PIN Code:** "Is 110001 serviceable?"\n` +
             `• **Track Order:** "Track order MIM-497766"\n` +
             `• **Find Medicines:** "Do you have Dolo 650 or cough syrup?"\n` +
             `• **Prescription Rules:** "How do I upload my doctor prescription?"\n\n` +
             `What would you like assistance with?`
    });

  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({
      reply: "Sorry, I encountered an issue processing your question. Please try asking again or contact our 24x7 pharmacist desk directly."
    }, { status: 500 });
  }
}

