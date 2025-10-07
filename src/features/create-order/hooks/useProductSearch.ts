import { useState, useCallback, useEffect } from 'react';
import { Product, UseProductSearchReturn } from '../types';
import { productApi } from '../services/api';
import { useDebounce } from '../../../hooks/useDebounce';

/**
 * Custom hook for product search functionality
 */
export const useProductSearch = (
  onProductAdd: (product: Product) => void
): UseProductSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load all products on mount to show by default
  useEffect(() => {
    const loadAllProducts = async () => {
      setIsSearching(true);
      try {
        const response = await productApi.getAllProducts();
        setSearchResults(response.products);
      } catch (error) {
        console.error('Failed to load products:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    loadAllProducts();
  }, []);

  // Search products when debounced query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearchQuery.trim()) {
        // If no search query, load all products
        setIsSearching(true);
        try {
          const response = await productApi.getAllProducts();
          setSearchResults(response.products);
        } catch (error) {
          console.error('Failed to load products:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const response = await productApi.searchProducts(debouncedSearchQuery);
        setSearchResults(response.products);
      } catch (error) {
        console.error('Failed to search products:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchProducts();
  }, [debouncedSearchQuery]);

  // Show results when there are products available OR when explicitly requested
  useEffect(() => {
    // Don't auto-hide results - let the component control this
    if (searchResults.length > 0 && showResults) {
      // Keep results shown if they exist and we want to show them
      return;
    }
  }, [searchResults, showResults]);

  const addProduct = useCallback(
    (product: Product) => {
      onProductAdd(product);
      setSearchQuery('');
      setShowResults(false);
    },
    [onProductAdd]
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Always show results when user types, regardless of content
    setShowResults(true);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    addProduct,
  };
};
