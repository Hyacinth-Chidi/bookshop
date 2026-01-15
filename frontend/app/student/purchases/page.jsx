/**
 * ============================================
 * STUDENT PURCHASES PAGE (INACTIVE)
 * ============================================
 * View purchase history
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment API calls below
 * 3. Add route to main router
 */

'use client';

import { useState, useEffect } from 'react';
// import { getMyPurchases } from '@/lib/studentApi';
import PurchaseCard from '@/components/student/PurchaseCard';
import { LoadingSpinner } from '@/components/shared/Loading';
import { ShoppingBag } from 'lucide-react';

export default function StudentPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending, failed

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      // INACTIVE: Uncomment when API is ready
      // const response = await getMyPurchases();
      // setPurchases(response.data);
      
      // For now, set empty array
      setPurchases([]);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter === 'all') return true;
    return purchase.paymentStatus === filter;
  });

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: Purchase history will work when student features are activated.
          </p>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Purchase History
          </h1>
          <p className="text-neutral-500">
            View all your book purchases
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                  filter === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Purchases List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No purchases yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Start browsing books and make your first purchase!
            </p>
            <a
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-smooth"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}