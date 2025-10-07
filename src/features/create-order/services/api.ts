import {
  Product,
  Customer,
  CreateOrderFormData,
  ApiResponse,
  ProductSearchResponse,
  CustomerSearchResponse,
  CreateOrderResponse,
} from '../types';

// Mock data - In real app, this would be API calls
const mockProducts: Product[] = [
  {
    id: '1',
    code: 'PROD001',
    name: 'Printed Black Sweatshirt',
    price: 200,
    originalPrice: 1000,
    discount: 70,
    image:
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center',
    description: 'Comfortable printed black sweatshirt',
    category: 'Clothing',
    stock: 50,
  },
  {
    id: '2',
    code: 'PROD002',
    name: 'Lavie Rice Brightening Face Wash',
    price: 1399,
    originalPrice: 7000,
    discount: 80,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop&crop=center',
    description: 'Natural rice brightening face wash',
    category: 'Beauty',
    stock: 30,
  },
  {
    id: '3',
    code: 'PROD003',
    name: 'Canvas School Bag - Unisex',
    price: 100,
    originalPrice: 150,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center',
    description: 'Durable canvas school bag for all ages',
    category: 'Bags',
    stock: 25,
  },
  {
    id: '4',
    code: 'PROD004',
    name: 'Wireless Headphones',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center',
    description: 'High-quality wireless headphones',
    category: 'Electronics',
    stock: 15,
  },
  {
    id: '5',
    code: 'PROD005',
    name: 'Smart Watch',
    price: 8999,
    originalPrice: 12999,
    discount: 30,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=center',
    description: 'Advanced smart watch with health tracking',
    category: 'Electronics',
    stock: 10,
  },
  {
    id: '6',
    code: 'PROD006',
    name: 'Bluetooth Speaker',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop&crop=center',
    description: 'Portable bluetooth speaker with rich sound',
    category: 'Electronics',
    stock: 20,
  },
  {
    id: '7',
    code: 'PROD007',
    name: 'Phone Case',
    price: 499,
    originalPrice: 999,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&crop=center',
    description: 'Protective phone case',
    category: 'Accessories',
    stock: 100,
  },
  {
    id: '8',
    code: 'PROD008',
    name: 'Laptop Stand',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center',
    description: 'Adjustable laptop stand for better ergonomics',
    category: 'Accessories',
    stock: 35,
  },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+91-9876543210',
    whatsappNumber: '+91-9876543210',
    addresses: [
      {
        id: '1',
        type: 'shipping',
        isDefault: true,
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pinCode: '400001',
      },
    ],
  },
];

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Generic API call function with error handling
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw new Error(error.message);
    }

    throw new Error('An unexpected error occurred');
  }
}

// Product API
export const productApi = {
  /**
   * Search products by name or code
   */
  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductSearchResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock implementation - filter products
      const filteredProducts = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.code.toLowerCase().includes(query.toLowerCase())
      );

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   */
  async getProduct(productId: string): Promise<Product> {
    try {
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error('Failed to get product:', error);
      throw error;
    }
  },

  /**
   * Get all products with pagination
   */
  async getAllProducts(
    page: number = 1,
    limit: number = 20
  ): Promise<ProductSearchResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = mockProducts.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        total: mockProducts.length,
        page,
        limit,
      };
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  },
};

// Customer API
export const customerApi = {
  /**
   * Search customer by mobile number
   */
  async searchByMobile(mobileNumber: string): Promise<Customer | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const customer = mockCustomers.find((c) =>
        c.mobileNumber.includes(mobileNumber.replace(/\D/g, ''))
      );

      return customer || null;
    } catch (error) {
      console.error('Failed to search customer:', error);
      throw error;
    }
  },

  /**
   * Search customers by various criteria
   */
  async searchCustomers(query: string): Promise<CustomerSearchResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const filteredCustomers = mockCustomers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
          customer.email.toLowerCase().includes(query.toLowerCase()) ||
          customer.mobileNumber.includes(query.replace(/\D/g, ''))
      );

      return {
        customers: filteredCustomers,
        total: filteredCustomers.length,
      };
    } catch (error) {
      console.error('Failed to search customers:', error);
      throw error;
    }
  },

  /**
   * Create a new customer
   */
  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
      };

      // In real app, this would be an API call
      mockCustomers.push(newCustomer);

      return newCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },
};

// Order API
export const orderApi = {
  /**
   * Create a new order
   */
  async createOrder(
    orderData: CreateOrderFormData
  ): Promise<CreateOrderResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate order data
      if (!orderData.products.length) {
        throw new Error('Order must contain at least one product');
      }

      if (!orderData.firstName || !orderData.lastName) {
        throw new Error('Customer name is required');
      }

      if (!orderData.email || !orderData.mobileNumber) {
        throw new Error('Customer contact information is required');
      }

      // Generate order ID and number
      const orderId = Date.now().toString();
      const orderNumber = `ORD-${orderId.slice(-6)}`;

      // In real app, this would save to database
      console.log('Creating order:', { orderId, orderNumber, orderData });

      return {
        orderId,
        orderNumber,
        status: 'pending',
        message: 'Order created successfully',
      };
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  /**
   * Validate coupon code
   */
  async validateCoupon(
    couponCode: string,
    orderTotal: number
  ): Promise<{
    valid: boolean;
    discount: number;
    message: string;
  }> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock coupon validation
      const validCoupons: Record<
        string,
        { discount: number; minOrder: number }
      > = {
        SAVE10: { discount: 10, minOrder: 500 },
        SAVE20: { discount: 20, minOrder: 1000 },
        WELCOME: { discount: 15, minOrder: 300 },
      };

      const coupon = validCoupons[couponCode.toUpperCase()];

      if (!coupon) {
        return {
          valid: false,
          discount: 0,
          message: 'Invalid coupon code',
        };
      }

      if (orderTotal < coupon.minOrder) {
        return {
          valid: false,
          discount: 0,
          message: `Minimum order value should be ₹${coupon.minOrder}`,
        };
      }

      const discountAmount = Math.min(
        (orderTotal * coupon.discount) / 100,
        500
      ); // Max ₹500 discount

      return {
        valid: true,
        discount: discountAmount,
        message: `Coupon applied! You saved ₹${discountAmount}`,
      };
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      throw error;
    }
  },
};

// Export all APIs
export const createOrderApi = {
  product: productApi,
  customer: customerApi,
  order: orderApi,
};

export default createOrderApi;
