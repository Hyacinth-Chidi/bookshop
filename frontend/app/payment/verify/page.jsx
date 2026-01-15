/**
 * ============================================
 * PAYMENT VERIFICATION PAGE (INACTIVE)
 * ============================================
 * Verify Paystack payment
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment API calls below
 * 3. Add route to main router
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { verifyPurchase } from '@/lib/studentApi';
import Button from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/Loading';
import { CheckCircle, XCircle } from 'lucide-react';

function VerifyPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, failed
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      verifyPayment(reference);
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      // INACTIVE: Uncomment when API is ready
      // const response = await verifyPurchase(reference);
      // setPurchase(response.data);
      // setStatus('success');

      // Mock verification
      setTimeout(() => {
        setStatus('success');
        setPurchase({
          book: { name: 'Sample Book' },
          totalAmount: 2500,
        });
      }, 2000);
    } catch (error) {
      setStatus('failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-700">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium text-center">
            ⚠️ INACTIVE FEATURE: This is a preview. Payment verification will work when activated.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {status === 'success' ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-neutral-700 mb-6">
                Your payment has been confirmed. You can now pick up your book from the bookshop.
              </p>
              <div className="bg-neutral-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-neutral-500 mb-1">Book Purchased</p>
                <p className="font-medium text-neutral-900">{purchase?.book?.name}</p>
              </div>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/student/purchases')}
                >
                  View Purchase History
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push('/books')}
                >
                  Browse More Books
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-4">
                <XCircle className="w-12 h-12 text-error" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-neutral-700 mb-6">
                We couldn't verify your payment. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/books')}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push('/student/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyPaymentContent />
    </Suspense>
  );
}