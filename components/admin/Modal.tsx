"use client";

import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Use `wide` for forms that need more horizontal space */
  wide?: boolean;
}

/**
 * Generic backdrop modal.
 * Wraps content in a glassmorphism card with a header + close button.
 */
export default function Modal({ onClose, title, children, wide }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in-up">
      <div
        className={`bg-[#12102a] border border-white/10 rounded-2xl shadow-2xl w-full overflow-hidden ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
