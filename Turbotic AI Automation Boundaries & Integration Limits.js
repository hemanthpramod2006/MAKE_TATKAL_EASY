// Step: Turbotic AI Automation Boundaries & Integration Limits
// Add your code here
// =======================================================
// 100% TURBOTIC-SAFE BACKEND BLOCK (CommonJS Only)
// No top-level await, no import, no ES modules
// =======================================================

const fs = require("fs");
const path = require("path");

// helper function
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("⚙️ Creating CLEAN & SAFE Tatkal Backend Server...");

// =======================================================
// backend/server.js
// =======================================================
write("backend/server.js", `
const http = require("http");
const url = require("url");

const DB = require("../database/index.js");  // CommonJS
const ML = require("../ml/predict.js");      // CommonJS

const PORT = 5000;

// -----------------------
// send helper
// -----------------------
function send(res, status, data) {
  res.writeHead(status, { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

// -----------------------
// Server
// -----------------------
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    let data = {};
    try { data = body ? JSON.parse(body) : {}; } catch(e) {}

    // ------------------------------------
    // HEALTH CHECK
    // ------------------------------------
    if (parsed.pathname === "/health") {
      return send(res, 200, { ok: true, server: "Tatkal Backend Active" });
    }

    // ------------------------------------
    // SAVE PREFILL
    // ------------------------------------
    if (parsed.pathname === "/prefill" && req.method === "POST") {
      DB.savePrefill(data);
      return send(res, 200, { success: true, message: "Prefill saved" });
    }

    // ------------------------------------
    // CREATE USER
    // ------------------------------------
    if (parsed.pathname === "/users/create" && req.method === "POST") {
      DB.saveUser(data);
      return send(res, 200, { success: true, message: "User created" });
    }

    // ------------------------------------
    // LIST BOOKINGS
    // ------------------------------------
    if (parsed.pathname === "/bookings/list" && req.method === "GET") {
      return send(res, 200, { success: true, bookings: DB.getBookings() });
    }

    // ------------------------------------
    // TEST ML MODEL
    // ------------------------------------
    if (parsed.pathname === "/ml/test" && req.method === "POST") {
      const score = ML.predictPriority(data);
      return send(res, 200, { priority: score });
    }

    // INVALID ROUTE
    return send(res, 404, { error: "Invalid API route" });
  });
});

// -----------------------
// Start Server
// -----------------------
server.listen(PORT, () => {
  console.log("🚀 Tatkal Backend Running on PORT", PORT);
});
`);

console.log("🎉 Backend Created Successfully WITHOUT Module Errors!");
console.log("👉 Run locally: node backend/server.js");