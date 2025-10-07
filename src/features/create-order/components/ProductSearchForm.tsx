import { memo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { ProductSearchFormProps, Product } from '../types';
import { useProductSearch } from '../hooks';

/**
 * Product search form component with dropdown results (matching CreateOrder design)
 */
export const ProductSearchForm = memo<ProductSearchFormProps>(
  ({ onProductAdd }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      showResults,
      setShowResults,
      addProduct,
    } = useProductSearch(onProductAdd);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setShowResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowResults]);

    const handleProductAdd = (product: Product) => {
      addProduct(product);
    };

    const handleInputFocus = () => {
      setShowResults(true); // Always show results on focus
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setShowResults(true); // Ensure results stay visible while typing
    };

    return (
      <div
        className="mb-4 product-search-container relative"
        ref={containerRef}
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products by name or code..."
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Product Search Results Dropdown */}
        {showResults && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://via.placeholder.com/48x48?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        Product ID: {product.code}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Add Button */}
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleProductAdd(product)}
                      className="ml-2 flex-shrink-0"
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {isSearching ? 'Searching...' : 'No products found'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProductSearchForm.displayName = 'ProductSearchForm';
