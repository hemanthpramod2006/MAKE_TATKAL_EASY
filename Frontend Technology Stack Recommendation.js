// ====================================================
//  CLEAN, SAFE, NO-SHELL FRONTEND BUILDER FOR TURBOTIC
//  (React + Vite Minimal Setup)
// ====================================================

const fs = require("fs");
const path = require("path");

// Helper to create folders + write files
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("🚀 Creating minimal Vite + React frontend...");

// -------------------------------
// package.json
// -------------------------------
write("tatkal-frontend/package.json", `
{
  "name": "tatkal-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
`);

// -------------------------------
// vite.config.js
// -------------------------------
write("tatkal-frontend/vite.config.js", `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`);

// -------------------------------
// index.html
// -------------------------------
write("tatkal-frontend/index.html", `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tatkal AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

// -------------------------------
// src/main.jsx
// -------------------------------
write("tatkal-frontend/src/main.jsx", `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
`);

// -------------------------------
// src/App.jsx
// -------------------------------
write("tatkal-frontend/src/App.jsx", `
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Prefill from "./pages/Prefill";
import Success from "./pages/Success";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Link to="/">Home</Link>
        <Link to="/prefill">Prefill</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prefill" element={<Prefill />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}
`);

// -------------------------------
// src/pages/Home.jsx
// -------------------------------
write("tatkal-frontend/src/pages/Home.jsx", `
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ fontSize: "36px" }}>Tatkal AI 🚆</h1>
      <p style={{ marginTop: "10px" }}>Automate Tatkal booking with ease.</p>

      <Link
        to="/prefill"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        Go to Prefill
      </Link>
    </div>
  );
}
`);

// -------------------------------
// Prefill Form Component
// -------------------------------
write("tatkal-frontend/src/components/PrefillForm.jsx", `
import { useState } from "react";

export default function PrefillForm({ onSubmit }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    maxBudget: ""
  });

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Tatkal Prefill</h2>

      <input name="from" placeholder="From" onChange={update} style={inp} />
      <input name="to" placeholder="To" onChange={update} style={inp} />
      <input type="date" name="date" onChange={update} style={inp} />
      <input name="passengers" type="number" placeholder="Passengers" onChange={update} style={inp} />
      <input name="maxBudget" type="number" placeholder="Max Budget" onChange={update} style={inp} />

      <button style={btn}>Save Prefill</button>
    </form>
  );
}

const inp = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  border: "1px solid #ddd",
  borderRadius: "5px"
};

const btn = {
  marginTop: "15px",
  padding: "10px",
  width: "100%",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px"
};
`);

// -------------------------------
// src/pages/Prefill.jsx
// -------------------------------
write("tatkal-frontend/src/pages/Prefill.jsx", `
import PrefillForm from "../components/PrefillForm";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Prefill() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    console.log("Data sent:", data);
    await api.post("/prefill", data);
    navigate("/success");
  }

  return <PrefillForm onSubmit={handleSubmit} />;
}
`);

// -------------------------------
// src/pages/Success.jsx
// -------------------------------
write("tatkal-frontend/src/pages/Success.jsx", `
export default function Success() {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ color: "green" }}>Prefill Saved Successfully! 🎉</h1>
      <p>Your Tatkal automation is ready.</p>
    </div>
  );
}
`);

// -------------------------------
// src/utils/api.js
// -------------------------------
write("tatkal-frontend/src/utils/api.js", `
const API = "http://localhost:5000";

export default {
  post: async (path, body) => {
    const res = await fetch(API + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};
`);

console.log("🎉 FRONTEND FILES CREATED SUCCESSFULLY!");
console.log("👉 Download project");
console.log("👉 Run locally: npm install && npm run dev");