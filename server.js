require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send('"Door to Anywhere" is open!');
});

app.post("/proxy", async (req, res) => {
  try {
    const { url, method = "GET", headers = {}, body = null } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await axios({
      url,
      method,
      headers,
      data: body,
      timeout: 10000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);

    res.status(error.response?.status || 500).json({
      error: "Proxy request failed",
      message: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
