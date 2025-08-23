import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();
app.use(express.json());

// 1. Obtenir un token d'accès
const getToken = async () => {
  try {
    const res = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/token/",
      {},
      {
        auth: {
          username: process.env.MOMO_API_USER,
          password: process.env.MOMO_API_KEY,
        },
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
        },
      }
    );
    return res.data.access_token;
  } catch (err) {
    console.error("Erreur getToken:", err.response?.data || err.message);
    throw err;
  }
};

const getPaymentStatus = async (referenceId) => {
  try {
    const token = await getToken();

    const res = await axios.get(
      `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": process.env.MOMO_ENV,
          "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status paiement :", res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur statut paiement:", err.response?.data || err.message);
  }
};


app.get('/verifEtat/:referenceId', async (req, res) => {
  try {
    const referenceId = req.params.referenceId;
    const status = await getPaymentStatus(referenceId);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Endpoint pour tester un débit client
app.post("/debit", async (req, res) => {
  try {
    const token = await getToken();
    const referenceId = uuidv4();

    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      {
        amount: "1000", // Montant à débiter
        currency: "EUR",
        externalId: "123456",
        payer: { partyIdType: "MSISDN", partyId: "46732123450" }, // Numéro fictif sandbox
        payerMessage: "Test debit",
        payeeNote: "Sandbox",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": process.env.MOMO_ENV,
          "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // res.json({
    //   message: "Requête de débit envoyée",
    //   referenceId,
    //   status: response.status,
    // });

    const status = await getPaymentStatus(referenceId);
    res.json(status);

  } catch (err) {
    console.error("Erreur debit:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 3. Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${process.env.PORT}`);
});
