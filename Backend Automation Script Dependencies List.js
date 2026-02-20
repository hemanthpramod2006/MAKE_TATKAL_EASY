

const fs = require("fs");
const path = require("path");

// helper to write files
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("⚙️ Creating Tatkal Backend Server...");
write("backend/server.js", `
const http = require("http");
const url = require("url");
const DB = require("../database/index.js");
const ML = require("../ml/predict.js");

const PORT = 5000;

// helper: send JSON
function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    body = body ? JSON.parse(body) : {};

    // ===========================
    // HEALTH CHECK
    // ===========================
    if (parsed.pathname === "/health") {
      return send(res, 200, { ok: true, server: "Tatkal Backend Active" });
    }

    // ===========================
    // SAVE PREFILL ENTRY
    // ===========================
    if (parsed.pathname === "/prefill" && req.method === "POST") {
      DB.savePrefill(body);
      return send(res, 200, { success: true, message: "Prefill saved" });
    }

    // ===========================
    // CREATE USER
    // ===========================
    if (parsed.pathname === "/users/create" && req.method === "POST") {
      DB.saveUser(body);
      return send(res, 200, { success: true, message: "User created" });
    }

    // ===========================
    // LIST BOOKINGS
    // ===========================
    if (parsed.pathname === "/bookings/list" && req.method === "GET") {
      const all = DB.getBookings();
      return send(res, 200, { success: true, bookings: all });
    }

    // ===========================
    // ML SCORE TEST ENDPOINT
    // ===========================
    if (parsed.pathname === "/ml/test" && req.method === "POST") {
      const score = ML.predictPriority(body);
      return send(res, 200, { priority: score });
    }

    // INVALID ROUTE
    send(res, 404, { error: "Invalid API route" });
  });
});

server.listen(PORT, () => {
  console.log(" Tatkal Backend Running on PORT", PORT);
});
`);

write("backend/routes/readme.txt", `
Optional folder for advanced routing.
The backend is single-file for hackathon simplicity.
`);


console.log(" Backend Created Successfully!");
console.log(" Run locally:  node backend/server.js");
console.log(" API: http://localhost:5000/health");
