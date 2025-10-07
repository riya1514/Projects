// src/components/ui/card.tsx

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 bg-white ${className}`}>
      {children}
    </div>
  );
};
