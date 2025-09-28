// --- lib ---
import { useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./ConfirmActionModal.module.css";

// --- components ---
import Loader from "@/components/common/Loader/Loader";

// --- type ---
type ConfirmActionModalProps = {
  actionType: "DELETE_INVOICE" | "UPDATE_INVOICE" | "CREATE_INVOICE";
  invoiceId?: string;
};

const ConfirmActionModal = ({
  actionType,
  invoiceId,
}: ConfirmActionModalProps) => {
  const { closeModal } = useModalContext();
  const { updateInvoice, currentInvoice, createInvoice, deleteInvoice } =
    useInvoiceContext();
  const [isConformationView, setIsConfirmationView] = useState(true);
  const { getText } = useTranslation();

  // --- Get confirm button text based on action type ---
  const getConfirmButtonText = () => {
    switch (actionType) {
      case "DELETE_INVOICE":
        return getText("DELETE");
      case "UPDATE_INVOICE":
        return getText("UPDATE");
      default:
        return getText("CONFIRM");
    }
  };

  // --- Handle confirm action based on action type ---
  const handleConfirm = () => {
    setIsConfirmationView(false);
    switch (actionType) {
      case "DELETE_INVOICE":
        if (!invoiceId) return;
        deleteInvoice.execute(invoiceId, invoiceId);
        break;
      case "UPDATE_INVOICE":
        if (!currentInvoice) return;
        updateInvoice.execute(currentInvoice);
        break;
      case "CREATE_INVOICE":
        if (!currentInvoice) return;
        createInvoice.execute(currentInvoice, "FORM_EDITOR");
        break;
      default:
        break;
    }
  };

  return (
    <div className={style["modal-body-content"]}>
      {isConformationView && (
        <>
          <button className={style["cancel-button"]} onClick={closeModal}>
            {getText("CANCEL")}
          </button>
          <button
            className={`${style["confirm-button"]} ${
              actionType === "DELETE_INVOICE" ? style["delete-invoice"] : ""
            }`}
            onClick={handleConfirm}
          >
            {getConfirmButtonText()}
          </button>
        </>
      )}
      {(updateInvoice.isLoading ||
        createInvoice.isLoading ||
        deleteInvoice.isLoading) && <Loader />}
    </div>
  );
};

export default ConfirmActionModal;
