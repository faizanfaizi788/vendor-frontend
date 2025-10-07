import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateOrderFormData,
  Product,
  Customer,
  DEFAULT_FORM_DATA,
  ValidationErrors,
} from '../types';
import { createOrderApi } from '../services/api';

// Async thunks for API calls
export const searchProducts = createAsyncThunk(
  'createOrder/searchProducts',
  async ({
    query,
    page = 1,
    limit = 10,
  }: {
    query: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await createOrderApi.product.searchProducts(
      query,
      page,
      limit
    );
    return response;
  }
);

export const searchCustomerByMobile = createAsyncThunk(
  'createOrder/searchCustomerByMobile',
  async (mobileNumber: string) => {
    const customer = await createOrderApi.customer.searchByMobile(mobileNumber);
    return customer;
  }
);

export const validateCoupon = createAsyncThunk(
  'createOrder/validateCoupon',
  async ({
    couponCode,
    orderTotal,
  }: {
    couponCode: string;
    orderTotal: number;
  }) => {
    const result = await createOrderApi.order.validateCoupon(
      couponCode,
      orderTotal
    );
    return result;
  }
);

export const submitOrder = createAsyncThunk(
  'createOrder/submitOrder',
  async (orderData: CreateOrderFormData) => {
    const response = await createOrderApi.order.createOrder(orderData);
    return response;
  }
);

// Initial state
interface CreateOrderState {
  // Form data
  formData: CreateOrderFormData;
  errors: ValidationErrors;

  // UI state
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;

  // Product search
  productSearchQuery: string;
  productSearchResults: Product[];
  isSearchingProducts: boolean;
  showProductResults: boolean;

  // Customer search
  searchedCustomer: Customer | null;
  isSearchingCustomer: boolean;
  customerSearchError: string | null;

  // Coupon validation
  couponValidation: {
    isValidating: boolean;
    isValid: boolean;
    discount: number;
    message: string;
  };

  // Order summary
  orderSummary: {
    subtotal: number;
    totalDiscount: number;
    shippingCharges: number;
    total: number;
  };
}

const initialState: CreateOrderState = {
  formData: DEFAULT_FORM_DATA,
  errors: {},
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
  productSearchQuery: '',
  productSearchResults: [],
  isSearchingProducts: false,
  showProductResults: false,
  searchedCustomer: null,
  isSearchingCustomer: false,
  customerSearchError: null,
  couponValidation: {
    isValidating: false,
    isValid: false,
    discount: 0,
    message: '',
  },
  orderSummary: {
    subtotal: 0,
    totalDiscount: 0,
    shippingCharges: 0,
    total: 0,
  },
};

// Utility function to calculate order summary
const calculateOrderSummary = (formData: CreateOrderFormData) => {
  const subtotal = formData.products.reduce(
    (sum, product) => sum + product.total,
    0
  );
  const totalDiscount =
    formData.totalDiscount + formData.couponDiscount + formData.bankDiscount;
  const total = Math.max(
    0,
    subtotal + formData.shippingCharges - totalDiscount
  );

  return {
    subtotal,
    totalDiscount,
    shippingCharges: formData.shippingCharges,
    total,
  };
};

// Create slice
const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {
    // Form data actions
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof CreateOrderFormData; value: any }>
    ) => {
      const { field, value } = action.payload;
      (state.formData as any)[field] = value;

      // Clear error for this field
      if (state.errors[field]) {
        delete state.errors[field];
      }

      // Handle copy billing to shipping
      if (field === 'copyBillingToShipping' && value === true) {
        state.formData.shippingAddress = { ...state.formData.billingAddress };
      }

      // Recalculate order summary
      state.orderSummary = calculateOrderSummary(state.formData);
    },

    updateAddress: (
      state,
      action: PayloadAction<{
        type: 'shipping' | 'billing';
        field: string;
        value: string;
      }>
    ) => {
      const { type, field, value } = action.payload;
      const addressKey = `${type}Address` as
        | 'shippingAddress'
        | 'billingAddress';
      (state.formData[addressKey] as any)[field] = value;

      // Clear address errors
      if (
        state.errors[addressKey] &&
        typeof state.errors[addressKey] === 'object'
      ) {
        const addressErrors = state.errors[addressKey] as ValidationErrors;
        if (addressErrors[field]) {
          delete addressErrors[field];
        }
      }
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingProduct = state.formData.products.find(
        (p) => p.productCode === product.code
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total =
          existingProduct.price * existingProduct.quantity;
      } else {
        const newProduct = {
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
        state.formData.products.push(newProduct);
      }

      // Recalculate order summary
      state.orderSummary = calculateOrderSummary(state.formData);
    },

    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.formData.products = state.formData.products.filter(
          (p) => p.id !== productId
        );
      } else {
        const product = state.formData.products.find((p) => p.id === productId);
        if (product) {
          product.quantity = quantity;
          product.total = product.price * quantity;
        }
      }

      // Recalculate order summary
      state.orderSummary = calculateOrderSummary(state.formData);
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.formData.products = state.formData.products.filter(
        (p) => p.id !== productId
      );

      // Recalculate order summary
      state.orderSummary = calculateOrderSummary(state.formData);
    },

    // Product search actions
    setProductSearchQuery: (state, action: PayloadAction<string>) => {
      state.productSearchQuery = action.payload;
    },

    setShowProductResults: (state, action: PayloadAction<boolean>) => {
      state.showProductResults = action.payload;
    },

    // Validation actions
    setValidationErrors: (state, action: PayloadAction<ValidationErrors>) => {
      state.errors = action.payload;
    },

    clearValidationErrors: (state) => {
      state.errors = {};
    },

    // Reset actions
    resetForm: (state) => {
      state.formData = DEFAULT_FORM_DATA;
      state.errors = {};
      state.submitError = null;
      state.submitSuccess = false;
      state.orderSummary = calculateOrderSummary(DEFAULT_FORM_DATA);
    },

    resetSubmitState: (state) => {
      state.isSubmitting = false;
      state.submitError = null;
      state.submitSuccess = false;
    },

    // Customer actions
    clearCustomerSearch: (state) => {
      state.searchedCustomer = null;
      state.customerSearchError = null;
    },

    populateCustomerData: (state, action: PayloadAction<Customer>) => {
      const customer = action.payload;
      state.formData.firstName = customer.firstName;
      state.formData.lastName = customer.lastName;
      state.formData.email = customer.email;
      state.formData.mobileNumber = customer.mobileNumber;
      state.formData.whatsappNumber = customer.whatsappNumber || '';

      // Populate default addresses if available
      const shippingAddress = customer.addresses.find(
        (addr) => addr.type === 'shipping' && addr.isDefault
      );
      const billingAddress = customer.addresses.find(
        (addr) => addr.type === 'billing' && addr.isDefault
      );

      if (shippingAddress) {
        state.formData.shippingAddress = {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country,
          pinCode: shippingAddress.pinCode,
        };
      }

      if (billingAddress) {
        state.formData.billingAddress = {
          address: billingAddress.address,
          city: billingAddress.city,
          state: billingAddress.state,
          country: billingAddress.country,
          pinCode: billingAddress.pinCode,
        };
      }
    },
  },

  extraReducers: (builder) => {
    // Product search
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isSearchingProducts = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isSearchingProducts = false;
        state.productSearchResults = action.payload.products;
        state.showProductResults = action.payload.products.length > 0;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.isSearchingProducts = false;
        state.productSearchResults = [];
        state.showProductResults = false;
      });

    // Customer search
    builder
      .addCase(searchCustomerByMobile.pending, (state) => {
        state.isSearchingCustomer = true;
        state.customerSearchError = null;
      })
      .addCase(searchCustomerByMobile.fulfilled, (state, action) => {
        state.isSearchingCustomer = false;
        state.searchedCustomer = action.payload;
        if (!action.payload) {
          state.customerSearchError =
            'No customer found with this mobile number';
        }
      })
      .addCase(searchCustomerByMobile.rejected, (state, action) => {
        state.isSearchingCustomer = false;
        state.customerSearchError =
          action.error.message || 'Failed to search customer';
      });

    // Coupon validation
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.couponValidation.isValidating = true;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponValidation.isValidating = false;
        state.couponValidation.isValid = action.payload.valid;
        state.couponValidation.discount = action.payload.discount;
        state.couponValidation.message = action.payload.message;

        if (action.payload.valid) {
          state.formData.couponDiscount = action.payload.discount;
          state.orderSummary = calculateOrderSummary(state.formData);
        }
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.couponValidation.isValidating = false;
        state.couponValidation.isValid = false;
        state.couponValidation.discount = 0;
        state.couponValidation.message =
          action.error.message || 'Failed to validate coupon';
      });

    // Order submission
    builder
      .addCase(submitOrder.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        // Reset form after successful submission
        state.formData = DEFAULT_FORM_DATA;
        state.errors = {};
        state.orderSummary = calculateOrderSummary(DEFAULT_FORM_DATA);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.error.message || 'Failed to create order';
      });
  },
});

// Export actions
export const {
  updateFormField,
  updateAddress,
  addProduct,
  updateProductQuantity,
  removeProduct,
  setProductSearchQuery,
  setShowProductResults,
  setValidationErrors,
  clearValidationErrors,
  resetForm,
  resetSubmitState,
  clearCustomerSearch,
  populateCustomerData,
} = createOrderSlice.actions;

// Export reducer
export default createOrderSlice.reducer;
