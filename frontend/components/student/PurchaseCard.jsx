/**
 * ============================================
 * PURCHASE CARD COMPONENT (INACTIVE)
 * ============================================
 * Display single purchase in history
 */

import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function PurchaseCard({ purchase }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-error/10 text-error';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-smooth">
      <div className="flex gap-4 p-4">
        {/* Book Image */}
        <div className="relative w-24 h-32 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
          {purchase.book?.frontCover ? (
            <Image
              src={purchase.book.frontCover}
              alt={purchase.book.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-500 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Purchase Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-neutral-900 line-clamp-2">
              {purchase.book?.title}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(purchase.paymentStatus)}`}>
              {getStatusIcon(purchase.paymentStatus)}
              {purchase.paymentStatus}
            </span>
          </div>

          <p className="text-sm text-neutral-500 mb-2">
            {purchase.book?.courseCode}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Quantity: {purchase.quantity}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatPrice(purchase.totalAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">
                {formatDate(purchase.purchasedAt)}
              </p>
              {purchase.paystackRef && (
                <p className="text-xs text-neutral-400 mt-1">
                  Ref: {purchase.paystackRef.slice(0, 10)}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}