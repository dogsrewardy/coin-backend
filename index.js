const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.post("/addCoins", async (req, res) => {
  const { uid, coins } = req.body;

  if (!uid || !coins) {
    return res.status(400).send("Missing uid or coins");
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      coins: admin.firestore.FieldValue.increment(coins),
    });
    res.status(200).send("Coins added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to add coins");
  }
});

app.get("/", (req, res) => {
  res.send("Server is working!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
