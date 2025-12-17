import { CreateOrderData, Order, OrderResponse, OrderListResponse } from './order.interface';
import { ORDER_STATUS, PAYMENT_STATUS, DEFAULT_CURRENCY } from './order.constant';

// In-memory storage for orders (replace with database in production)
let orders: Order[] = [];
let orderIdCounter = 1;

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    try {
      const order: Order = {
        _id: `order_${orderIdCounter++}`,
        customerId: orderData.customerId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        status: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        notes: orderData.notes,
        currency: orderData.currency || DEFAULT_CURRENCY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      orders.push(order);

      return {
        status: true,
        message: 'Order created successfully',
        data: { order },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to create order',
      };
    }
  }

  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const order = orders.find(o => o._id === orderId);

      if (!order) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      return {
        status: true,
        message: 'Order retrieved successfully',
        data: { order },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve order',
      };
    }
  }

  async getOrdersByCustomerId(customerId: string, page: number = 1, limit: number = 10): Promise<OrderListResponse> {
    try {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const customerOrders = orders.filter(o => o.customerId === customerId);
      const paginatedOrders = customerOrders.slice(startIndex, endIndex);

      return {
        status: true,
        message: 'Orders retrieved successfully',
        data: {
          orders: paginatedOrders,
          total: customerOrders.length,
          page,
          limit,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve orders',
      };
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string, paymentStatus?: string): Promise<OrderListResponse> {
    try {
      let filteredOrders = [...orders];

      if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
      }

      if (paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
      }

      // Sort by creation date (newest first)
      filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return {
        status: true,
        message: 'Orders retrieved successfully',
        data: {
          orders: paginatedOrders,
          total: filteredOrders.length,
          page,
          limit,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve orders',
      };
    }
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<OrderResponse> {
    try {
      const orderIndex = orders.findIndex(o => o._id === orderId);

      if (orderIndex === -1) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      orders[orderIndex].status = status as any;
      orders[orderIndex].updatedAt = new Date();

      if (notes) {
        orders[orderIndex].notes = notes;
      }

      return {
        status: true,
        message: 'Order status updated successfully',
        data: { order: orders[orderIndex] },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to update order status',
      };
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentIntentId?: string, stripePaymentId?: string): Promise<OrderResponse> {
    try {
      const orderIndex = orders.findIndex(o => o._id === orderId);

      if (orderIndex === -1) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      orders[orderIndex].paymentStatus = paymentStatus as any;
      orders[orderIndex].updatedAt = new Date();

      if (paymentIntentId) {
        orders[orderIndex].paymentIntentId = paymentIntentId;
      }

      if (stripePaymentId) {
        orders[orderIndex].stripePaymentId = stripePaymentId;
      }

      // Auto-update order status based on payment status
      if (paymentStatus === PAYMENT_STATUS.PAID && orders[orderIndex].status === ORDER_STATUS.PENDING) {
        orders[orderIndex].status = ORDER_STATUS.CONFIRMED;
      } else if (paymentStatus === PAYMENT_STATUS.FAILED) {
        orders[orderIndex].status = ORDER_STATUS.CANCELLED;
      }

      return {
        status: true,
        message: 'Payment status updated successfully',
        data: { order: orders[orderIndex] },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to update payment status',
      };
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<OrderResponse> {
    try {
      const orderIndex = orders.findIndex(o => o._id === orderId);

      if (orderIndex === -1) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      const order = orders[orderIndex];

      // Can only cancel pending orders
      if (order.status !== ORDER_STATUS.PENDING) {
        return {
          status: false,
          message: 'Cannot cancel order. Order is already being processed.',
        };
      }

      orders[orderIndex].status = ORDER_STATUS.CANCELLED;
      orders[orderIndex].updatedAt = new Date();

      if (reason) {
        orders[orderIndex].notes = reason;
      }

      return {
        status: true,
        message: 'Order cancelled successfully',
        data: { order: orders[orderIndex] },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to cancel order',
      };
    }
  }

  // Helper method to get order for payment processing
  async getOrderForPayment(orderId: string): Promise<Order | null> {
    const order = orders.find(o => o._id === orderId);
    return order || null;
  }
}

export default OrderService;
