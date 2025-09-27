// --- lib ---
import { createContext, useState } from "react";

// --- types ---
type ModalVariant =
  | { type: "NEW_INVOICE"; actionType: null } // New invoice by uploading a file
  | {
      type: "CONFIRM_ACTION";
      actionType: "DELETE_INVOICE" | "UPDATE_INVOICE" | "CREATE_INVOICE";
    }
  | null;

// --- context ---
type ModalContextType = {
  isOpen: boolean;
  variant: ModalVariant;
  openModal: (variant: ModalVariant) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ModalVariant>(null);

  const openModal = (variant: ModalVariant) => {
    setVariant(variant);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setVariant(null);
  };

  const value = { isOpen, openModal, variant, closeModal };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
