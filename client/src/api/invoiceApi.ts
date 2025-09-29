import type { ApiResponse } from "@/types/ApiResponse.type";
import type { Invoice } from "../types/Invoice.type";
import axiosClient from "./axiosClient";

const BASE_PATH = "/invoices";

export const InvoiceApi = {
  getInvoices: async (filters?: {
    search?: string;
    issueDate?: string;
    dueDate?: string;
    status?: string;
  }): Promise<ApiResponse<Invoice[]>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.issueDate) params.append("issueDate", filters.issueDate);
    if (filters?.dueDate) params.append("dueDate", filters.dueDate);
    if (filters?.status) params.append("status", filters.status);

    const response = await axiosClient.get<ApiResponse<Invoice[]>>(
      `${BASE_PATH}?${params.toString()}`
    );
    return response.data;
  },
  getInvoiceById: async (id: string): Promise<ApiResponse<Invoice>> => {
    const response = await axiosClient.get<ApiResponse<Invoice>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },
  addInvoice: async (invoice: Invoice): Promise<ApiResponse<Invoice>> => {
    const response = await axiosClient.post<ApiResponse<Invoice>>(
      `${BASE_PATH}/create`,
      invoice
    );
    return response.data;
  },
  deleteInvoice: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `${BASE_PATH}/delete/${id}`
    );
    return response.data;
  },
  updateInvoice: async (invoice: Invoice): Promise<ApiResponse<Invoice>> => {
    const response = await axiosClient.put<ApiResponse<Invoice>>(
      `${BASE_PATH}/update/${invoice.id}`,
      invoice
    );
    return response.data;
  },
  toggleFavorite: async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    const response = await axiosClient.patch<ApiResponse<Invoice>>(
      `${BASE_PATH}/${invoiceId}/toggle-favorite`
    );
    return response.data;
  },
  downloadInvoicePDF: async (invoiceId: string): Promise<Blob> => {
    const response = await axiosClient.get(
      `${BASE_PATH}/${invoiceId}/download`,
      {
        responseType: "arraybuffer",
      }
    );
    return response.data;
  },
};
