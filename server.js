import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
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
    const token = req.headers["authorization"]?.replace("Bearer ", "") || "";
    const response = await fetch(
      `https://platform.dhd-dz.com/api/v1/get/orders?page=1&per_page=100&token=${token}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const text = await response.text();
    console.log("DHD status:", response.status);
    console.log("DHD response:", text.slice(0, 300));
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(response.status).json({ 
        error: "DHD non-JSON", 
        status: response.status,
        raw: text.slice(0, 300) 
      });
    }
  } catch (err) {
    console.error("DHD error:", err.message);
    res.status(500).json({ error: "DHD fetch failed", message: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ EasyTrack Backend running on port ${PORT}`));
