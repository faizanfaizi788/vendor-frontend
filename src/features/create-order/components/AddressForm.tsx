import { memo } from 'react';
import { AddressFormProps } from '../types';

/**
 * Address form component for shipping and billing addresses
 */
export const AddressForm = memo<AddressFormProps>(
  ({
    address,
    type,
    errors = {},
    disabled = false,
    onAddressChange,
    copyBillingToShipping,
    onCopyBillingChange,
  }) => {
    const getInputClassName = (fieldName: string) => {
      const baseClasses =
        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
      const errorClasses = errors[fieldName as keyof typeof errors]
        ? 'border-red-300'
        : 'border-gray-300';
      const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : '';
      return `${baseClasses} ${errorClasses} ${disabledClasses}`;
    };

    const getTextareaClassName = (fieldName: string) => {
      const baseClasses =
        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none';
      const errorClasses = errors[fieldName as keyof typeof errors]
        ? 'border-red-300'
        : 'border-gray-300';
      const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : '';
      return `${baseClasses} ${errorClasses} ${disabledClasses}`;
    };

    const getErrorMessage = (fieldName: keyof typeof errors) => {
      const error = errors[fieldName];
      return error?.message || '';
    };

    const title = type === 'shipping' ? 'Shipping Address' : 'Billing Address';

    return (
      <div className="space-y-4">
        {/* Copy Billing to Shipping Checkbox - Only show for billing address */}
        {type === 'billing' && onCopyBillingChange && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={copyBillingToShipping || false}
                onChange={(e) => onCopyBillingChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Copy shipping address to billing address
              </span>
            </label>
          </div>
        )}

        {/* Spacer for shipping address to match billing address alignment */}
        {type === 'shipping' && (
          <div className="mb-4">
            <div className="h-6"></div>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code {type === 'shipping' ? '*' : ''}
          </label>
          <input
            type="text"
            value={address.pinCode || ''}
            onChange={(e) => onAddressChange('pinCode', e.target.value)}
            className={getInputClassName('pinCode')}
            placeholder="Enter PIN code"
            disabled={disabled}
            maxLength={6}
          />
          {getErrorMessage('pinCode') && (
            <p className="mt-1 text-sm text-red-600">
              {getErrorMessage('pinCode')}
            </p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City {type === 'shipping' ? '*' : ''}
            </label>
            <input
              type="text"
              value={address.city || ''}
              onChange={(e) => onAddressChange('city', e.target.value)}
              className={getInputClassName('city')}
              placeholder="Enter city"
              disabled={disabled}
            />
            {getErrorMessage('city') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('city')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State {type === 'shipping' ? '*' : ''}
            </label>
            <input
              type="text"
              value={address.state || ''}
              onChange={(e) => onAddressChange('state', e.target.value)}
              className={getInputClassName('state')}
              placeholder="Enter state"
              disabled={disabled}
            />
            {getErrorMessage('state') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('state')}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={address.country || 'India'}
            onChange={(e) => onAddressChange('country', e.target.value)}
            className={getInputClassName('country')}
            placeholder="Enter country"
            disabled={disabled}
          />
          {getErrorMessage('country') && (
            <p className="mt-1 text-sm text-red-600">
              {getErrorMessage('country')}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address {type === 'shipping' ? '*' : ''}
          </label>
          <textarea
            value={address.address}
            onChange={(e) => onAddressChange('address', e.target.value)}
            className={getTextareaClassName('address')}
            rows={3}
            placeholder={`Enter ${type} address`}
            disabled={disabled}
          />
          {getErrorMessage('address') && (
            <p className="mt-1 text-sm text-red-600">
              {getErrorMessage('address')}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AddressForm.displayName = 'AddressForm';
