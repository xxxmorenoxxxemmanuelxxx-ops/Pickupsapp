// resetAndPopulateFirestore.js
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Load your service account
const serviceAccount = require("./serviceAccountKey.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✅ Cleared collection: ${collectionName}`);
}

async function populateSamples() {
  console.log("Populating Firestore with sample data...");

  // =====================
  // SAMPLE DRIVERS
  // =====================
  const drivers = [
    { id: "driver_1", latitude: 34.05, longitude: -118.25, status: "available" },
    { id: "driver_2", latitude: 34.06, longitude: -118.24, status: "busy" },
    { id: "driver_3", latitude: 34.07, longitude: -118.26, status: "available" },
  ];

  for (const d of drivers) {
    await db.collection("drivers").doc(d.id).set({
      latitude: d.latitude,
      longitude: d.longitude,
      status: d.status,
      lastUpdated: new Date(),
    });
  }

  // =====================
  // SAMPLE PACKAGES
  // =====================
  const packages = [
    {
      id: "package_1",
      userId: "user_1",
      pickupAddress: "100 Main St",
      dropoffAddress: "200 Oak St",
      status: "pending",
      assignedDriver: null,
    },
    {
      id: "package_2",
      userId: "user_2",
      pickupAddress: "300 Pine St",
      dropoffAddress: "400 Maple St",
      status: "pending",
      assignedDriver: null,
    },
  ];

  for (const p of packages) {
    await db.collection("packages").doc(p.id).set({
      ...p,
      createdAt: new Date(),
    });
  }

  // =====================
  // SAMPLE CHATS
  // =====================
  const chats = [
    {
      id: "chat_1",
      participants: ["user_1", "driver_1"],
      messages: [{ senderId: "user_1", text: "Hi driver!", timestamp: new Date() }],
    },
    {
      id: "chat_2",
      participants: ["user_2", "driver_2"],
      messages: [{ senderId: "driver_2", text: "On my way!", timestamp: new Date() }],
    },
  ];

  for (const c of chats) {
    await db.collection("chats").doc(c.id).set(c);
  }

  console.log("🎉 Firestore sample data setup complete!");
}

async function resetAndPopulate() {
  try {
    // Clear old data
    await clearCollection("drivers");
    await clearCollection("packages");
    await clearCollection("chats");

    // Populate fresh samples
    await populateSamples();
  } catch (err) {
    console.error("❌ Error during reset:", err);
  }
}

resetAndPopulate();
