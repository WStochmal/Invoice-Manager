// --- lib ---
import React, { useRef, useState } from "react";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./LoadInvoiceModal.module.css";

// --- icons ---
import icon_upload from "@/assets/icons/upload.png";

// --- utils ---
import { parseInvoiceFile } from "@/utils/invoiceParseFileUtils";

// --- components ---
import Loader from "@/components/common/Loader/Loader";
import { createNewInvoice } from "@/utils/invoice/createNewInvoice";
import type { Invoice } from "@/types/Invoice.type";
import {
  calculateInvoiceTotals,
  calculateItemPrices,
} from "@/utils/invoiceLocalCalculator";
import { createNewItem } from "@/utils/invoice/createNewItem";

const LoadInvoiceModal: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createInvoice, updateCurrentInvoiceForm } = useInvoiceContext();
  const { closeModal } = useModalContext();
  const { getText } = useTranslation();

  const [isFileValid, setIsFileValid] = useState<{
    valid: boolean;
    message?: string;
  }>({ valid: true });
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateInvoice = async (file: File) => {
    try {
      if (file.type !== "application/json") {
        setIsFileValid({ valid: false, message: "INVALID_FILE_TYPE" });
        return;
      }

      let invoice = await parseInvoiceFile(file);

      // --- Uzupełnij brakujące pola ---
      invoice = {
        ...createNewInvoice(), // domyślne wartości
        ...invoice, // nadpisz tym, co jest w JSON
        buyer: { ...createNewInvoice().buyer, ...invoice.buyer },
        items:
          invoice.items?.map((item) =>
            calculateItemPrices({
              ...createNewItem(),
              ...item,
            })
          ) ?? [],
      };

      const totals = calculateInvoiceTotals(invoice.items);
      invoice = { ...invoice, ...totals };

      // --- Zaktualizuj currentInvoice w reducerze ---
      updateCurrentInvoiceForm("NEW_INVOICE", invoice);

      closeModal();
    } catch (err) {
      setIsFileValid({ valid: false, message: "INVALID_JSON_STRUCTURE" });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleCreateInvoice(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleCreateInvoice(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={style["modal-body-content"]}>
      {!isFileValid.valid && (
        <p className={style["error-message"]}>Error: {isFileValid.message}</p>
      )}

      {createInvoice.isLoading ? (
        <Loader />
      ) : (
        <button
          className={`${style["option-button"]} ${
            isDragging ? style["drag-over"] : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={icon_upload} alt="Upload JSON" />
          {getText("DROP_JSON_FILE_HERE")}
        </button>
      )}

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default LoadInvoiceModal;
