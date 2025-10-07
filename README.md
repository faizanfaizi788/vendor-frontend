# Create Order Feature - Feature-Based Architecture

## Overview

This document outlines the feature-based architecture implemented for the Create Order functionality. This approach promotes modularity, maintainability, and scalability by organizing code by feature rather than by file type.

## 🏗️ Architecture Principles

### 1. Feature-Based Organization

- **Self-Contained**: Each feature contains all related code (components, hooks, services, types)
- **Domain-Driven**: Code is organized around business functionality
- **Scalable**: Easy to add new features without affecting existing ones
- **Maintainable**: Related code is co-located and easy to find

### 2. Separation of Concerns

- **Components**: Pure UI components with minimal business logic
- **Hooks**: Custom hooks for business logic and state management
- **Services**: API calls and external integrations
- **Types**: TypeScript interfaces and type definitions
- **Store**: Redux state management (if needed)

### 3. Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes functions to prevent recreation
- **useMemo**: Memoizes expensive calculations
- **Code Splitting**: Feature can be lazy-loaded

## 📁 Project Structure

```
src/features/create-order/
├── CreateOrderPage.tsx           # Main page component (orchestrator)
├── index.ts                      # Feature exports
├── components/                   # UI Components
│   ├── index.ts                 # Component exports
│   ├── AddressForm.tsx          # Address input form
│   ├── CustomerDetailsForm.tsx  # Customer information form
│   ├── PaymentMethodSelector.tsx # Payment method selection
│   ├── PriceDetails.tsx         # Order pricing and coupon
│   ├── ProductList.tsx          # Selected products display
│   └── ProductSearchForm.tsx    # Product search interface
├── hooks/                       # Custom Hooks
│   ├── index.ts                # Hook exports
│   ├── useCreateOrderForm.ts   # Main form state and validation
│   ├── useCustomerSearch.ts    # Customer search functionality
│   ├── useOrderCalculations.ts # Order totals and calculations
│   └── useProductSearch.ts     # Product search and selection
├── services/                   # API & External Services
│   └── api.ts                 # Product, customer, order APIs
├── store/                     # Redux State Management
│   ├── index.ts              # Store exports
│   └── createOrderSlice.ts   # Redux slice for order state
└── types/                    # TypeScript Definitions
    └── index.ts             # All feature-related types
```

## 🧩 Component Architecture

### Main Components

#### `CreateOrderPage.tsx` - Main Orchestrator

- **Purpose**: Main page component that orchestrates the entire create order flow
- **Responsibilities**:
  - Manages overall page layout and navigation
  - Integrates all sub-components
  - Handles form submission and validation
  - Manages page-level state coordination

#### `CustomerDetailsForm.tsx` - Customer Information

- **Purpose**: Handles customer information input
- **Features**:
  - Customer name, email, phone inputs
  - Form validation and error display
  - Clean, accessible form design

#### `ProductSearchForm.tsx` - Product Search Interface

- **Purpose**: Product search and selection interface
- **Features**:
  - Dropdown search results (matches CreateOrder design)
  - Real-time search with debouncing
  - Shows all products by default
  - Add products to order functionality

#### `ProductList.tsx` - Selected Products Display

- **Purpose**: Displays selected products in card layout
- **Features**:
  - Card-based layout (matches CreateOrder design)
  - Quantity adjustment controls
  - Remove product functionality
  - Price calculations and discounts

#### `AddressForm.tsx` - Address Input

- **Purpose**: Reusable address form component
- **Features**:
  - Supports both shipping and billing addresses
  - Copy shipping to billing functionality
  - Validation and error handling

#### `PriceDetails.tsx` - Order Summary

- **Purpose**: Order pricing and coupon application
- **Features**:
  - Matches CreateOrder design exactly
  - Coupon code input
  - Detailed price breakdown
  - Real-time total calculations

#### `PaymentMethodSelector.tsx` - Payment Options

- **Purpose**: Payment method selection
- **Features**:
  - Matches CreateOrder design exactly
  - Radio button selection
  - Clean, simple interface

## 🎣 Custom Hooks Architecture

### `useCreateOrderForm.ts` - Main Form Management

```typescript
// Manages entire form state, validation, and submission
const {
  formData, // Complete form state
  errors, // Validation errors
  isSubmitting, // Loading state
  updateField, // Update single field
  updateAddress, // Update address fields
  validateForm, // Form validation
  submitOrder, // Submit order to API
} = useCreateOrderForm();
```

### `useProductSearch.ts` - Product Search Logic

```typescript
// Handles product search and selection
const {
  searchQuery, // Current search term
  setSearchQuery, // Update search term
  searchResults, // Search results
  isSearching, // Loading state
  showResults, // Show/hide dropdown
  setShowResults, // Control dropdown visibility
  addProduct, // Add product to order
} = useProductSearch(onProductAdd);
```

### `useOrderCalculations.ts` - Order Calculations

```typescript
// Manages order totals and product calculations
const {
  orderSummary, // Complete order totals
  updateProductQuantity, // Update product quantity
  removeProduct, // Remove product from order
  addProduct, // Add product to order
} = useOrderCalculations(formData, updateField);
```

### `useCustomerSearch.ts` - Customer Search

```typescript
// Handles customer search functionality
const {
  searchedCustomer, // Found customer data
  isSearching, // Loading state
  searchError, // Error messages
} = useCustomerSearch();
```

## 🌐 Services Layer

### `api.ts` - API Service Layer

- **Product API**: Search products, get all products
- **Customer API**: Search customers by mobile number
- **Order API**: Create new orders, validation
- **Mock Data**: Comprehensive mock data for development
- **Error Handling**: Centralized error handling and logging

## 📊 State Management

### Redux Store Structure

```typescript
// Feature-specific slice
createOrderSlice: {
  formData: CreateOrderFormData,
  isLoading: boolean,
  errors: ValidationErrors,
  orderSummary: OrderSummary
}
```

## 🎯 TypeScript Type System

### Core Types

```typescript
// Main form data structure
interface CreateOrderFormData {
  searchMobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  whatsappNumber: string;
  shippingAddress: Address;
  billingAddress: Address;
  copyBillingToShipping: boolean;
  products: OrderProduct[];
  couponCode: string;
  paymentMode: PaymentMethod;
}

// Product structure
interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
}

// Order summary calculations
interface OrderSummary {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shippingCharges: number;
  total: number;
}
```

## 🚀 Key Features Implemented

### 1. **Exact Design Match**

- ✅ ProductSearchForm uses dropdown design identical to CreateOrder
- ✅ ProductList uses card layout identical to CreateOrder
- ✅ PriceDetails matches CreateOrder layout and styling exactly
- ✅ PaymentMethodSelector matches CreateOrder radio button design

### 2. **Enhanced UX**

- ✅ Search Mobile Number moved to header section
- ✅ Product search shows all products by default
- ✅ Real-time search with debouncing
- ✅ Responsive design for mobile and desktop

### 3. **Performance Optimizations**

- ✅ React.memo for all components
- ✅ useCallback for event handlers
- ✅ useMemo for expensive calculations
- ✅ Debounced search to reduce API calls

### 4. **Developer Experience**

- ✅ TypeScript for type safety
- ✅ Comprehensive error handling
- ✅ Clean, readable code structure
- ✅ Proper separation of concerns

## 🔄 Data Flow

```
User Input → Component → Custom Hook → Service → API
    ↓           ↓          ↓           ↓        ↓
UI Update ← State ← Hook Response ← Service Response ← API Response
```

### Example: Product Search Flow

1. User types in `ProductSearchForm`
2. `useProductSearch` hook debounces input
3. Hook calls `productApi.searchProducts()`
4. API returns filtered results
5. Hook updates `searchResults` state
6. Component re-renders with new results
7. User clicks "Add" button
8. Product is added to order via `useOrderCalculations`

## 🧪 Testing Strategy

### Component Testing

- Unit tests for each component in isolation
- Test user interactions and form submissions
- Mock all external dependencies

### Hook Testing

- Test custom hooks with React Testing Library
- Test state updates and side effects
- Mock API calls and responses

### Integration Testing

- Test complete user flows
- Test component interactions
- Test error handling scenarios

## 📝 Usage Examples

### Using the Feature

```tsx
// In your router
import { CreateOrderPage } from './features/create-order';

<Route path="/create-order" element={<CreateOrderPage />} />;
```

### Extending the Feature

```tsx
// Add new component
export const NewComponent = memo(() => {
  // Component logic
});

// Add to components/index.ts
export { NewComponent } from './NewComponent';
```

### Adding New Hook

```tsx
// Create new hook
export const useNewFeature = () => {
  // Hook logic
  return {
    /* hook interface */
  };
};

// Add to hooks/index.ts
export { useNewFeature } from './useNewFeature';
```

## 📈 Benefits Achieved

### 1. **Maintainability**

- Related code is co-located
- Easy to find and modify functionality
- Clear separation of concerns

### 2. **Scalability**

- Easy to add new features
- Minimal impact on existing code
- Feature can be developed independently

### 3. **Reusability**

- Components can be reused across features
- Hooks encapsulate reusable logic
- Services can be shared

### 4. **Performance**

- Optimized re-rendering with React.memo
- Efficient state updates
- Debounced API calls

### 5. **Developer Experience**

- Type safety with TypeScript
- Clear code organization
- Easy to onboard new developers

## 🔮 Future Enhancements

### Potential Improvements

1. **Lazy Loading**: Implement code splitting for the feature
2. **Caching**: Add React Query for API caching
3. **Real-time Updates**: WebSocket integration for live updates
4. **Advanced Search**: Filters, sorting, pagination
5. **Accessibility**: Enhanced ARIA labels and keyboard navigation
6. **Internationalization**: Multi-language support
7. **Progressive Web App**: Offline functionality

### Extension Points

- Additional payment methods
- Advanced product variants
- Bulk order creation
- Order templates
- Integration with inventory management

---

## 📞 Support

For questions about this architecture or feature implementation, please refer to:

- Feature documentation in each folder
- TypeScript interfaces for API contracts
- Component prop interfaces for usage examples
- Custom hook return types for state management

---

_This feature demonstrates modern React development practices with a focus on maintainability, performance, and developer experience._
