# Med in Minutes ⚡
### Ultra-Fast 10-Minute Medicine & Healthcare Delivery Platform

**Med in Minutes** connects customers with nearby licensed pharmacies to deliver essential medicines, emergency care kits, and prescription drugs straight to your doorstep in just 10 minutes.

---

## 🌟 Key Features & Requirements Implemented

### 1. Informative Homepage – Purpose of the Website
- **Dedicated Hero Section** featuring:
  - **Main Heading:** *"Medicines at Your Doorstep in Just 10 Minutes!"*
  - **Subheading:** *"Med in Minutes makes healthcare more accessible by connecting customers with nearby pharmacies and delivering essential medicines and healthcare products quickly and conveniently."*
  - **Supporting Text:** *"Forgot to refill your medicines? Need essential healthcare products urgently? Simply search for your medicines, upload your prescription when required, place your order, and get it delivered to your doorstep."*
  - Two prominent action buttons: **Order Medicines** and **Upload Prescription**.
  - Custom visual 3D illustration showing an express delivery partner with an emergency medicine package.

### 2. How Med in Minutes Works (4-Step Visual Journey)
1. **Enter Your Location:** Share GPS coordinates or enter a 6-digit PIN code.
2. **Choose Medicines:** Search authentic catalog or upload doctor's prescription.
3. **Place Your Order:** Review cart, complete pharmacist verification for Rx items, and pay securely.
4. **Get It Delivered:** Track dedicated electric scooter rider in real time and receive package in 10 minutes.

### 3. Location Services & Address Management
- **Automatic First-Visit Popup:** *"Where should we deliver your medicines?"*
- Three selection modes:
  - **Use Current Location:** Browser geolocation permission with GPS reverse geocode.
  - **Enter PIN Code:** Instant serviceability verification, ETA calculation, and pharmacy allocation.
  - **Enter Address Manually:** House, Street, Area, City, PIN, and Landmark.
- **Address Book Management:** Save multiple delivery addresses with **Home**, **Work**, and **Other** labels, edit and delete addresses.
- **Serviceability Safeguard:** Prevents checkout for unavailable locations and dynamically calculates actual delivery times (10-minute express vs standard 15-20 min).
- **Interactive Leaflet Map:** Displays service coverage, nearby pharmacy location, and draggable destination pin.

### 4. Order Tracking System
- Accessible from the Navigation Bar (`Track Order`) and customer dashboard.
- Every order receives a unique Order ID (e.g. `MIM-497766`).
- **8-Stage Order Progress Timeline:**
  1. Order Placed
  2. Payment Confirmed
  3. Prescription Verification (if applicable)
  4. Order Accepted by Pharmacy
  5. Medicines Being Packed
  6. Delivery Partner Assigned
  7. Out for Delivery
  8. Successfully Delivered
- **Live GPS Map:** Moving delivery partner icon with route line to customer doorstep.
- **Delivery Partner Info:** Rider name (*Rahul Sharma*), EV scooter registration, photo, rating, and call button.
- **Real-Time WebSockets:** Powered by Socket.IO.
- **Simulated Delivery Tracking Flow:** Interactive demo control panel to advance stages or auto-simulate transit.

### 5. Order Completion & Delivery Confirmation
- **Authorized Delivery Confirmation Action:** Order is only marked delivered through deliberate confirmation action (OTP handover verification), not merely countdown expiration.
- **Celebration Success Screen:** With confetti animation and exact mandatory messages:
  - *"Your Medicines Have Been Delivered!"*
  - *"Thank you for choosing Med in Minutes. We hope to serve you again."*
- **Order Summary & Total Paid:** Breakdown of items, fees, and taxes.
- **Download Tax Invoice:** Official printable medical tax invoice with Pharmacy Drug License, GSTIN, batch numbers, and expiry dates.
- **5-Star Rating & Feedback:** Customer experience tags (*Super Fast ⚡*, *Polite Rider 😊*, *Tamper-Proof Pouch 🔒*) and feedback submission.
- **Reorder Option:** 1-click reorder to populate eligible items back into cart.
- **Report an Issue & Order History:** Direct dispute escalation and order archive.

### 6. Additional Homepage Sections
- **Why Choose Med in Minutes?:** Fast Medicine Delivery, Nearby Pharmacy Network, Easy Prescription Upload, Secure Online Payments, Real-Time Order Tracking, Convenient Doorstep Delivery.
- **Our Delivery Promise:** *"Healthcare Should Never Have to Wait."*
- **Order Tracking Preview:** Illustrative animated 8-stage preview.
- **Service Availability:** Live PIN code availability lookup.
- **Frequently Asked Questions (FAQ):** 6 detailed accordion Q&As.

### 7. Responsive Navigation Bar
- Brand logo with express badge.
- Real-time location selector chip with current PIN & ETA.
- Links: **Home**, **Medicines**, **Categories**, **Upload Prescription**, **Track Order**, **About Us**, **Contact Us**, **Login / Sign Up**, and **Cart** (with live badge counter).
- Mobile-responsive drawer menu.

### 8. Complete Order Management & Backend
- Unified end-to-end customer journey from homepage to delivery confirmation.
- Persistent database adapter supporting **MongoDB / Mongoose** and automatic fallback to durable JSON database storage.
- Real-time **Socket.IO** rooms for live order updates.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Vanilla CSS with modern Design System, Lucide React, Leaflet Maps, Canvas Confetti.
- **Backend:** Node.js, Express, Socket.IO, Mongoose, Multer, JWT, Bcrypt.
- **Database:** Persistent storage engine with MongoDB Atlas / Mongoose compatibility.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install
npm --prefix client install

# Start both backend server (port 5000) and frontend (port 5173) concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
