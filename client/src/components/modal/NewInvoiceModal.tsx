// lib
import React, { useRef, useState } from "react";

// api
import { InvoiceApi } from "@/api/invoiceApi";

// style
import style from "./NewInvoiceModal.module.css";

// icon
import icon_upload from "@/assets/icons/upload.png";
import icon_close from "@/assets/icons/close.png";
import icon_form from "@/assets/icons/form.png";

// type
type NewInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isJsonUploadReady, setIsJsonUploadReady] = useState(false);

  const handleCloseModal = () => {
    setIsJsonUploadReady(false);
    onClose();
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonInvoice = JSON.parse(e.target?.result as string);
        console.log("Parsed JSON:", jsonInvoice);
        await InvoiceApi.addInvoice(jsonInvoice);
        onClose();
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };
  if (!isOpen) return null;
  return (
    <div className={style["modal-overlay"]}>
      <div className={style["modal-window"]}>
        <div className={style["modal-header"]}>
          <h2>New Invoice</h2>
          <button className={style["close-button"]} onClick={handleCloseModal}>
            <img src={icon_close} alt="Close" className="inverted-color" />
          </button>
        </div>
        <div className={style["modal-body"]}>
          <button
            className={`${style["option-button"]} ${
              isJsonUploadReady ? style["active-option"] : ""
            }`}
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
          {!isJsonUploadReady && (
            <button className={style["option-button"]}>
              <img src={icon_form} alt="Fill Form" />
              <span>Fill Form</span>
            </button>
          )}
          {/* <div className={style["upload-section"]}>
              <img
                src={icon_upload}
                alt="Upload"
                className={style["upload-icon"]}
              />
              <p>Upload JSON file to create a new invoice</p>
            </div>
            <input type="file" accept=".json" onChange={handleFileUpload} /> */}

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceModal;
