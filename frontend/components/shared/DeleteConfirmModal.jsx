/**
 * ============================================
 * DELETE CONFIRM MODAL COMPONENT
 * ============================================
 * Reusable delete confirmation modal
 */

'use client';

import Modal from './Modal';
import Button from './Button';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this item',
  itemType = 'item',
  warning = null,
  loading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="error" onClick={onConfirm} loading={loading}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-error" />
        </div>
        <p className="text-neutral-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-neutral-900">"{itemName}"</span>?
        </p>
        {warning && (
          <p className="text-sm text-error mt-2">
            {warning}
          </p>
        )}
      </div>
    </Modal>
  );
}
