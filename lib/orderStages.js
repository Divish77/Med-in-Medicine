export const ORDER_STAGES = [
  { status: 'Order Placed', description: 'Order received and registered in Med-in-Minutes network.', icon: 'CheckCircle2' },
  { status: 'Order Accepted by Pharmacy', description: 'Partner pharmacy accepted order and allocated stock.', icon: 'Store' },
  { status: 'Prescription Verification', description: 'Prescription checked before dispatch when required.', icon: 'FileCheck' },
  { status: 'Medicines Being Packed', description: 'Medicines sealed in tamper-proof sterile delivery pouch.', icon: 'Package' },
  { status: 'Delivery Partner Assigned', description: 'A delivery partner has been assigned to this order.', icon: 'Bike' },
  { status: 'Out for Delivery', description: 'Delivery partner is on the way to the customer.', icon: 'Navigation' },
  { status: 'Successfully Delivered', description: 'Package handed over securely after OTP verification.', icon: 'Home' }
];

