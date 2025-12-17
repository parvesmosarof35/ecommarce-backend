// Order API Postman Collection
// Import this JSON into Postman for testing order endpoints

const orderCollection = {
  "info": {
    "_postman_id": "order-api-collection",
    "name": "Order API",
    "description": "Complete Order Management API for E-commerce Backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Order Management",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "customerId": "user_123",
                "items": [
                  {
                    "productId": "prod_123",
                    "quantity": 2,
                    "price": 29.99,
                    "name": "Sample Product",
                    "image": "https://example.com/product.jpg"
                  },
                  {
                    "productId": "prod_456",
                    "quantity": 1,
                    "price": 49.99,
                    "name": "Another Product",
                    "image": "https://example.com/product2.jpg"
                  }
                ],
                "totalAmount": 109.97,
                "shippingAddress": {
                  "street": "123 Main Street",
                  "city": "New York",
                  "state": "NY",
                  "postalCode": "10001",
                  "country": "USA"
                },
                "billingAddress": {
                  "street": "123 Main Street",
                  "city": "New York",
                  "state": "NY",
                  "postalCode": "10001",
                  "country": "USA"
                },
                "notes": "Please deliver after 5 PM",
                "currency": "usd"
              }, null, 2)
            },
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/create",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "create"]
            }
          }
        },
        {
          "name": "Get Order by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/order_1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "order_1"]
            }
          }
        },
        {
          "name": "Get Customer Orders",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/my-orders/user_123?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "my-orders", "user_123"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get All Orders (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/order?page=1&limit=10&status=pending&paymentStatus=pending",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                },
                {
                  "key": "status",
                  "value": "pending"
                },
                {
                  "key": "paymentStatus",
                  "value": "pending"
                }
              ]
            }
          }
        },
        {
          "name": "Update Order Status (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "status": "confirmed",
                "notes": "Order confirmed and ready for processing"
              }, null, 2)
            },
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/order_1/status",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "order_1", "status"]
            }
          }
        },
        {
          "name": "Update Payment Status (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "paymentStatus": "paid",
                "paymentIntentId": "pi_1234567890",
                "stripePaymentId": "pi_1234567890"
              }, null, 2)
            },
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/order_1/payment-status",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "order_1", "payment-status"]
            }
          }
        },
        {
          "name": "Cancel Order",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer YOUR_JWT_TOKEN_HERE"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "reason": "Customer requested cancellation"
              }, null, 2)
            },
            "url": {
              "raw": "{{baseUrl}}/api/v1/order/order_1/cancel",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "order", "order_1", "cancel"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    }
  ]
};

// Usage Instructions:
// 1. Copy the JSON above
// 2. Open Postman
// 3. Click Import > Raw text
// 4. Paste the JSON and import
// 5. Update the baseUrl variable if needed
// 6. Replace YOUR_JWT_TOKEN_HERE with actual JWT tokens
// 7. Use real order IDs from your test environment

// API Endpoints Summary:
// POST /api/v1/order/create - Create new order
// GET /api/v1/order/:orderId - Get specific order
// GET /api/v1/order/my-orders/:customerId - Get customer's orders
// GET /api/v1/order - Get all orders (admin)
// PATCH /api/v1/order/:orderId/status - Update order status (admin)
// PATCH /api/v1/order/:orderId/payment-status - Update payment status (admin)
// PATCH /api/v1/order/:orderId/cancel - Cancel order

export default orderCollection;