// --- lib ---
import { useRef, useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- style ---
import style from "./InvoiceFormHeader.module.css";

// --- icon ---
import icon_upload from "@/assets/icons/upload.png";
import { useModalContext } from "@/hooks/useModalContext";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={style["invoice-form-header"]}>
      <div className={style["header-top-section"]}>
        <p>&lt; Przejdz do listy faktur</p>
        <div
          className={style["edit-toggle"]}
          onClick={() => toggleEditFormMode((prev) => !prev)}
        >
          {formEditMode ? "View mode" : "Edit mode"}
        </div>
        <div
          className={style["json-to-form-input"]}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            console.log(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
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
        <h2>Invoice</h2>
        <h3>{currentInvoice?.invoiceNumber}</h3>
        <button className={style["save-button"]} type="submit">
          {existingInvoice ? "Save changes" : "Create Invoice"}
        </button>
      </div>
    </div>
  );
};

export default InvoiceFormHeader;
