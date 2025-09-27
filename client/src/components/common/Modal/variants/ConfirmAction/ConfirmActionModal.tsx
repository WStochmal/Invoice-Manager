// --- lib ---
import { useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useModalContext } from "@/hooks/useModalContext";

// --- style ---
import style from "./ConfirmActionModal.module.css";

// --- components ---
import Loader from "@/components/common/Loader/Loader";

// --- type ---
type ConfirmActionModalProps = {
  actionType: "DELETE_INVOICE" | "UPDATE_INVOICE" | "CREATE_INVOICE";
};

const ConfirmActionModal = ({ actionType }: ConfirmActionModalProps) => {
  const { closeModal } = useModalContext();
  const { updateInvoice, currentInvoice, createInvoice } = useInvoiceContext();
  const [isConformationView, setIsConfirmationView] = useState(true);

  // --- Get confirm button text based on action type ---
  const getConfirmButtonText = () => {
    switch (actionType) {
      case "DELETE_INVOICE":
        return "Delete";
      case "UPDATE_INVOICE":
        return "Update";
      case "CREATE_INVOICE":
        return "Create";
      default:
        return "Confirm";
    }
  };

  // --- Handle confirm action based on action type ---
  const handleConfirm = () => {
    if (!currentInvoice) return;
    setIsConfirmationView(false);
    switch (actionType) {
      case "DELETE_INVOICE":
        break;
      case "UPDATE_INVOICE":
        updateInvoice.execute(currentInvoice);
        break;
      case "CREATE_INVOICE":
        createInvoice.execute(currentInvoice);
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
            Cancel
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
      {(updateInvoice.isLoading || createInvoice.isLoading) && <Loader />}
      {(updateInvoice.isError || createInvoice.isError) && (
        <p className={style["error-message"]}>
          Error: {updateInvoice.messageCode || createInvoice.messageCode}
        </p>
      )}
    </div>
  );
};

export default ConfirmActionModal;
