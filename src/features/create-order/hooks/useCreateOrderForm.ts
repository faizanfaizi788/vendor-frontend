import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderFormSchema } from '../types/validation';
import {
  CreateOrderFormData,
  Address,
  DEFAULT_FORM_DATA,
  UseCreateOrderFormReturn,
} from '../types';
import { orderApi } from '../services/api';

/**
 * Custom hook for managing create order form state and validation using React Hook Form
 */
export const useCreateOrderForm = (): UseCreateOrderFormReturn => {
  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: DEFAULT_FORM_DATA,
    mode: 'onChange',
  });

  const formData = watch(); // Watch all form values

  const updateField = useCallback(
    (field: keyof CreateOrderFormData, value: any) => {
      setValue(field, value);

      // Handle special cases
      if (field === 'copyBillingToShipping' && value === true) {
        setValue('billingAddress', getValues('shippingAddress'));
      }

      // Trigger validation for the field
      trigger(field);
    },
    [setValue, getValues, trigger]
  );

  const updateAddress = useCallback(
    (type: 'shipping' | 'billing', field: keyof Address, value: string) => {
      const currentAddress = getValues(`${type}Address`);
      const updatedAddress = {
        ...currentAddress,
        [field]: value,
      };

      setValue(`${type}Address`, updatedAddress);

      // If billing is copied from shipping, update billing when shipping changes
      if (type === 'shipping' && getValues('copyBillingToShipping')) {
        setValue('billingAddress', updatedAddress);
      }

      // Trigger validation for the address
      trigger(`${type}Address`);
    },
    [setValue, getValues, trigger]
  );

  const validateForm = useCallback(async () => {
    return await trigger(); // Trigger validation for all fields
  }, [trigger]);

  const resetForm = useCallback(() => {
    reset(DEFAULT_FORM_DATA);
  }, [reset]);

  const submitOrder = useCallback(
    async (data: CreateOrderFormData) => {
      try {
        const response = await orderApi.createOrder(data);
        console.log('Order created successfully:', response);

        // Reset form on successful submission
        resetForm();

        // You might want to navigate to order confirmation page here
        // navigate(`/orders/${response.orderId}`);
      } catch (error) {
        console.error('Failed to create order:', error);
        // Handle error (show toast, etc.)
        throw error; // Re-throw to let the caller handle it
      }
    },
    [resetForm]
  );

  // Create a wrapper for handleSubmit to match the expected interface
  const submitOrderHandler = useCallback(async () => {
    return handleSubmit(submitOrder)();
  }, [handleSubmit, submitOrder]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateAddress,
    validateForm,
    resetForm,
    submitOrder: submitOrderHandler,
  };
};
