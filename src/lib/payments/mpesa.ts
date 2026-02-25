// M-Pesa Daraja API Integration
// Note: This requires backend implementation for security

interface MpesaSTKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

// This should be called from a secure backend endpoint
export const initiateMpesaPayment = async (request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> => {
  try {
    // Call your backend API endpoint that handles M-Pesa
    const response = await fetch('/api/mpesa/stk-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('M-Pesa payment initiation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    throw error;
  }
};

export const checkMpesaPaymentStatus = async (checkoutRequestId: string) => {
  try {
    const response = await fetch(`/api/mpesa/query/${checkoutRequestId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('M-Pesa status check error:', error);
    throw error;
  }
};

// Format phone number for M-Pesa (254XXXXXXXXX)
export const formatMpesaPhone = (phone: string): string => {
  // Remove any spaces, dashes, or plus signs
  let cleaned = phone.replace(/[\s\-+]/g, '');
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};
