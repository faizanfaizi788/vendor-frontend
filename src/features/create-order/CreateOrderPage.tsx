import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  CustomerDetailsForm,
  AddressForm,
  ProductSearchForm,
  ProductList,
  PriceDetails,
  PaymentMethodSelector,
} from './components';
import {
  useCreateOrderForm,
  useOrderCalculations,
  useCustomerSearch,
} from './hooks';
import { Product } from './types';

/**
 * Create Order Page - Feature-based architecture implementation
 *
 * This component demonstrates:
 * - Feature-based folder structure
 * - Separation of concerns (hooks, components, services)
 * - Performance optimizations with React.memo and useCallback
 * - Clean, maintainable code structure
 */
const CreateOrderPage = memo(() => {
  const navigate = useNavigate();

  // Main form hook with validation and submission logic
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateAddress,
    validateForm,
    submitOrder,
  } = useCreateOrderForm();

  // Order calculations hook for totals and product management
  const {
    orderSummary,
    updateProductQuantity,
    removeProduct,
    addProduct: addProductToOrder,
  } = useOrderCalculations(formData, updateField);

  // Customer search functionality
  const {
    searchedCustomer,
    isSearching: isSearchingCustomer,
    searchError: customerSearchError,
  } = useCustomerSearch();

  // Memoized handlers to prevent unnecessary re-renders
  const handleGoBack = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  const handleProductAdd = useCallback(
    (product: Product) => {
      addProductToOrder(product);
    },
    [addProductToOrder]
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = await validateForm();
      if (isValid) {
        await submitOrder();
        // On successful submission, navigate to orders page
        if (!isSubmitting) {
          navigate('/orders');
        }
      }
    },
    [validateForm, submitOrder, isSubmitting, navigate]
  );

  // Memoized address error objects for better performance
  const shippingAddressErrors = useMemo(() => {
    return errors.shippingAddress || {};
  }, [errors.shippingAddress]);

  const billingAddressErrors = useMemo(() => {
    return errors.billingAddress || {};
  }, [errors.billingAddress]);

  // Memoized copy billing checkbox handler
  const handleCopyBillingChange = useCallback(
    (checked: boolean) => {
      updateField('copyBillingToShipping', checked);
    },
    [updateField]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={handleGoBack}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
            <p className="text-sm text-gray-500">
              Fill in the details to create a new order
            </p>
          </div>
        </div>
      </div>

      {/* Search Mobile Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Mobile Number *
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="tel"
            value={formData.searchMobileNumber}
            onChange={(e) => updateField('searchMobileNumber', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.searchMobileNumber ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter mobile number"
          />
        </div>
        {errors.searchMobileNumber &&
          typeof errors.searchMobileNumber === 'string' && (
            <p className="mt-1 text-sm text-red-600">
              {errors.searchMobileNumber}
            </p>
          )}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Customer Details */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Details
            </h3>
            <CustomerDetailsForm
              formData={formData}
              errors={errors}
              onFieldChange={updateField}
            />

            {/* Customer Search Results */}
            {isSearchingCustomer && (
              <div className="mt-4 text-sm text-blue-600">
                Searching for customer...
              </div>
            )}
            {customerSearchError && (
              <div className="mt-4 text-sm text-red-600">
                {customerSearchError}
              </div>
            )}
            {searchedCustomer && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Customer found: {searchedCustomer.firstName}{' '}
                  {searchedCustomer.lastName}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <div className="p-6">
              <AddressForm
                address={formData.shippingAddress}
                type="shipping"
                errors={shippingAddressErrors}
                onAddressChange={(field, value) =>
                  updateAddress('shipping', field, value)
                }
              />
            </div>
          </Card>

          {/* Billing Address */}
          <Card>
            <div className="p-6">
              <AddressForm
                address={formData.billingAddress}
                type="billing"
                errors={billingAddressErrors}
                disabled={formData.copyBillingToShipping}
                onAddressChange={(field, value) =>
                  updateAddress('billing', field, value)
                }
                copyBillingToShipping={formData.copyBillingToShipping}
                onCopyBillingChange={handleCopyBillingChange}
              />
            </div>
          </Card>
        </div>

        {/* Products */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Products
            </h3>

            {/* Product Search */}
            <ProductSearchForm onProductAdd={handleProductAdd} />

            {/* Product List */}
            <ProductList
              products={formData.products}
              onQuantityChange={updateProductQuantity}
              onRemoveProduct={removeProduct}
            />

            {/* Products Error */}
            {errors.products && typeof errors.products === 'string' && (
              <p className="mt-4 text-sm text-red-600">{errors.products}</p>
            )}
          </div>
        </Card>

        {/* Order Summary and Payment */}
        <div className="space-y-4">
          {/* Price Details */}
          <PriceDetails
            orderSummary={orderSummary}
            couponCode={formData.couponCode}
            onCouponChange={(code) => updateField('couponCode', code)}
          />

          {/* Payment Method */}
          <PaymentMethodSelector
            selectedMethod={formData.paymentMode}
            onMethodChange={(method: string) =>
              updateField('paymentMode', method)
            }
          />

          {/* Place Order Button */}
          <Card>
            <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || formData.products.length === 0}
                className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Order...' : 'Place Order'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Spacer for mobile */}
        <div className="h-4" />
      </form>
    </div>
  );
});

CreateOrderPage.displayName = 'CreateOrderPage';

export default CreateOrderPage;
