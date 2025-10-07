import { memo } from 'react';
import Card from '../../../components/ui/Card';
import { PaymentMethodSelectorProps } from '../types';

/**
 * Payment method selector component matching CreateOrder design
 */
export const PaymentMethodSelector = memo<PaymentMethodSelectorProps>(
  ({ selectedMethod, onMethodChange }) => {
    return (
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Select Payment Method
          </h3>
          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value="cod"
                checked={selectedMethod === 'cod'}
                onChange={(e) => onMethodChange(e.target.value as any)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Cash on Delivery
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value="qr"
                checked={selectedMethod === 'qr'}
                onChange={(e) => onMethodChange(e.target.value as any)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Payment on QR
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value="payment-link"
                checked={selectedMethod === 'payment-link'}
                onChange={(e) => onMethodChange(e.target.value as any)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Payments on link
              </span>
            </label>
          </div>
        </div>
      </Card>
    );
  }
);

PaymentMethodSelector.displayName = 'PaymentMethodSelector';
