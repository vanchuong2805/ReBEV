// src/components/FieldError.jsx
import React from "react";

export default function FieldError({ message, className = "" }) {
  if (!message) return null;
  return (
    <div
      className={`absolute px-2 py-1 mt-1 text-sm text-red-600 w-max ${className}`}
    >
      {message}
    </div>
  );
}
