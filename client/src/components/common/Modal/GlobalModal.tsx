// --- lib ---
import React from "react";

// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./GlobalModal.module.css";

// --- icons ---
import icon_close from "@/assets/icons/close.png";

// --- components ---
import NewInvoiceModal from "./variants/NewInvoice/NewInvoiceModal";
import ConfirmActionModal from "./variants/ConfirmAction/ConfirmActionModal";
import LoadInvoiceModal from "./variants/LoadInvoice/LoadInvoiceModal";

const GlobalModal = () => {
  const { isOpen, closeModal, variant } = useModalContext();
  const { getText } = useTranslation();

  if (!isOpen) return null;

  const mountVariant = () => {
    switch (variant?.type) {
      case "NEW_INVOICE":
        return <NewInvoiceModal />;
      case "CONFIRM_ACTION":
        return (
          <ConfirmActionModal
            actionType={variant.actionType}
            invoiceId={variant?.invoiceId}
          />
        );
      case "LOAD_INVOICE":
        return <LoadInvoiceModal />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (variant?.type) {
      case "NEW_INVOICE":
        return <h2>{getText("ADD_NEW_INVOICE_TITLE")}</h2>;
      case "CONFIRM_ACTION":
        switch (variant.actionType) {
          case "DELETE_INVOICE":
            return <h2>{getText("DELETE_INVOICE_TITLE")}</h2>;
          case "UPDATE_INVOICE":
            return <h2>{getText("UPDATE_INVOICE_TITLE")}</h2>;
          case "CREATE_INVOICE":
            return <h2>{getText("CREATE_INVOICE_TITLE")}</h2>;
          default:
            return <h2>{getText("CONFIRM_ACTION_TITLE")}</h2>;
        }
      case "LOAD_INVOICE":
        return <h2>{getText("LOAD_INVOICE_TITLE")}</h2>;
      default:
        return <h2>{getText("MODAL_TITLE")}</h2>;
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
