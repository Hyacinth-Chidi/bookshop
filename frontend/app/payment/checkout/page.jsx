/**
 * ============================================
 * CHECKOUT PAGE (INACTIVE)
 * ============================================
 * Book checkout with Paystack
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment API calls below
 * 3. Add route to main router
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { getBookById } from '@/lib/bookApi';
// import { initializePurchase } from '@/lib/studentApi';
import Button from '@/components/shared/Button';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, CreditCard } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bookId = searchParams.get('bookId');
    if (bookId) {
      fetchBook(bookId);
    }
  }, [searchParams]);

  const fetchBook = async (bookId) => {
    try {
      // INACTIVE: Uncomment when API is ready
      // const response = await getBookById(bookId);
      // setBook(response.data);
      
      // Mock data for now
      setBook({
        id: bookId,
        name: 'Sample Book',
        price: 2500,
        courseCode: 'CSC 201',
      });
    } catch (error) {
      console.error('Failed to fetch book:', error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // INACTIVE: Uncomment when API is ready
      // const response = await initializePurchase({
      //   bookId: book.id,
      //   quantity,
      // });
      
      // Redirect to Paystack
      // window.location.href = response.data.paymentUrl;
      
      alert('Payment initiated! (INACTIVE)');
    } catch (error) {
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const totalAmount = book.price * quantity;

  return (
    <div className="min-h-screen bg-neutral-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: Payment checkout will work when student features are activated.
          </p>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>
          
          <div className="flex items-center justify-between py-4 border-b border-neutral-200">
            <div>
              <h3 className="font-medium text-neutral-900">{book.title}</h3>
              <p className="text-sm text-neutral-500">{book.courseCode}</p>
            </div>
            <p className="font-semibold text-neutral-900">{formatPrice(book.price, true)}</p>
          </div>

          <div className="py-4 border-b border-neutral-200">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-lg font-semibold text-neutral-900">Total</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(totalAmount, true)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg">
            <CreditCard className="w-6 h-6 text-primary" />
            <div>
              <p className="font-medium text-neutral-900">Paystack</p>
              <p className="text-sm text-neutral-500">Pay with card, bank transfer, or USSD</p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCheckout}
          loading={loading}
          disabled={loading}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Pay {formatPrice(totalAmount, true)}
        </Button>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← Back to Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}