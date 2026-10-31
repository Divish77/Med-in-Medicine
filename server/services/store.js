import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
const initialData = {
  users: [],
  medicines: [],
  pharmacies: [],
  prescriptions: [],
  orders: [],
  serviceablePincodes: [
    { pincode: "110001", area: "Connaught Place", city: "New Delhi", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo Pharmacy Connaught Place" },
    { pincode: "110016", area: "Hauz Khas / Green Park", city: "New Delhi", expressDelivery: true, etaMinutes: 10, pharmacyName: "MedPlus Express Hauz Khas" },
    { pincode: "110024", area: "Defence Colony", city: "New Delhi", expressDelivery: true, etaMinutes: 10, pharmacyName: "Wellness Forever 24x7" },
    { pincode: "560001", area: "MG Road / Central", city: "Bangalore", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo Pharmacy MG Road" },
    { pincode: "560034", area: "Koramangala", city: "Bangalore", expressDelivery: true, etaMinutes: 10, pharmacyName: "MedPlus Koramangala 4th Block" },
    { pincode: "560102", area: "HSR Layout", city: "Bangalore", expressDelivery: true, etaMinutes: 10, pharmacyName: "Wellness Forever HSR" },
    { pincode: "400001", area: "Fort / Colaba", city: "Mumbai", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo Pharmacy Fort" },
    { pincode: "400050", area: "Bandra West", city: "Mumbai", expressDelivery: true, etaMinutes: 10, pharmacyName: "Noble Plus Bandra" },
    { pincode: "400053", area: "Andheri West", city: "Mumbai", expressDelivery: true, etaMinutes: 10, pharmacyName: "MedPlus Andheri West" },
    { pincode: "122002", area: "Cyber City / DLF", city: "Gurgaon", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo Express DLF Phase 2" },
    { pincode: "201301", area: "Sector 18", city: "Noida", expressDelivery: true, etaMinutes: 10, pharmacyName: "Guardian Pharmacy Sector 18" },
    { pincode: "160017", area: "Sector 17", city: "Chandigarh", expressDelivery: true, etaMinutes: 10, pharmacyName: "MedPlus Sector 17" },
    { pincode: "147001", area: "Model Town / City", city: "Patiala", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo Pharmacy Patiala" },
    { pincode: "500081", area: "Hitec City / Madhapur", city: "Hyderabad", expressDelivery: true, etaMinutes: 10, pharmacyName: "Apollo 24x7 Hitec City" },
    { pincode: "600002", area: "Anna Salai", city: "Chennai", expressDelivery: true, etaMinutes: 10, pharmacyName: "MedPlus Anna Salai" },
    { pincode: "700016", area: "Park Street", city: "Kolkata", expressDelivery: true, etaMinutes: 10, pharmacyName: "Dhanwantary Park Street" }
  ]
};

class PersistentStore {
  constructor() {
    this.cache = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(content);
      } else {
        this.cache = { ...initialData };
        this.save();
      }
    } catch (err) {
      console.error("Error initializing PersistentStore:", err);
      this.cache = { ...initialData };
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error saving PersistentStore to disk:", err);
    }
  }

  get(collection) {
    if (!this.cache[collection]) {
      this.cache[collection] = [];
    }
    return this.cache[collection];
  }

  find(collection, predicate) {
    const list = this.get(collection);
    return predicate ? list.filter(predicate) : list;
  }

  findOne(collection, predicate) {
    const list = this.get(collection);
    return list.find(predicate);
  }

  insert(collection, item) {
    const list = this.get(collection);
    const newItem = {
      _id: item._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    list.push(newItem);
    this.save();
    return newItem;
  }

  updateOne(collection, predicate, updateFields) {
    const list = this.get(collection);
    const index = list.findIndex(predicate);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updateFields,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return list[index];
  }

  deleteOne(collection, predicate) {
    const list = this.get(collection);
    const index = list.findIndex(predicate);
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }

  seedInitialData(medicines, pharmacies) {
    if (this.cache.medicines.length === 0 && medicines && medicines.length > 0) {
      this.cache.medicines = medicines;
    }
    if (this.cache.pharmacies.length === 0 && pharmacies && pharmacies.length > 0) {
      this.cache.pharmacies = pharmacies;
    }
    this.save();
  }
}

export const dbStore = new PersistentStore();
