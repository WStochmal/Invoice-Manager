import type { Invoice } from "@/types/Invoice.type";

export const parseInvoiceFile = (file: File): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        resolve(parsed as Invoice);
      } catch (err) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsText(file);
  });
};
