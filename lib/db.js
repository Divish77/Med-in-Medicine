import fs from 'fs';
import path from 'path';
import defaultDb from './defaultDb.json' with { type: 'json' };
import { seedMedicinesList, seedPharmaciesList, serviceablePincodesSeed } from './seedData.js';

const TMP_ORDERS_PATH = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'mim_orders.json');
const TMP_PRESCRIPTIONS_PATH = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'mim_prescriptions.json');

// Ensure global database state persists across serverless function invocations
if (!globalThis.__mim_db__) {
  let initialOrders = defaultDb.orders || [];
  let initialPrescriptions = defaultDb.prescriptions || [];
  try {
    if (fs.existsSync(TMP_ORDERS_PATH)) {
      const persisted = JSON.parse(fs.readFileSync(TMP_ORDERS_PATH, 'utf8'));
      if (Array.isArray(persisted) && persisted.length > 0) {
        initialOrders = persisted;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(TMP_PRESCRIPTIONS_PATH)) {
      const persistedRx = JSON.parse(fs.readFileSync(TMP_PRESCRIPTIONS_PATH, 'utf8'));
      if (Array.isArray(persistedRx) && persistedRx.length > 0) {
        initialPrescriptions = persistedRx;
      }
    }
  } catch {}

  const initialData = {
    users: defaultDb.users || [],
    medicines: (defaultDb.medicines && defaultDb.medicines.length > 0) ? defaultDb.medicines : seedMedicinesList,
    pharmacies: (defaultDb.pharmacies && defaultDb.pharmacies.length > 0) ? defaultDb.pharmacies : seedPharmaciesList,
    prescriptions: initialPrescriptions,
    orders: initialOrders,
    serviceablePincodes: defaultDb.serviceablePincodes || serviceablePincodesSeed || []
  };

  // Ensure each medicine has _id
  initialData.medicines = initialData.medicines.map((m, idx) => ({
    ...m,
    _id: m._id || `med_${idx + 1}`
  }));

  globalThis.__mim_db__ = initialData;
}

const syncTmpOrders = () => {
  try {
    if (globalThis.__mim_db__?.orders) {
      fs.writeFileSync(TMP_ORDERS_PATH, JSON.stringify(globalThis.__mim_db__.orders));
    }
  } catch {}
};

const syncTmpPrescriptions = () => {
  try {
    if (globalThis.__mim_db__?.prescriptions) {
      fs.writeFileSync(TMP_PRESCRIPTIONS_PATH, JSON.stringify(globalThis.__mim_db__.prescriptions));
    }
  } catch {}
};

export const dbStore = {
  get(collection) {
    return globalThis.__mim_db__[collection] || [];
  },

  find(collection, predicate) {
    const list = this.get(collection);
    return predicate ? list.filter(predicate) : list;
  },

  findOne(collection, predicate) {
    const list = this.get(collection);
    return list.find(predicate) || null;
  },

  insert(collection, item) {
    if (!globalThis.__mim_db__[collection]) {
      globalThis.__mim_db__[collection] = [];
    }
    const record = {
      _id: item._id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    globalThis.__mim_db__[collection].push(record);
    if (collection === 'orders') syncTmpOrders();
    if (collection === 'prescriptions') syncTmpPrescriptions();
    return record;
  },

  updateOne(collection, predicate, updates) {
    const list = this.get(collection);
    const index = list.findIndex(predicate);
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      _id: current._id,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    if (collection === 'orders') syncTmpOrders();
    if (collection === 'prescriptions') syncTmpPrescriptions();
    return updated;
  },

  deleteOne(collection, predicate) {
    const list = this.get(collection);
    const index = list.findIndex(predicate);
    if (index === -1) return false;
    list.splice(index, 1);
    if (collection === 'orders') syncTmpOrders();
    if (collection === 'prescriptions') syncTmpPrescriptions();
    return true;
  },

  delete(collection, predicate) {
    return this.deleteOne(collection, predicate);
  },

  count(collection) {
    return this.get(collection).length;
  }
};

