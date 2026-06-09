import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Yalidine
app.get("/api/yalidine", async (req, res) => {
  try {
    const response = await fetch("https://api.yalidine.app/v1/parcels/?page_size=100", {
      headers: {
        "X-API-ID": req.headers["x-api-id"] || "",
        "X-API-TOKEN": req.headers["x-api-token"] || "",
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Yalidine fetch failed" });
  }
});

// ✅ Maystro
app.get("/api/maystro", async (req, res) => {
  try {
    const storeId = req.query.store_id;
    const response = await fetch(
      `https://orders-management.maystro-delivery.com/api/orders/?store_id=${storeId}`,
      {
        headers: {
          "Authorization": req.headers["authorization"] || "",
          "Content-Type": "application/json",
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Maystro fetch failed" });
  }
});

// ✅ DHD
app.get("/api/dhd", async (req, res) => {
  try {
    const response = await fetch("https://dhd-dz.com/api/shipments", {
      headers: {
        "Authorization": req.headers["authorization"] || "",
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "DHD fetch failed" });
  }
});

app.listen(PORT, () => console.log(`✅ EasyTrack Backend running on port ${PORT}`));
