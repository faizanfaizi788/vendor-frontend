import { memo } from 'react';
import Card from '../../../components/ui/Card';
import { PriceDetailsProps } from '../types';

/**
 * Price details component matching CreateOrder design exactly
 */
export const PriceDetails = memo<PriceDetailsProps>(
  ({ orderSummary, couponCode, onCouponChange }) => {
    return (
      <div className="space-y-4">
        {/* Apply Coupon Code Section */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                Apply Coupon Code
              </h3>
              <button className="text-purple-600 text-sm font-medium">
                View Coupons
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose coupon"
              />
            </div>
          </div>
        </Card>

        {/* Price Details Section */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Price Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bag-Total</span>
                <span className="font-medium">₹{orderSummary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Bag Discount</span>
                <span className="text-gray-500 text-sm">
                  -₹{orderSummary.discount - orderSummary.couponDiscount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Coupon Discount</span>
                <span className="text-gray-500 text-sm">
                  -₹{orderSummary.couponDiscount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{orderSummary.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

PriceDetails.displayName = 'PriceDetails';
