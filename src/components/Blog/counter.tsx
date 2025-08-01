'use client';

import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Counter({ 
  initialValue = 0, 
  min, 
  max, 
  step = 1,
  className = ""
}: CounterProps) {
  const [count, setCount] = useState(initialValue);
  
  const canDecrement = min === undefined || count > min;
  const canIncrement = max === undefined || count < max;

  const handleDecrement = () => {
    if (canDecrement) {
      setCount(c => c - step);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      setCount(c => c + step);
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 my-6 bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}>
      <button 
        onClick={handleDecrement}
        disabled={!canDecrement}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease count"
      >
        -
      </button>
      <span className="text-lg font-mono min-w-[3ch] text-center" aria-live="polite">
        {count}
      </span>
      <button 
        onClick={handleIncrement}
        disabled={!canIncrement}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}
