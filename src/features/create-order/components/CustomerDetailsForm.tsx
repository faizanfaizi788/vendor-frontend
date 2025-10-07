import { memo } from 'react';
import { CustomerDetailsFormProps } from '../types';

/**
 * Customer details form component
 * Handles customer information input with validation
 */
export const CustomerDetailsForm = memo<CustomerDetailsFormProps>(
  ({ formData, errors, onFieldChange }) => {
    const getInputClassName = (fieldName: string) => {
      const baseClasses =
        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
      const errorClasses = errors[fieldName as keyof typeof errors]
        ? 'border-red-300'
        : 'border-gray-300';
      return `${baseClasses} ${errorClasses}`;
    };

    const getErrorMessage = (fieldName: keyof typeof errors) => {
      const error = errors[fieldName];
      return error?.message || '';
    };

    return (
      <div className="space-y-6">
        {/* Customer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              className={getInputClassName('firstName')}
              placeholder="Enter first name"
            />
            {getErrorMessage('firstName') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('firstName')}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              className={getInputClassName('lastName')}
              placeholder="Enter last name"
            />
            {getErrorMessage('lastName') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('lastName')}
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => onFieldChange('whatsappNumber', e.target.value)}
              className={getInputClassName('whatsappNumber')}
              placeholder="Enter WhatsApp number"
            />
            {getErrorMessage('whatsappNumber') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('whatsappNumber')}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={getInputClassName('email')}
              placeholder="Enter email address"
            />
            {getErrorMessage('email') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('email')}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => onFieldChange('mobileNumber', e.target.value)}
              className={getInputClassName('mobileNumber')}
              placeholder="Enter mobile number"
            />
            {getErrorMessage('mobileNumber') && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessage('mobileNumber')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CustomerDetailsForm.displayName = 'CustomerDetailsForm';
