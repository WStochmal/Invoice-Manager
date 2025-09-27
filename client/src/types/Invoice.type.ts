import type { Buyer } from "./Buyer.type";
import type { Items } from "./Items";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  buyer: Buyer;
  items: Items[];
  status: "PAID" | "UNPAID" | "PENDING";
  favorite: boolean;
  totalNetPrice: number;
  totalGrossPrice: number;
  totalVatPrice: number;
  currency?: string;
  additionalNotes?: string;
  createdAt: string;
};
