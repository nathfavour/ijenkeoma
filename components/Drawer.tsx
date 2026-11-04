'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string; // desktop width, default max-w-lg
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  widthClass = 'max-w-xl',
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Scrim with Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Drawer Container:
          - Mobile: Bottom Sheet with drag handle
          - Desktop (md+): Slide-over Right Sidebar
      */}
      <aside
        className={`fixed z-50 bg-[#0B0D14] border-slate-800/80 shadow-2xl flex flex-col text-slate-100 transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[92vh] rounded-t-3xl border-t
          md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-full md:rounded-none md:border-l md:border-t-0
          w-full md:${widthClass} animate-in slide-in-from-bottom md:slide-in-from-right
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Pull Handle */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] shrink-0">
          <div>
            {title && (
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
          {children}
        </div>
      </aside>
    </div>
  );
};
