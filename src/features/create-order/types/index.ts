import { FieldErrors } from 'react-hook-form';

// Core form data types
export interface CreateOrderFormData {
  // Customer Details
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  searchMobileNumber: string;
  whatsappNumber: string;

  // Addresses
  shippingAddress: Address;
  billingAddress: Address;
  copyBillingToShipping: boolean;

  // Products
  products: OrderProduct[];

  // Pricing
  couponCode: string;
  totalDiscount: number;
  shippingCharges: number;
  bankDiscount: number;
  couponDiscount: number;

  // Payment
  paymentMode: PaymentMethod;
}

export interface Address {
  address: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export interface OrderProduct {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  originalPrice?: number;
  discount?: number;
  color?: string;
  size?: string;
  seller?: string;
}

// Enhanced types for the feature
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  discount?: number;
  description?: string;
  category?: string;
  stock?: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  whatsappNumber?: string;
  addresses: CustomerAddress[];
}

export interface CustomerAddress extends Address {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shippingCharges: number;
  total: number;
}

export interface ValidationErrors {
  [key: string]: string | ValidationErrors;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: ValidationErrors;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerSearchResponse {
  customers: Customer[];
  total: number;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  message: string;
}

// Hook types
export interface UseCreateOrderFormReturn {
  formData: CreateOrderFormData;
  errors: FieldErrors<CreateOrderFormData>;
  isSubmitting: boolean;
  updateField: (field: keyof CreateOrderFormData, value: any) => void;
  updateAddress: (
    type: 'shipping' | 'billing',
    field: keyof Address,
    value: string
  ) => void;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  submitOrder: () => Promise<void>;
}

export interface UseProductSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  addProduct: (product: Product) => void;
}

export interface UseOrderCalculationsReturn {
  subtotal: number;
  total: number;
  orderSummary: OrderSummary;
  updateProductQuantity: (productId: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
  applyCoupon: (couponCode: string) => void;
}

// Component prop types
export interface CustomerDetailsFormProps {
  formData: CreateOrderFormData;
  errors: FieldErrors<CreateOrderFormData>;
  onFieldChange: (field: keyof CreateOrderFormData, value: any) => void;
}

export interface AddressFormProps {
  address: Address;
  type: 'shipping' | 'billing';
  errors?: FieldErrors<Address>;
  disabled?: boolean;
  onAddressChange: (field: keyof Address, value: string) => void;
  // Copy billing checkbox props (only for billing address)
  copyBillingToShipping?: boolean;
  onCopyBillingChange?: (checked: boolean) => void;
}

export interface ProductListProps {
  products: OrderProduct[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

export interface ProductSearchFormProps {
  onProductAdd: (product: Product) => void;
}

export interface PriceDetailsProps {
  orderSummary: OrderSummary;
  couponCode: string;
  onCouponChange: (code: string) => void;
}

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

// Enums and constants
export type PaymentMethod = 'cod' | 'payment-link' | 'qr';

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  'payment-link': 'Payment Link',
  qr: 'QR Payment',
};

export const DEFAULT_FORM_DATA: CreateOrderFormData = {
  mobileNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  searchMobileNumber: '',
  whatsappNumber: '',
  shippingAddress: {
    address: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
  },
  billingAddress: {
    address: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
  },
  copyBillingToShipping: false,
  products: [],
  couponCode: '',
  totalDiscount: 0,
  shippingCharges: 0,
  bankDiscount: 0,
  couponDiscount: 0,
  paymentMode: 'cod',
};
