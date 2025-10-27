'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { TreatmentItem } from '@/types';

interface ProcedureQuantityControlProps {
  item: TreatmentItem;
  onQuantityChange: (quantity: number) => void;
}

export const ProcedureQuantityControl = ({
  item,
  onQuantityChange,
}: ProcedureQuantityControlProps) => {
  const [quantity, setQuantity] = useState(item.selectedQuantity || 0);
  const [error, setError] = useState('');

  const coverageLimit = item.coverageLimit;
  const isAtLimit = quantity >= coverageLimit;
  const isNearLimit = quantity >= coverageLimit * 0.8 && quantity < coverageLimit;

  useEffect(() => {
    setQuantity(item.selectedQuantity || 0);
  }, [item.selectedQuantity]);

  const handleIncrement = () => {
    if (quantity < coverageLimit) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
      setError('');
    } else {
      setError(`Coverage limit of ${coverageLimit} reached`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value) || 0;

    if (numValue < 0) {
      setError('Quantity cannot be negative');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (numValue > coverageLimit) {
      setError(`Cannot exceed coverage limit of ${coverageLimit}`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    setQuantity(numValue);
    onQuantityChange(numValue);
    setError('');
  };

  const getProgressBarColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-orange-500';
    return 'bg-primary-500';
  };

  const progressPercentage = (quantity / coverageLimit) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity === 0}
            className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min="0"
            max={coverageLimit}
            className="w-16 h-8 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-semibold"
          />

          <button
            onClick={handleIncrement}
            disabled={isAtLimit}
            className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600 font-medium">
              Coverage: {quantity} / {coverageLimit}
            </span>
            {isAtLimit && (
              <span className="text-red-600 font-semibold">Limit Reached</span>
            )}
            {isNearLimit && (
              <span className="text-orange-600 font-semibold">Near Limit</span>
            )}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
