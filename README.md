# Traveltopia – Personalized Travel Exploration Platform

### 📋 Project Overview
---
**Traveltopia** is a full-stack web application designed with a client-server architecture to provide a seamless travel discovery experience. Built as part of the **CSEN503: Introduction to Communication Networks** course at the **German University in Cairo (Winter 2025)**, the platform allows users to explore curated travel categories, manage a personalized "Want-to-Go" list, and perform real-time searches.

### 🏛️ System Architecture
---
* **Frontend:** Dynamic **EJS (Embedded JavaScript)** templating with **Bootstrap** for responsive UI.


* **Backend:** **Node.js** with **Express.js** handling modular routing for authentication, search, and destination management.


* **Database:** **MongoDB** utilizing a unified single-collection design (`myCollection`) to store both user credentials and destination data.


* **Authentication:** Session-based security using `express-session` to protect routes and manage user states.



### ✨ Key Features
---
#### 🔐 Authentication & Security

* **Role-Based Access Control:** Restricted access to home, search, and destination pages unless a valid session exists.


* **Unified Data Model:** Optimized registration and login logic that distinguishes between user documents and destination data within the same collection.


* **Validation:** Server-side checks for existing usernames and mandatory input fields.



#### 🌎 Travel Discovery & Navigation

* **Categorized Exploration:** Specialized views for **Hiking, Cities, Islands, Beaches, and Mountains**, each dynamically pulling destination lists from the database.


* **Interactive Content:** Destination pages feature unique descriptions, category labeling, and embedded video streaming (`.mp4`) for each location.


* **Navigation Tools:** Integrated Navbar and "Back-Button" partials for fluid transitions between categories and search results.



#### 🔍 Advanced Search System

* **Dual-Layer Search:** * **API Route:** A JSON-returning API (`/api/search`) that powers real-time dropdown results using case-insensitive regex.


* **Full Search Page:** A dedicated results view that filters the database by name, actual name, or country while ensuring user documents are excluded from results.





#### 📍 "Want-to-Go" Management

* **Persistent Lists:** Users can add destinations to a personal list stored within their user document using the `$addToSet` operator to prevent duplicates.


* **Asynchronous Feedback:** Utilizes the `fetch` API to provide instant UI feedback (e.g., "Added to your list") without requiring a page reload.


* **Management:** A dedicated view allows users to see their saved destinations and remove them via a `$pull` update.



### 🚀 Getting Started
---
#### Prerequisites

* **Node.js & NPM**
* **MongoDB Community Server** (Local instance on port `27017`)
* **Database Name:** `myDB`
* **Collection Name:** `myCollection` 



#### Installation

1. **Install dependencies:**
```bash
npm install

```


2. **Run the Server:**
```bash
node app.js

```


3. **Access:** Open `http://localhost:3000/login`.



### 👥 Team Members
---
* **Yassin Mohamed Ahmed** – [LinkedIn]()
* **** – [LinkedIn]()
* **** – [LinkedIn]()
* **** – [LinkedIn]()
* **** – [LinkedIn]()


### 📜 License & Usage
This project was created for educational and academic purposes.

© 2025 Garabt-te-Restart-el-Router – All rights reserved.

This project was developed as part of the Introduction To Communication Networks course requirements at the German University in Cairo, Winter 2025.