import type { Buyer } from "./Buyer.type";
import type { Product } from "./Product.type";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  buyer: Buyer;
  products: Product[];
  status: "PAID" | "UNPAID" | "PENDING";
  favorite: boolean;
  totalNetPrice: number;
  totalGrossPrice: number;
  totalVatPrice: number;
  additionalNotes?: string;
  createdAt: string;
};
