// initializeFirestoreCollections.js
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Load your service account JSON
const serviceAccount = require("./serviceAccountKey.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

async function setupCollections() {
  console.log("Setting up initial collections...");

  // =====================
  // DRIVERS COLLECTION
  // =====================
  const driversRef = db.collection("drivers").doc("sampleDriver");
  await driversRef.set({
    latitude: 0,
    longitude: 0,
    status: "available",
    lastUpdated: new Date(),
  });

  // =====================
  // PACKAGES COLLECTION
  // =====================
  const packagesRef = db.collection("packages").doc("samplePackage");
  await packagesRef.set({
    userId: "sampleUser",
    pickupAddress: "123 Main St",
    dropoffAddress: "456 Elm St",
    status: "pending",
    assignedDriver: null,
    createdAt: new Date(),
  });

  // =====================
  // CHATS COLLECTION
  // =====================
  const chatsRef = db.collection("chats").doc("sampleChat");
  await chatsRef.set({
    participants: ["sampleUser", "sampleDriver"],
    messages: [
      { senderId: "sampleUser", text: "Hello!", timestamp: new Date() },
    ],
  });

  console.log("Firestore collections setup complete!");
}

setupCollections().catch(console.error);
