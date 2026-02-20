const fs = require("fs");
const path = require("path");

// helper to write files safely
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart());
}

console.log("🗄️ Creating Tatkal JSON Database System...");

// ---------------------------------------------------------------
// 1. Create prefill database
// ---------------------------------------------------------------
write("database/prefill.json", `
{
  "entries": []
}
`);

// ---------------------------------------------------------------
// 2. User storage DB
// ---------------------------------------------------------------
write("database/users.json", `
{
  "users": []
}
`);

// ---------------------------------------------------------------
// 3. Bookings database
// ---------------------------------------------------------------
write("database/bookings.json", `
{
  "bookings": []
}
`);

// ---------------------------------------------------------------
// 4. Database Engine — CRUD functions
// ---------------------------------------------------------------
write("database/index.js", `
const fs = require("fs");

function load(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const DB = {
  // ----------------------------------------
  // Save Prefill Form
  // ----------------------------------------
  savePrefill(data) {
    const db = load("./database/prefill.json");
    db.entries.push({
      id: Date.now(),
      ...data
    });
    save("./database/prefill.json", db);
    return { success: true };
  },

  // ----------------------------------------
  // Get all prefill entries
  // ----------------------------------------
  getPrefills() {
    return load("./database/prefill.json").entries;
  },

  // ----------------------------------------
  // Save User
  // ----------------------------------------
  saveUser(user) {
    const db = load("./database/users.json");
    db.users.push({
      id: Date.now(),
      ...user
    });
    save("./database/users.json", db);
    return { success: true };
  },

  // ----------------------------------------
  // Get all users
  // ----------------------------------------
  getUsers() {
    return load("./database/users.json").users;
  },

  // ----------------------------------------
  // Add Booking Entry
  // ----------------------------------------
  saveBooking(booking) {
    const db = load("./database/bookings.json");
    db.bookings.push({
      id: Date.now(),
      ...booking
    });
    save("./database/bookings.json", db);
    return { success: true };
  },

  // ----------------------------------------
  // View bookings
  // ----------------------------------------
  getBookings() {
    return load("./database/bookings.json").bookings;
  }
};

module.exports = DB;
`);

console.log("🎉 Tatkal JSON Database Created Successfully!");
console.log("👉 Import in backend:  const DB = require('./database/index');");