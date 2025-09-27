// lib
import React, { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// hooks
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useModalContext } from "@/hooks/useModalContext";
// style
import style from "./InvoiceFrom.module.css";

// components
import ItemsSection from "./components/ItemsSection/ItemsSection";
import BuyerSection from "./components/BuyerSection/BuyerSection";
import InvoiceFormHeader from "./components/InvoiceFormHeader/InvoiceFormHeader";
import CollapseWrapper from "@/components/common/CollapseWrapper/CollapseWrapper";
import SummarySection from "./components/SummarySection/SummarySection";

// type

const InvoiceForm = () => {
  const { id } = useParams();
  const [isExistingInvoice, setIsExistingInvoice] = useState(false); // is invoice existing (edit mode) or new (create mode)
  const [isEditFormMode, setIsEditFormMode] = useState(false); // is form in editing mode (turn inputs on/off)
  const { fetchInvoiceById, currentInvoice, updateCurrentInvoiceForm } =
    useInvoiceContext();
  const { openModal } = useModalContext();
  // --- Fetch invoice if id present ---
  useEffect(() => {
    if (id) {
      setIsExistingInvoice(true);
      fetchInvoiceById.execute(id);
    } else {
      setIsExistingInvoice(false);
      setIsEditFormMode(true);
      updateCurrentInvoiceForm("NEW_INVOICE");
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInvoice?.items.length === 0) {
      alert("Invoice must have at least one item");
      return;
    }
    if (!isExistingInvoice) {
      openModal({ type: "CONFIRM_ACTION", actionType: "CREATE_INVOICE" });
      return;
    }
    openModal({ type: "CONFIRM_ACTION", actionType: "UPDATE_INVOICE" });
  };

  if (!currentInvoice) return null;
  return (
    <form className={style["invoice-form-container"]} onSubmit={handleSubmit}>
      {/* --- Header Section --- */}
      <InvoiceFormHeader
        existingInvoice={isExistingInvoice}
        toggleEditFormMode={setIsEditFormMode}
        formEditMode={isEditFormMode}
      />

      {/* --- Buyer && Date Section --- */}
      <CollapseWrapper title="Buyer and Date Information">
        <BuyerSection />
      </CollapseWrapper>

      {/* --- Items Section --- */}
      <CollapseWrapper title="Items">
        <ItemsSection />
      </CollapseWrapper>

      {/* --- Summary Section --- */}
      <CollapseWrapper title="Summary">
        <SummarySection />
      </CollapseWrapper>
    </form>
  );
};

export default InvoiceForm;
