import type { ApiResponse } from "@/types/ApiResponse.type";
import type { Invoice } from "../types/Invoice.type";
import axiosClient from "./axiosClient";

const BASE_PATH = "/invoices";

export const InvoiceApi = {
  getAllInvoices: async (): Promise<ApiResponse<Invoice[]>> => {
    const response = await axiosClient.get<ApiResponse<Invoice[]>>(BASE_PATH);
    console.log(response.data);
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
      `${BASE_PATH}/add`,
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
};
