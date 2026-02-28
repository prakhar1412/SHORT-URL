# ShortURL 🔗

> **Simplify your links, amplify your reach.**

A full-stack URL shortener built with **Node.js**, **Express**, and **MongoDB**. ShortURL lets you transform long, unwieldy links into clean, shareable short URLs — complete with custom aliases, click analytics, QR code generation, and social sharing.

---

## ▶️ How to Run

> Make sure **Node.js** and **MongoDB** are installed before proceeding.

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (Windows — skip if already running as a service)
net start MongoDB

# 3. Start the development server
npm start
```

Then open your browser and go to → **[http://localhost:8001](http://localhost:8001)**

> The server runs with **nodemon** — it will auto-restart whenever you save a file.  
> To stop the server, press `Ctrl + C` in the terminal.

---

## ✨ Features

- **Instant URL Shortening** — Paste any long URL and get a short link in seconds
- **Custom Aliases** — Choose your own memorable short ID (e.g., `localhost:8001/url/my-link`)
- **Click Analytics** — Track how many times a short link has been clicked, with timestamps
- **Analytics Dashboard** — Visual chart of click history via Chart.js
- **QR Code Generation** — Automatically generates a scannable QR code for every shortened link
- **Social Sharing** — One-click share to Twitter, WhatsApp, and LinkedIn
- **Recent Links History** — Locally persisted history of your recently shortened links
- **Premium UI** — Glassmorphism design with smooth animations, built with vanilla HTML/CSS/JS

---

## 🗂️ Project Structure

```
SHORT URL/
├── controllers/
│   └── url.js          # Business logic: generate, redirect, analytics
├── models/
│   └── url.js          # Mongoose schema for URL documents
├── routes/
│   └── url.js          # Express routes for URL endpoints
├── public/
│   ├── index.html      # Frontend UI
│   ├── style.css       # Styles (glassmorphism, animations)
│   ├── script.js       # Frontend logic (API calls, QR, chart, history)
│   └── favicon.png     # App icon
├── connect.js          # MongoDB connection helper
├── index.js            # Express app entry point
└── package.json
```

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Runtime    | Node.js                                 |
| Framework  | Express.js v5                           |
| Database   | MongoDB (via Mongoose v8)               |
| ID Gen     | nanoid (8-character random short IDs)   |
| Dev Server | nodemon                                 |
| Frontend   | Vanilla HTML, CSS, JavaScript           |
| Charts     | Chart.js (CDN)                          |
| QR Codes   | qrcodejs (CDN)                          |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port (`27017`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd "SHORT URL"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MongoDB** (if not already running)

   ```bash
   # On Windows (if installed as a service, it may already be running)
   net start MongoDB

   # Or start manually
   mongod
   ```

4. **Run the development server**

   ```bash
   npm start
   ```

   The server uses **nodemon**, so it will auto-restart on file changes.

5. **Open the app**

   Navigate to [http://localhost:8001](http://localhost:8001) in your browser.

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                                      |
|--------|---------------------------------|--------------------------------------------------|
| `POST` | `/url`                          | Generate a new short URL                         |
| `GET`  | `/url/:shortId`                 | Redirect to the original URL & log the visit     |
| `GET`  | `/url/analytics/:shortId`       | Retrieve click count and visit history           |

### `POST /url` — Shorten a URL

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url",
  "customAlias": "my-link"   // optional
}
```

**Response:**

```json
{
  "Id": "my-link"
}
```

---

### `GET /url/:shortId` — Redirect

Visiting `http://localhost:8001/url/my-link` will redirect you to the original URL and log the visit timestamp.

---

### `GET /url/analytics/:shortId` — Analytics

**Response:**

```json
{
  "totalClicks": 5,
  "analytics": [
    { "timestamp": 1700000001234 },
    { "timestamp": 1700000009876 }
  ]
}
```

---

## 🗃️ Database Schema

**Collection:** `urls`

| Field          | Type       | Description                              |
|----------------|------------|------------------------------------------|
| `shortID`      | `String`   | Unique short identifier / custom alias   |
| `redirectURL`  | `String`   | The original long URL                    |
| `visitHistory` | `Array`    | Array of `{ timestamp }` objects         |
| `createdAt`    | `Date`     | Auto-generated by Mongoose timestamps    |
| `updatedAt`    | `Date`     | Auto-generated by Mongoose timestamps    |

---

## 📦 Dependencies

```json
{
  "express":  "^5.1.0",
  "mongoose": "^8.17.0",
  "nanoid":   "^5.1.5",
  "nodemon":  "^3.1.10"
}
```

---


## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Made with ❤️ using Node.js & Express</p>
