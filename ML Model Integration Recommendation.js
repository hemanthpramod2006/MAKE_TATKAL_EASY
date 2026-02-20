// Step: ML Model Integration Recommendation
// Add your code here
// This step clarifies which project components can be directly automated/executed in Turbotic AI and which cannot.
// ============================================================
//   TATKAL AI – ML PRIORITY MODEL (Turbotic-Safe)
//   PURE JAVASCRIPT | No installs | No TensorFlow
// ============================================================

const fs = require("fs");
const path = require("path");

// helper to write files
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("🧠 Creating ML Model for Tatkal Priority...");

// ------------------------------------------------------------
// TRAINING DATA (Simulated for Hackathon)
// ------------------------------------------------------------
write("ml/train.json", `
[
  { "earlyPrefill": 1, "budgetLow": 1, "willingHigh": 0, "priority": 0.95 },
  { "earlyPrefill": 1, "budgetLow": 0, "willingHigh": 1, "priority": 0.85 },
  { "earlyPrefill": 0, "budgetLow": 1, "willingHigh": 0, "priority": 0.75 },
  { "earlyPrefill": 0, "budgetLow": 1, "willingHigh": 1, "priority": 0.65 },
  { "earlyPrefill": 1, "budgetLow": 0, "willingHigh": 0, "priority": 0.60 },
  { "earlyPrefill": 0, "budgetLow": 0, "willingHigh": 1, "priority": 0.50 },
  { "earlyPrefill": 0, "budgetLow": 0, "willingHigh": 0, "priority": 0.20 }
]
`);

// ------------------------------------------------------------
// MODEL (Fake Neural Network Scoring System)
// ------------------------------------------------------------
write("ml/model.js", `
/*
  ML Model Logic:
  ----------------
  priority_score =
      0.45 * earlyPrefill
    + 0.30 * budgetLow
    + 0.20 * willingHigh
    + 0.05 * noise

  Output: priority score between 0 and 1
*/

module.exports = {
  predict(input) {
    const noise = Math.random() * 0.05;

    const score =
        0.45 * input.earlyPrefill +
        0.30 * input.budgetLow +
        0.20 * input.willingHigh +
        noise;

    return Number(score.toFixed(3));
  }
};
`);

// ------------------------------------------------------------
// PREDICTION WRAPPER
// Backend will call predictPriority(userData)
// ------------------------------------------------------------
write("ml/predict.js", `
const model = require("./model");

function normalize(data) {
  return {
    earlyPrefill: data.earlyPrefill ? 1 : 0,
    budgetLow: data.budgetLow ? 1 : 0,
    willingHigh: data.willingHigh ? 1 : 0
  };
}

module.exports = {
  predictPriority(user) {
    const input = normalize(user);
    return model.predict(input);
  }
};
`);

console.log("🎯 ML Model Created Successfully!");
console.log("👉 Use in backend: const ML = require('./ml/predict');");
console.log("👉 Then call: ML.predictPriority(userData);");