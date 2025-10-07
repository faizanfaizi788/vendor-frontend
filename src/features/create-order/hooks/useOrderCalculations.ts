import { useCallback } from 'react';
import {
  CreateOrderFormData,
  OrderProduct,
  OrderSummary,
  UseOrderCalculationsReturn,
  Product,
} from '../types';

/**
 * Custom hook for order calculations and product management
 */
export const useOrderCalculations = (
  formData: CreateOrderFormData,
  updateField: (field: keyof CreateOrderFormData, value: any) => void
): UseOrderCalculationsReturn => {
  const updateProductQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove product if quantity is 0 or less
        const updatedProducts = formData.products.filter(
          (product) => product.id !== productId
        );
        updateField('products', updatedProducts);
        return;
      }

      const updatedProducts = formData.products.map((product) =>
        product.id === productId
          ? { ...product, quantity, total: product.price * quantity }
          : product
      );
      updateField('products', updatedProducts);
    },
    [formData.products, updateField]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      const updatedProducts = formData.products.filter(
        (product) => product.id !== productId
      );
      updateField('products', updatedProducts);
    },
    [formData.products, updateField]
  );

  const addProduct = useCallback(
    (product: Product) => {
      const existingProduct = formData.products.find(
        (p) => p.productCode === product.code
      );

      if (existingProduct) {
        // If product already exists, increase quantity
        updateProductQuantity(existingProduct.id, existingProduct.quantity + 1);
      } else {
        // Add new product
        const newProduct: OrderProduct = {
          id: Date.now().toString(),
          productCode: product.code,
          productName: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
          image: product.image,
          originalPrice: product.originalPrice,
          discount: product.discount,
        };

        updateField('products', [...formData.products, newProduct]);
      }
    },
    [formData.products, updateField, updateProductQuantity]
  );

  const applyCoupon = useCallback(
    (couponCode: string) => {
      // This would typically call an API to validate the coupon
      // For now, we'll just update the coupon code
      updateField('couponCode', couponCode);

      // In a real app, you'd calculate the discount based on the coupon
      // For now, we'll apply a mock discount
      const mockDiscountRules: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        WELCOME: 15,
      };

      const discountPercentage =
        mockDiscountRules[couponCode.toUpperCase()] || 0;
      const subtotal = formData.products.reduce(
        (sum, product) => sum + product.total,
        0
      );
      const discountAmount = Math.min(
        (subtotal * discountPercentage) / 100,
        500
      ); // Max ₹500 discount

      updateField('couponDiscount', discountAmount);
    },
    [formData.products, updateField]
  );

  // Calculate subtotal
  const subtotal = formData.products.reduce(
    (sum, product) => sum + product.total,
    0
  );

  // Calculate total discount
  const totalDiscount =
    formData.totalDiscount + formData.couponDiscount + formData.bankDiscount;

  // Calculate final total
  const total = Math.max(
    0,
    subtotal + formData.shippingCharges - totalDiscount
  );

  // Create order summary
  const orderSummary: OrderSummary = {
    subtotal,
    discount: totalDiscount,
    couponDiscount: formData.couponDiscount,
    shippingCharges: formData.shippingCharges,
    total,
  };

  return {
    subtotal,
    total,
    orderSummary,
    updateProductQuantity,
    removeProduct,
    addProduct,
    applyCoupon,
  };
};
