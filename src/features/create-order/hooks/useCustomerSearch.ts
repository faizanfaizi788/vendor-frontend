import { useState, useCallback } from 'react';
import { Customer } from '../types';
import { customerApi } from '../services/api';

export interface UseCustomerSearchReturn {
  searchedCustomer: Customer | null;
  isSearching: boolean;
  searchError: string | null;
  searchCustomerByMobile: (mobileNumber: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Custom hook for customer search functionality
 */
export const useCustomerSearch = (): UseCustomerSearchReturn => {
  const [searchedCustomer, setSearchedCustomer] = useState<Customer | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchCustomerByMobile = useCallback(async (mobileNumber: string) => {
    if (!mobileNumber.trim()) {
      setSearchedCustomer(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const customer = await customerApi.searchByMobile(mobileNumber);
      setSearchedCustomer(customer);

      if (!customer) {
        setSearchError('No customer found with this mobile number');
      }
    } catch (error) {
      console.error('Failed to search customer:', error);
      setSearchError(
        error instanceof Error ? error.message : 'Failed to search customer'
      );
      setSearchedCustomer(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchedCustomer(null);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  return {
    searchedCustomer,
    isSearching,
    searchError,
    searchCustomerByMobile,
    clearSearch,
  };
};
