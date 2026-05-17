"use client";

import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
  title,
  children,
  isOpen,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-red-950/45 p-4">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white shadow-xl ${maxWidth}`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-100 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <Button aria-label="Fechar" onClick={onClose} variant="ghost" className="h-9 w-9 px-0" icon={<X size={18} />}>
            <span className="sr-only">Fechar</span>
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
