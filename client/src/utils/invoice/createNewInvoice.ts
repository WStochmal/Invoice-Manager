// --- types ---
import type { Invoice } from "@/types/Invoice.type";

export const createNewInvoice = (): Invoice => ({
  id: "",
  invoiceNumber: "FV/(auto)",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  buyer: {
    name: "",
    NIP: "",
    street: "",
    city: "",
    postalCode: "",
  },
  items: [],
  status: "UNPAID",
  favorite: false,
  totalNetPrice: 0,
  totalGrossPrice: 0,
  totalVatPrice: 0,
  currency: "PLN",
  additionalNotes: "",
  createdAt: new Date().toISOString(),
});
