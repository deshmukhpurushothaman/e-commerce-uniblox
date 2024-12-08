# eCommerce Store Backend

This is the backend for an eCommerce store where customers can add items to their cart, checkout, and receive a discount code every nth order. The admin can generate discount codes and view statistics such as the total number of items purchased, total purchase amount, and discount usage.

## Table of Contents

- Overview
- Technologies
- Setup
- Future Improvements

## Overview

The backend is designed to provide API functionality for the following features:

- Adding items to the shopping cart
- Checking out a cart with or without a discount
- Generating a discount code for every nth order
- Viewing statistics for total purchases and discount usage from the admin's perspective

The backend uses Node.js with Express and MongoDB as the database for storing cart and order data.

## Technologies

- **Node.js:** JavaScript runtime environment for building the backend server.
- **Express.js:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database to store cart and order data.
- **Mongoose:** ODM for MongoDB to interact with the database.
- **Body-parser:** Middleware to parse incoming request bodies.

## Setup

1. Clone the repository

```bash
git clone https://github.com/deshmukhpurushothaman/e-commerce-uniblox.git
cd e-commerce-uniblox/backend
```

2. **Install dependencies:** Make sure you have **Node.js** and npm installed, then run:

```bash
npm install
```

3. **Configure environment variables:** Create a `.env` file in the root directory and add the following:

```env
DISCOUNT_ORDER = 5
DATABASE_CONNECTION_STRING=mongodb://localhost:27017/e-commerce
PORT=8000
```

4. **Run the server:** Start the backend server using the following command:

```bash
npm run dev
```

The server will run on `PORT` in env or by default on `8000`. Ex: `http://localhost:5000`.

## Future Improvements

- **Authentication and Authorization:** Implement user authentication for both customers and admins.
- **Payment Gateway Integration:** Integrate a payment system (e.g., Stripe, PayPal) to process real payments.
- **Enhanced Admin Features:** Allow the admin to manage products, track inventory, and more.
