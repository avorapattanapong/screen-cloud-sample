# API Documentation

All endpoints are prefixed with `/v1`.

## Warehouse Endpoints

### GET /v1/warehouses
- **Description:** Get all warehouses
- **Response:** Array of warehouses

---

## Order Endpoints

### POST /v1/orders/verify
- **Description:** Verify if an order can be fulfilled (stock, shipping, etc) before placing it
- **Body:**
  - `quantity` (integer, required)
  - `shippingLat` (number, required)
  - `shippingLng` (number, required)
- **Response:** Order verification result

### POST /v1/orders
- **Description:** Create a new order
- **Body:**
  - `email` (string, required)
  - `quantity` (integer, required)
  - `shippingLat` (number, required)
  - `shippingLng` (number, required)
- **Response:** Created order object

### GET /v1/orders
- **Description:** Get all orders, or filter by email
- **Query:**
  - `email` (string, optional) — If provided, returns only orders for that email (getOrdersByEmail)
- **Response:** Array of orders

### GET /v1/orders/:id
- **Description:** Get a single order by ID
- **Params:**
  - `id` (string, required)
- **Response:** Order object

---

## Error Handling
- All endpoints return consistent error objects on failure:
  - `{ error: string, details?: any }`
- Validation errors return 400
- Not found returns 404
- Internal errors return 500

---

For detailed request/response examples, see the included Postman collection: `ScreenCloud.postman_collection.json`.
