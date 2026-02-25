// Supabase Edge Function for M-Pesa Callback
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const { Body } = payload;

    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const callbackMetadata = Body.stkCallback.CallbackMetadata.Item;
      const amount = callbackMetadata.find((item: any) => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find((item: any) => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = callbackMetadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

      // Update payment record in database
      const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
      
      await supabase
        .from('payments')
        .update({
          status: 'completed',
          mpesa_receipt: mpesaReceiptNumber,
          transaction_id: checkoutRequestId,
          payment_date: new Date(transactionDate).toISOString(),
          metadata: {
            phone: phoneNumber,
            callback: Body.stkCallback,
          },
        })
        .eq('transaction_id', checkoutRequestId);

      // Update booking status to confirmed
      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('transaction_id', checkoutRequestId)
        .single();

      if (payment) {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', payment.booking_id);
      }
    } else {
      // Payment failed
      const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          metadata: { callback: Body.stkCallback },
        })
        .eq('transaction_id', checkoutRequestId);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: 'Failed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
