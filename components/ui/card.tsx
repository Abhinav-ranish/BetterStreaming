'use client';

import React from 'react';
import clsx from 'clsx';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx('bg-white shadow-md rounded-lg p-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-800">{children}</div>;
}
