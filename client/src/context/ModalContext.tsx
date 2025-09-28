// --- lib ---
import { createContext, useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- types ---
type ModalVariant =
  | { type: "NEW_INVOICE"; actionType: null } // New invoice by uploading a file
  | {
      type: "CONFIRM_ACTION";
      actionType: "DELETE_INVOICE" | "UPDATE_INVOICE" | "CREATE_INVOICE";

      invoiceId?: string;
    }
  | { type: "LOAD_INVOICE"; actionType: null }
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

  const { updateInvoice, createInvoice } = useInvoiceContext();

  const openModal = (variant: ModalVariant) => {
    setVariant(variant);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setVariant(null);

    switch (variant?.type) {
      case "CONFIRM_ACTION":
        updateInvoice.reset();
        createInvoice.reset();
        break;
      case "NEW_INVOICE":
        createInvoice.reset();
        break;
      default:
        break;
    }
  };

  const value = { isOpen, openModal, variant, closeModal };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
