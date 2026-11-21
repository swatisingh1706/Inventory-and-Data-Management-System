 # Inventory and Data Management System

## Project Overview

The Inventory and Data Management System is a backend application developed using Node.js, Express.js, MongoDB, and Mongoose.

The system provides RESTful APIs to manage products, maintain stock quantities, retrieve inventory details, and generate inventory reports.

## Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Backend web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object data modeling
- **dotenv** – Environment variable management

## Project Structure

```text
Assignment_3/
│
├── controller/
│   └── productController.js
│
├── database/
│   └── db.js
│
├── middleware/
│   ├── errorMiddleware.js
│   └── validateObjectId.js
│
├── model/
│   └── Product.js
│
├── routes/
│   └── productRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Features

### 1. Product Management
- Create new products.
- Retrieve all products.
- Retrieve individual products using their ID.
- Update existing product details.
- Delete products using soft deletion.

### 2. Product Schema and Validation

The Product model includes:
- Product name
- Description
- Price
- Category
- Stock quantity
- SKU
- Active status

Field-level validations are implemented to maintain data consistency. SKU values are unique, and stock and price cannot be negative.

### 3. Filtering, Sorting and Pagination

Products can be retrieved using:
- Category-based filtering
- Product name search
- Minimum and maximum price
- Sorting by name, price, stock, or creation date
- Pagination using page and limit parameters

### 4. Stock Management

The system supports:
- Stock increment
- Stock decrement
- Validation of stock adjustment requests
- Prevention of stock quantities becoming negative

### 5. Inventory Reports

Two inventory reports are provided:

- **Low Stock Report:** Retrieves products whose stock is at or below a specified threshold.
- **Category-wise Inventory Summary:** Uses MongoDB aggregation to calculate total products, total stock, average price, and inventory value for each category.

### 6. Error Handling

Centralized error handling and product ID validation middleware are implemented to handle invalid requests and database errors.

## Installation and Setup

### Prerequisites

- Node.js
- MongoDB Community Server
- npm

### Step 1: Clone the Repository

```bash
git clone https://github.com/swatisingh1706/Inventory-and-Data-Management-System.git
```

### Step 2: Navigate to the Project Directory

```bash
cd Inventory-and-Data-Management-System
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root directory.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventoryDB
```

### Step 5: Start MongoDB

Ensure that the MongoDB server is running locally before starting the application.

### Step 6: Start the Application

```bash
npm start
```

For development mode, if the development script is configured:

```bash
npm run dev
```

The server runs on:

```text
http://localhost:5000
```

## API Endpoints

Base URL:

```text
http://localhost:5000/api/products
```

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a product |
| GET | `/` | Retrieve all products |
| GET | `/:id` | Retrieve a product by ID |
| PUT | `/:id` | Update a product |
| DELETE | `/:id` | Delete a product |
| PATCH | `/:id/stock` | Adjust product stock |
| GET | `/reports/low-stock` | Generate low-stock report |
| GET | `/reports/category-summary` | Generate category-wise summary |

## Sample Product Request

**POST** `/api/products`

```json
{
  "name": "Wireless Mouse",
  "description": "Wireless optical mouse",
  "price": 799,
  "category": "Electronics",
  "stock": 25,
  "sku": "WM001"
}
```

## Sample Stock Adjustment Request

**PATCH** `/api/products/:id/stock`

```json
{
  "quantity": 5,
  "operation": "increment"
}
```

For stock decrement:

```json
{
  "quantity": 3,
  "operation": "decrement"
}
```

## Sample Report Requests

Low-stock report:

```text
GET /api/products/reports/low-stock?threshold=10
```

Category-wise inventory summary:

```text
GET /api/products/reports/category-summary
```

## Database

The application uses MongoDB as its database. Mongoose is used to define the Product schema, validate data, and perform database operations.

The default database name is `inventoryDB`.

## Author

**Swati Singh** 