const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware untuk membaca request body berbentuk JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan file statis Front-End (HTML, CSS, JS) dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Helper function untuk membaca file JSON
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
};

// ==========================================
// 1. ENDPOINT API PENCARIAN (SEARCH)
// ==========================================
app.get('/api/search', (req, res) => {
    const { q, category } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Kata kunci pencarian tidak boleh kosong' });
    }

    // Simulasi pencarian data berdasarkan kategori
    console.log(`Menerima permintaan pencarian: "${q}" pada kategori: [${category}]`);
    
    // Kirim balik respon hasil pencarian ke front-end
    res.json({
        success: true,
        message: `Hasil pencarian untuk '${q}' ditemukan`,
        category: category,
        results: [
            { id: 1, judul: `Panduan Riset ${q} Digital`, penulis: "Puthut A.", tahun: "2026" },
            { id: 2, judul: `Penerapan Inovasi ${q} di Perpustakaan`, penulis: "Andika F.", tahun: "2025" }
        ]
    });
});

// ==========================================
// 2. ENDPOINT API FAQ (Dinamis dari Database JSON)
// ==========================================
app.get('/api/faq', (req, res) => {
    try {
        const faqData = readJsonFile('data/faq.json');
        res.json(faqData);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data FAQ' });
    }
});

// ==========================================
// 3. ENDPOINT API BERITA & ARTIKEL
// ==========================================
// Ambil semua data berita
app.get('/api/berita', (req, res) => {
    try {
        const beritaData = readJsonFile('data/berita.json');
        res.json(beritaData);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data berita' });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server Back-End berjalan lancar di http://localhost:${PORT}`);
});