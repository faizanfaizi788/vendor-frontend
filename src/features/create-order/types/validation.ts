import { z } from 'zod';

// Address schema with validation rules matching the current implementation
const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().min(1, 'State is required').optional(),
  country: z.string().optional(),
  pinCode: z
    .string()
    .min(1, 'PIN code is required')
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code')
    .optional(),
});

// Order product schema
const orderProductSchema = z.object({
  id: z.string(),
  productCode: z.string(),
  productName: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(1),
  total: z.number().min(0),
  image: z.string().optional(),
  originalPrice: z.number().optional(),
  discount: z.number().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  seller: z.string().optional(),
});

// Payment method schema
const paymentMethodSchema = z.enum(['cod', 'payment-link', 'qr'] as const);

// Main form schema with all validation rules
export const createOrderFormSchema = z
  .object({
    // Customer Details
    mobileNumber: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid mobile number'),

    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters'),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),

    searchMobileNumber: z.string(),

    whatsappNumber: z
      .string()
      .regex(/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid WhatsApp number')
      .or(z.literal(''))
      .optional(),

    // Addresses
    shippingAddress: addressSchema.refine(
      (data) => {
        return (
          data.address.trim() !== '' &&
          data.pinCode &&
          data.pinCode.trim() !== '' &&
          data.city &&
          data.city.trim() !== '' &&
          data.state &&
          data.state.trim() !== ''
        );
      },
      {
        message: 'Shipping address details are required',
        path: ['address'],
      }
    ),

    billingAddress: addressSchema,
    copyBillingToShipping: z.boolean(),

    // Products
    products: z
      .array(orderProductSchema)
      .min(1, 'At least one product is required'),

    // Pricing
    couponCode: z.string(),
    totalDiscount: z.number().min(0),
    shippingCharges: z.number().min(0),
    bankDiscount: z.number().min(0),
    couponDiscount: z.number().min(0),

    // Payment
    paymentMode: paymentMethodSchema.refine(
      (value) => value !== null && value !== undefined,
      {
        message: 'Please select a payment method',
      }
    ),
  })
  .refine(
    (data) => {
      // If copyBillingToShipping is false, validate billing address
      if (!data.copyBillingToShipping) {
        return (
          data.billingAddress.address.trim() !== '' &&
          data.billingAddress.pinCode &&
          data.billingAddress.pinCode.trim() !== ''
        );
      }
      return true;
    },
    {
      message: 'Billing address is required when not copied from shipping',
      path: ['billingAddress', 'address'],
    }
  );

// Type inference from the schema
export type CreateOrderFormData = z.infer<typeof createOrderFormSchema>;

// Export individual schemas for reuse
export { addressSchema, orderProductSchema, paymentMethodSchema };
