import React from 'react';

export default function Loading({ message = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
