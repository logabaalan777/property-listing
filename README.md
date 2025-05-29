# 🏡 Property Listing Management System 

A modern, full-stack real estate platform for discovering, listing, and managing properties 🏘️. This application supports advanced search, user favorites, recommendations, and more!

---

## 🔗 Live Demos

🌐 **Frontend:** [property-listing-bice-nine.vercel.app](https://property-listing-bice-nine.vercel.app)  
⚙️ **Backend API:** [property-backend-c79o.onrender.com](https://property-backend-c79o.onrender.com)

## 🎬 **Demo Video**  
📺 [Watch Here](https://drive.google.com/file/d/1YMWFMLcyQWGk7JD_spMtgR7G05GHaMDi/view?usp=drive_link)

---

## 🚀 Features

- 🔐 JWT Authentication (Login/Register)
- 🏘️ Property Listing with Advanced Filtering
- 🏷️ Tags, Amenities, and Color Themes Display
- ❤️ Add/Remove Favorites
- 🧑‍💼 User Dashboard with My Listings
- ✏️ Add/Edit/Delete Property (if created by user)
- 📤 Recommend Properties to Other Users by Email
- 📥 View Received Property Recommendations
- 📱 Responsive UI with modern design (Tailwind CSS)
- 🧩 Reusable components, protected routes, and toast notifications

---

## 🧠 Tech Stack

### 🖥️ Frontend

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![React Toastify](https://img.shields.io/badge/React_Toastify-333333?logo=react&logoColor=61DAFB)

### 🛠️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-FF6F00?logo=api&logoColor=white)

---

## 🧭 Project Workflow

### 🖼️ Overview Diagram

![Flowchart](https://github.com/logabaalan777/property-listing/blob/main/propertypulse.png)

---

### 🔁 How PropertyPulse Works

1. 🏠 **Landing Page**  
   Users land on the **PropertyPulse** homepage and can start exploring or proceed to register/login.

2. 🔐 **User Authentication**  
   - Secure authentication using **JWT** tokens.  
   - Credentials and user data are stored in **MongoDB**.

3. 🏢 **View Properties**  
   - All users can browse through available properties.  
   - View property details before making decisions.

4. 📝 **My Listings**  
   - Registered users can create, update, and delete their own listings.

5. 🌟 **Recommendations**  
   - Users can recommend properties.  
   - Other users can view or delete these suggestions.

6. ❤️ **Favorites**  
   - Add properties to your favorites list with a single click.  
   - Manage your favorites: view or remove at any time.

7. 🧠 **Filtering Options**  
   - Filter properties based on preferences like location, type, price, and more.

---

### 🧰 Technologies Behind the Workflow

- ✅ **MongoDB** for storing user and property data
- 🔐 **JWT** for secure login and protected routes
- 🧠 **Redis** for caching
- ⚙️ **Node.js/Express** backend handles business logic
- 🌐 **Next.js + Tailwind** frontend with real-time interaction
