import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const db = new Database("cadaster.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    subcity_kebele TEXT,
    house_number TEXT,
    area_sqm REAL,
    document_path TEXT,
    status TEXT DEFAULT 'በሂደት ላይ',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/registrations", upload.single("document"), (req, res) => {
    const { fullName, phoneNumber, subcityKebele, houseNumber, areaSqm } = req.body;
    const documentPath = req.file ? req.file.path : null;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO registrations (full_name, phone_number, subcity_kebele, house_number, area_sqm, document_path)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(fullName, phoneNumber, subcityKebele, houseNumber, areaSqm, documentPath);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, error: "Failed to save registration" });
    }
  });

  app.get("/api/registrations", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM registrations ORDER BY created_at DESC").all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch registrations" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
