// --- lib ---
import React, { useRef, useState } from "react";

// --- style ---
import style from "./NewInvoiceModal.module.css";

// --- icons ---
import icon_upload from "@/assets/icons/upload.png";
import icon_form from "@/assets/icons/form.png";

// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- utils ---
import { parseInvoiceFile } from "@/utils/invoiceParseFileUtils";

// --- components ---
import Loader from "@/components/common/Loader/Loader";

const NewInvoiceModal = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isJsonUploadReady, setIsJsonUploadReady] = useState(false);
  const [isFileValid, setIsFileValid] = useState<{
    valid: boolean;
    message?: string;
  }>({ valid: true }); // if file is valid JSON
  const [isDragging, setIsDragging] = useState(false);
  const { createInvoice } = useInvoiceContext();

  const handleCreateInvoice = async (file: File) => {
    try {
      // --- Check file type ---
      if (file.type !== "application/json") {
        setIsFileValid({ valid: false, message: "INVALID_FILE_TYPE" });
        return;
      }
      // --- Parse the json file ---
      const invoice = await parseInvoiceFile(file);
      await createInvoice.execute(invoice);
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
    event.stopPropagation();
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
      ) : createInvoice.isError ? (
        <p className={style["error-message"]}>
          Error: {createInvoice.messageCode}
        </p>
      ) : (
        <>
          {/* --- Upload JSON button --- */}
          <button
            className={`${style["option-button"]} ${
              isJsonUploadReady ? style["active-option"] : ""
            } ${isDragging && isJsonUploadReady ? style["drag-over"] : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              !isJsonUploadReady
                ? setIsJsonUploadReady(true)
                : fileInputRef.current?.click()
            }
          >
            <img src={icon_upload} alt="Upload JSON" />
            {isJsonUploadReady
              ? "Drop JSON file here or click to upload"
              : "Upload JSON file"}
          </button>

          {/* --- Fill Form button --- */}
          {!isJsonUploadReady && (
            <button className={style["option-button"]}>
              <img src={icon_form} alt="Fill Form" />
              <span>Fill Form</span>
            </button>
          )}
        </>
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

export default NewInvoiceModal;
