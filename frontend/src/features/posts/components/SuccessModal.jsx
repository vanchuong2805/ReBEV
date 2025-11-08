// SuccessModal.jsx - Modal hiện sau khi đăng tin thành công
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, onPostAgain, onViewListings }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-xl text-center">
            Đăng tin thành công!
          </DialogTitle>
          <DialogDescription className="text-center">
            Bài đăng của bạn đã được tạo thành công. Bạn muốn làm gì tiếp theo?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={onPostAgain}
            className="w-full bg-blue-600 sm:w-auto hover:bg-blue-700"
          >
            Đăng tin tiếp
          </Button>
          <Button
            onClick={onViewListings}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Xem bài đăng của tôi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
