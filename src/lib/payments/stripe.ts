// Stripe Payment Integration
// Install: npm install @stripe/stripe-js

interface StripePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

// This should be called from a secure backend endpoint
export const createStripePaymentIntent = async (request: StripePaymentRequest) => {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
};

export const confirmStripePayment = async (paymentIntentId: string) => {
  try {
    const response = await fetch(`/api/stripe/confirm-payment/${paymentIntentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    throw error;
  }
};

// Format amount for Stripe (cents)
export const formatStripeAmount = (amount: number): number => {
  return Math.round(amount * 100);
};
