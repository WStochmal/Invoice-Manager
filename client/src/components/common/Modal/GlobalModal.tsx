// --- lib ---
import React from "react";
// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";

// --- style ---
import style from "./GlobalModal.module.css";

// --- icons ---
import icon_close from "@/assets/icons/close.png";

// --- components ---
import NewInvoiceModal from "./variants/NewInvoice/NewInvoiceModal";
import ConfirmActionModal from "./variants/ConfirmAction/ConfirmActionModal";

const GlobalModal = () => {
  const { isOpen, closeModal, variant } = useModalContext();

  if (!isOpen) return null;

  const mountVariant = () => {
    switch (variant?.type) {
      case "NEW_INVOICE":
        return <NewInvoiceModal />;
      case "CONFIRM_ACTION":
        return <ConfirmActionModal actionType={variant.actionType} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (variant?.type) {
      case "NEW_INVOICE":
        return <h2>New Invoice</h2>;
      case "CONFIRM_ACTION":
        switch (variant.actionType) {
          case "DELETE_INVOICE":
            return <h2>Delete Invoice</h2>;
          case "UPDATE_INVOICE":
            return <h2>Update Invoice</h2>;
          case "CREATE_INVOICE":
            return <h2>Create Invoice</h2>;
          default:
            return <h2>Confirm Action</h2>;
        }
      default:
        return <h2>Modal</h2>;
    }
  };

  return (
    <div className={style["modal-overlay"]}>
      <div className={style["modal-window"]}>
        {/* --- MODAL HEADER ---*/}
        <div className={style["modal-header"]}>
          {getModalTitle()}
          <button className={style["close-button"]} onClick={closeModal}>
            <img src={icon_close} alt="Close" className="inverted-color" />
          </button>
        </div>
        {/* --- MODAL BODY ---*/}
        <div className={style["modal-body"]}>{mountVariant()}</div>
      </div>
    </div>
  );
};

export default GlobalModal;
