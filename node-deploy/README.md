# Node Deploy

A minimal Express.js application created for learning backend deployment workflows on Linux servers such as DigitalOcean and AWS EC2.

---

## 🎯 Purpose

This project is intentionally simple and focuses on **deployment fundamentals rather than application complexity**.

It is used to learn:

- How to deploy Node.js applications to remote Linux servers
- How SSH key authentication works
- How to manage production Node processes
- How Git-based deployment workflows function
- How real-world backend services are hosted

---

## 🧱 Tech Stack

- Node.js
- Express.js
- Nodemon (development only)

---

## 📦 Installation

```bash
npm install
````

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Application runs on:

```
http://localhost:3000
```

---

## 🌍 Deployment Guide (DigitalOcean / AWS EC2)

### 1. Create a Linux server

Recommended:

* Ubuntu 22.04 LTS

---

### 2. Generate SSH key (local machine)

```bash
ssh-keygen -t ed25519 -C "deploy-key"
```

This creates:

* Private key → `~/.ssh/id_ed25519`
* Public key → `~/.ssh/id_ed25519.pub`

---

### 3. Copy SSH key to server

Option A (recommended):

```bash
ssh-copy-id root@your_server_ip
```

Option B (manual):

```bash
cat ~/.ssh/id_ed25519.pub
```

Paste into:

```
/root/.ssh/authorized_keys
```

---

### 4. Connect to server

```bash
ssh root@your_server_ip
```

---

### 5. Install Node.js on server

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

### 6. Clone this repository

```bash
git clone https://github.com/zozoking101/Backend-Development-2026.git
cd node-deploy
```

---

### 7. Run application

```bash
npm install
npm start
```

---

## ⚙️ Production Process Management (PM2)

Keeps the app running after logout or reboot.

```bash
npm install -g pm2
pm2 start src/index.js --name node-deploy
pm2 save
pm2 startup
```

---

## 🔐 Key Concepts Learned

* SSH authentication and key management
* Linux server provisioning
* Node.js production deployment
* Process management (PM2)
* Git-based deployment workflows
* Difference between dev vs production environments

---

## 👤 Author

Backend deployment practice project built in 2026.
