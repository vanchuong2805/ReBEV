// ActionBar.jsx - Component cho nút submit và reset
import React from "react";
import { Button } from "@/components/ui/button";

export default function ActionBar({ onReset, isSubmitting, disabled = false }) {
  return (
    <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="bg-blue-500 btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-400"
        title={disabled ? "Bạn cần đăng ký gói trước" : ""}
      >
        {isSubmitting ? "Đang đăng..." : "Đăng tin"}
      </Button>
      <Button
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
        className="bg-blue-500 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-400"
      >
        Xoá form
      </Button>
    </div>
  );
}
