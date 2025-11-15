// atoms.jsx - UI components nhỏ
import React from "react";

export function EmptyAdd({ label }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
}

export function Thumb({ src, onRemove, onClick, isCover }) {
  return (
    <div
      className={`relative overflow-hidden rounded aspect-square cursor-pointer ${
        isCover ? "ring-2 ring-blue-500" : "ring-1 ring-transparent"
      }`}
      onClick={onClick}
      title={isCover ? "Ảnh đại diện" : "Chọn làm ảnh đại diện"}
    >
      <img src={src} alt="" className="object-cover w-full h-full" />
      {isCover && (
        <span className="absolute left-1 top-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">
          Thumbnail
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md hover:bg-red-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export function AddSquare({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center bg-gray-100 border-2 border-dashed rounded cursor-pointer aspect-square hover:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
  );
}

export function AddRow({ onClick, label }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center w-full mt-2 bg-gray-100 border-2 border-dashed rounded cursor-pointer h-31 hover:bg-gray-200"
    >
      <div className="flex items-center gap-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

export function VideoThumb({ src, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-black rounded aspect-video">
      <video src={src} controls className="object-cover w-full h-full" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md hover:bg-red-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
