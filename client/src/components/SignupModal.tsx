import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import SignupForm from "@/components/SignupForm";

const ModalContext = createContext<{
  open: boolean;
  show: () => void;
  hide: () => void;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // listen for global event so legacy code can open the modal
  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-signup-modal", handler as EventListener);
    return () =>
      window.removeEventListener("open-signup-modal", handler as EventListener);
  }, []);
  return (
    <ModalContext.Provider
      value={{ open, show: () => setOpen(true), hide: () => setOpen(false) }}
    >
      {children}
      <Dialog
        open={open}
        onOpenChange={(v) => (v ? setOpen(true) : setOpen(false))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your account</DialogTitle>
            <DialogDescription>
              Sign up to access the full Elysian experience.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <SignupForm />
          </div>
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export default function SignupModal() {
  const { open, hide } = useModal();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && hide()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Sign up to access the full Elysian experience.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <SignupForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
