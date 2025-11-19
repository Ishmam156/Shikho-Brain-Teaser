import React from 'react';
import { NumberItem } from '../types';

interface NumberBankProps {
  items: NumberItem[];
  selectedItemId: string | null;
  onSelect: (item: NumberItem) => void;
}

export const NumberBank: React.FC<NumberBankProps> = ({ items, selectedItemId, onSelect }) => {
  const availableItems = items.filter(i => !i.isUsed);

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-500 mb-2 font-medium text-center uppercase tracking-wide">
          Available Numbers (Tap to Select)
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-h-40 overflow-y-auto p-2">
          {availableItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center 
                text-xl sm:text-2xl font-bold rounded-lg shadow-md transition-all duration-200
                ${selectedItemId === item.id 
                  ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-200' 
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 hover:scale-105'}
              `}
            >
              {item.value}
            </button>
          ))}
          {availableItems.length === 0 && (
            <div className="text-gray-400 italic py-4">All numbers placed!</div>
          )}
        </div>
      </div>
    </div>
  );
};
