import { useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./ConfirmActionModal.module.css";

// --- components ---
import Loader from "@/components/common/Loader/Loader";
import CollapseWrapper from "@/components/common/CollapseWrapper/CollapseWrapper";

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
  const [isConfirmationView, setIsConfirmationView] = useState(true);
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

  // --- Get current API call based on action type ---
  const getApiCall = () => {
    switch (actionType) {
      case "DELETE_INVOICE":
        return deleteInvoice;
      case "UPDATE_INVOICE":
        return updateInvoice;
      case "CREATE_INVOICE":
        return createInvoice;
      default:
        return null;
    }
  };

  const apiCall = getApiCall();

  // --- Handle confirm action based on action type ---
  const handleConfirm = () => {
    if (!apiCall) return;

    setIsConfirmationView(false);

    switch (actionType) {
      case "DELETE_INVOICE":
        if (!invoiceId) return;
        apiCall.execute(invoiceId, invoiceId);
        break;
      case "UPDATE_INVOICE":
        if (!currentInvoice) return;
        apiCall.execute(currentInvoice);
        break;
      case "CREATE_INVOICE":
        if (!currentInvoice) return;
        apiCall.execute(currentInvoice, "FORM_EDITOR");
        break;
      default:
        break;
    }
  };

  return (
    <div className={style["modal-body-content"]}>
      {isConfirmationView && (
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

      {apiCall?.isLoading && <Loader />}

      {!apiCall?.isLoading && apiCall?.messageCode && (
        <CollapseWrapper
          title={getText(apiCall.messageCode)}
          defaultCollapsed={false}
          type={apiCall.isError ? "error" : "success"}
        >
          {apiCall.isError &&
            apiCall.errorData &&
            Object.keys(apiCall.errorData).length > 0 && (
              <ul>
                {Object.entries(apiCall.errorData).map(
                  ([field, message], idx) => (
                    <li key={idx}>
                      <strong>{field}:</strong> {getText(message)}
                    </li>
                  )
                )}
              </ul>
            )}
        </CollapseWrapper>
      )}
    </div>
  );
};

export default ConfirmActionModal;
