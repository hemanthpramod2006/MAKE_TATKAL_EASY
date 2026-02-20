// This step outlines wallet/payments approach for demo (mock or API integration).
// ==========================================================
//   TATKAL AI — SIMPLE WALLET SYSTEM (Turbotic-Safe Block)
//   Pure JavaScript (No npm, no shell commands)
//   Creates wallet server files + JSON database
// ==========================================================

const fs = require("fs");
const path = require("path");

// helper function
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("💰 Creating Tatkal Wallet System...");

// ----------------------------------------------------------
// 1. JSON Database
// ----------------------------------------------------------
write("wallet/db/wallet.json", `
{
  "users": {}
}
`);

// ----------------------------------------------------------
// 2. Wallet Server (Node.js Express-style server simulation)
// ----------------------------------------------------------
write("wallet/server.js", `
const http = require("http");
const fs = require("fs");

const DB_PATH = "./db/wallet.json";

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// ---------------------
// Start HTTP Server
// ---------------------
const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  let body = "";

  req.on("data", chunk => body += chunk.toString());
  req.on("end", () => {
    body = body ? JSON.parse(body) : {};

    const db = loadDB();

    // -------------------------
    // Create Wallet
    // -------------------------
    if (req.url === "/wallet/create" && req.method === "POST") {
      const { userId } = body;

      if (!userId)
        return send(res, 400, { success: false, message: "Missing userId" });

      if (!db.users[userId]) {
        db.users[userId] = {
          balance: 0,
          history: []
        };
        saveDB(db);
      }

      return send(res, 200, { success: true, wallet: db.users[userId] });
    }

    // -------------------------
    // Add Money
    // -------------------------
    if (req.url === "/wallet/add" && req.method === "POST") {
      const { userId, amount } = body;

      if (!db.users[userId])
        return send(res, 404, { success: false, message: "Wallet not found" });

      db.users[userId].balance += amount;
      db.users[userId].history.push({
        type: "credit",
        amount,
        date: new Date().toISOString()
      });

      saveDB(db);
      return send(res, 200, { success: true, balance: db.users[userId].balance });
    }

    // -------------------------
    // Deduct Money
    // -------------------------
    if (req.url === "/wallet/deduct" && req.method === "POST") {
      const { userId, amount } = body;

      if (!db.users[userId])
        return send(res, 404, { success: false, message: "Wallet not found" });

      if (db.users[userId].balance < amount)
        return send(res, 400, { success: false, message: "Insufficient balance" });

      db.users[userId].balance -= amount;
      db.users[userId].history.push({
        type: "debit",
        amount,
        date: new Date().toISOString()
      });

      saveDB(db);
      return send(res, 200, { success: true, balance: db.users[userId].balance });
    }

    // -------------------------
    // Get Balance
    // -------------------------
    if (req.url === "/wallet/balance" && req.method === "POST") {
      const { userId } = body;

      if (!db.users[userId])
        return send(res, 404, { success: false, message: "Wallet not found" });

      return send(res, 200, { success: true, balance: db.users[userId].balance });
    }

    // -------------------------
    // Transaction History
    // -------------------------
    if (req.url === "/wallet/history" && req.method === "POST") {
      const { userId } = body;

      if (!db.users[userId])
        return send(res, 404, { success: false, message: "Wallet not found" });

      return send(res, 200, { success: true, history: db.users[userId].history });
    }

    send(res, 404, { success: false, message: "Invalid route" });
  });
});

server.listen(4001, () => {
  console.log("💳 Wallet Server Running on port 4001");
});
`);

console.log("🎉 Wallet System Created Successfully!");
console.log("👉 Start wallet server:   node wallet/server.js");
console.log("👉 Wallet ready for backend integration.");