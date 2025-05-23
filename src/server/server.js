import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/.proxy/*", (req, res) => {
  // just redirect to a url where .proxy is removed
  req.url = req.url.replace("/.proxy", "");
  res.redirect(req.url);
}
);

app.get("/lib/*", (req, res) => {
  const filePath = path.join(__dirname, "../client/bin", req.path.replace("/lib/", ""));
  res.sendFile(filePath);
});

app.post("/api/token", async (req, res) => {
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });
  const { access_token } = await response.json();
  res.send({access_token});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
