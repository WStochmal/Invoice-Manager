// --- lib ---
import { useRef, useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- style ---
import style from "./InvoiceFormHeader.module.css";

// --- icon ---
import icon_upload from "@/assets/icons/upload.png";
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";

// type
type InvoiceFormHeaderProps = {
  existingInvoice: boolean;
  toggleEditFormMode: React.Dispatch<React.SetStateAction<boolean>>;
  formEditMode?: boolean;
};

const InvoiceFormHeader = ({
  existingInvoice,
  toggleEditFormMode,
  formEditMode,
}: InvoiceFormHeaderProps) => {
  const { currentInvoice, updateInvoice } = useInvoiceContext();
  const { openModal } = useModalContext();
  const { getText } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={style["invoice-form-header"]}>
      <div className={style["header-top-section"]}>
        <p>&lt; {getText("INVOICES_LIST_HEADER")}</p>

        <div
          className={style["json-to-form-input"]}
          title={getText("LOAD_JSON_FILE")}
          role="button"
          tabIndex={0}
          onClick={() => openModal({ type: "LOAD_INVOICE" })}
        >
          <span>Load .json file</span>
          <img src={icon_upload} alt="Upload JSON" />
        </div>
      </div>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
        }}
      />
      <div className={style["header-bottom-section"]}>
        <h2>{getText("INVOICE_TITLE")}</h2>
        <h3>{currentInvoice?.invoiceNumber}</h3>
        <button className={style["save-button"]} type="submit">
          {existingInvoice
            ? getText("SAVE_CHANGES")
            : getText("CREATE_INVOICE")}
        </button>
      </div>
    </div>
  );
};

export default InvoiceFormHeader;
