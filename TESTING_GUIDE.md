# Panduan Pengujian API Manual (Testing Guide)

Base URL: `http://localhost:3000`

---

## 1. Persiapan Data (Perpustakaan)

Sebelum membuat buku, buat perpustakaan terlebih dahulu untuk mendapatkan `perpustakaanId`.

### Buat Perpustakaan Baru
- **Method**: `POST`
- **URL**: `http://localhost:3000/perpustakaan`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "nama": "Perpustakaan Pusat Kampus",
    "lokasi": "Gedung Rektorat Lt. 2"
  }
  ```
- **Respon Sukses (201)**:
  ```json
  {
    "_id": "665f1b9a8b1e4a0012ab34aa",
    "nama": "Perpustakaan Pusat Kampus",
    "lokasi": "Gedung Rektorat Lt. 2",
    "__v": 0
  }
  ```
  *(Salin nilai `_id` ini untuk dipakai sebagai `perpustakaanId` pada request buku di bawah).*

### Lihat Semua Perpustakaan
- **Method**: `GET`
- **URL**: `http://localhost:3000/perpustakaan`

---

## 2. Operasi CRUD Buku

### A. Tambah Buku (Create)
- **Method**: `POST`
- **URL**: `http://localhost:3000/buku`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "judul": "Pemrograman Web dengan Express",
    "isbn": "9786021234567",
    "pengarang": [
      "Budi Santoso",
      "Siti Aminah"
    ],
    "detail": {
      "halaman": 320,
      "edisi": 2
    },
    "stok": 10,
    "perpustakaanId": "GANTI_DENGAN_ID_PERPUSTAKAAN",
    "tersedia": true
  }
  ```
- **Respon Sukses (201)**: Dokumen buku berhasil dibuat dengan `_id`.

---

### B. Lihat Detail Buku (Read by ID)
- **Method**: `GET`
- **URL**: `http://localhost:3000/buku/:id`
- **Contoh URL**: `http://localhost:3000/buku/665f1c2e8b1e4a0012ab34cd`
- **Keterangan**: Field `perpustakaanId` otomatis di-populate menjadi objek utuh.

---

### C. Perbarui Buku (Update)
- **Method**: `PUT`
- **URL**: `http://localhost:3000/buku/:id`
- **Contoh URL**: `http://localhost:3000/buku/665f1c2e8b1e4a0012ab34cd`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "stok": 7,
    "tersedia": true
  }
  ```
- **Respon Sukses (200)**: Dokumen setelah diperbarui.

---

### D. Hapus Buku (Delete)
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/buku/:id`
- **Contoh URL**: `http://localhost:3000/buku/665f1c2e8b1e4a0012ab34cd`
- **Respon Sukses**: `204 No Content` (body kosong).

---

## 3. Query: Filter, Sorting, Pagination, & Projection

Format umum respon `GET /buku`:
```json
{
  "data": [ ... ],
  "page": 1,
  "limit": 10,
  "total": 2
}
```

### A. Nilai Default (Semua Buku)
- **Method**: `GET`
- **URL**: `http://localhost:3000/buku`
- **Keterangan**: Menggunakan default `page=1`, `limit=10`, sort berdasarkan `createdAt` (ascending).

---

### B. Filter berdasarkan Perpustakaan
- **Method**: `GET`
- **URL**: `http://localhost:3000/buku?perpustakaanId=GANTI_DENGAN_ID_PERPUSTAKAAN`

---

### C. Sorting
- **Ascending berdasarkan Judul**:
  - `GET http://localhost:3000/buku?sort=judul`
- **Descending berdasarkan Judul**:
  - `GET http://localhost:3000/buku?sort=-judul`
- **Berdasarkan Stok (Terendah ke Tertinggi)**:
  - `GET http://localhost:3000/buku?sort=stok`

---

### D. Pagination
- **Halaman 1, tampilkan 5 data**:
  - `GET http://localhost:3000/buku?page=1&limit=5`
- **Halaman 2, tampilkan 5 data**:
  - `GET http://localhost:3000/buku?page=2&limit=5`
- **Batas maksimum limit (otomatis dipotong ke 100 jika melebihi)**:
  - `GET http://localhost:3000/buku?limit=500`

---

### E. Projection (Memilih Field Tertentu)
Gunakan parameter `fields` dengan nama-nama field yang dipisahkan koma.

- **Hanya menampilkan Judul dan ISBN**:
  - `GET http://localhost:3000/buku?fields=judul,isbn`
- **Hanya Judul, Stok, dan Detail**:
  - `GET http://localhost:3000/buku?fields=judul,stok,detail`

---

### F. Kombinasi Semua Query Sekaligus
- **Method**: `GET`
- **URL**:
  ```text
  http://localhost:3000/buku?perpustakaanId=ID_PERPUSTAKAAN&sort=judul&page=1&limit=5&fields=judul,isbn,stok
  ```

---

## 4. Pengujian Kasus Error (Validasi)

| Kasus | Request | Respon Harapan |
|---|---|---|
| **Judul Kosong** | `POST /buku` dengan `"judul": ""` | `400 Bad Request` |
| **ISBN Bukan 13 Digit** | `POST /buku` dengan `"isbn": "12345"` | `400 Bad Request` |
| **ISBN Duplikat** | `POST /buku` dengan ISBN yang sudah tersimpan | `400 Bad Request` |
| **Pengarang Kosong** | `POST /buku` dengan `"pengarang": []` | `400 Bad Request` |
| **Halaman di Luar Batas** | `POST /buku` dengan `"detail": { "halaman": 20000 }` | `400 Bad Request` |
| **Stok Negatif** | `POST /buku` atau `PUT /buku/:id` dengan `"stok": -1` | `400 Bad Request` |
| **Format ID Salah** | `GET /buku/id-tidak-valid` | `400 Bad Request` |
| **ID Tidak Ditemukan** | `GET /buku/000000000000000000000000` | `404 Not Found` |

