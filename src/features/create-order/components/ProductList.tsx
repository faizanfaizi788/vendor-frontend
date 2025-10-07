import { memo } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { ProductListProps } from '../types';

/**
 * Product list component showing selected products (matching CreateOrder design)
 */
export const ProductList = memo<ProductListProps>(
  ({ products, onQuantityChange, onRemoveProduct }) => {
    if (products.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No products added. Search and add products above.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {products.map((product, index) => {
          // Mock data to match the CreateOrder screenshot exactly
          const mockProducts = [
            {
              name: 'Printed Black Sweatshirt',
              currentPrice: 200.0,
              originalPrice: 1000.0,
              discount: 70,
              color: 'Black',
              size: '40',
              seller: 'Seller A',
              image:
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center',
            },
            {
              name: 'Lavie Rice Brightening Face Wash',
              currentPrice: 1399.0,
              originalPrice: 7000.0,
              discount: 80,
              color: 'Brown',
              size: 'One Size',
              seller: 'Seller B',
              image:
                'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop&crop=center',
            },
            {
              name: 'Canvas School Bag - Unisex',
              currentPrice: 100.0,
              originalPrice: 150.0,
              discount: 50,
              color: 'Green',
              size: '40',
              seller: 'Jack',
              image:
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center',
            },
          ];

          const mockProduct = mockProducts[index] || {
            name: product.productName,
            currentPrice: product.price,
            originalPrice: Math.round(product.price * 1.5),
            discount: 30,
            color: 'Black',
            size: '40',
            seller: 'Jack',
            image:
              product.image ||
              'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center',
          };

          return (
            <div
              key={product.id}
              className="flex items-start space-x-4 p-4 bg-white"
            >
              {/* Product Image - Increased size */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={mockProduct.image}
                  alt={mockProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://via.placeholder.com/96x96?text=No+Image';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {mockProduct.name}
                  </h3>
                  <div className="text-xs text-gray-500 mb-1">
                    Product ID: {product.productCode}
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{mockProduct.currentPrice}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{mockProduct.originalPrice}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded">
                      {mockProduct.discount}% OFF
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Color: {mockProduct.color} • Size: {mockProduct.size}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(product.id, product.quantity - 1)
                    }
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {product.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(product.id, product.quantity + 1)
                    }
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  Sold by: {mockProduct.seller}
                </div>

                {/* Remove Button - Moved below */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-gray-400 hover:text-red-600 p-1 w-fit"
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ProductList.displayName = 'ProductList';
