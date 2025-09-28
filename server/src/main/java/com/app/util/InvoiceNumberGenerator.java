package com.app.util;

import com.app.model.Invoice;
import com.app.repository.InvoiceRepository;

import java.util.List;

public class InvoiceNumberGenerator {
    private InvoiceNumberGenerator(){}

    public static String generateInvoiceNumber(List<Invoice> invoices, InvoiceRepository invoiceRepository) {
        int monthNumber = java.time.LocalDate.now().getMonthValue();
        long countPerMonth;
        String newInvoiceNumber;

        while(true)
        {
            countPerMonth = invoiceRepository.countInvoicesForMonth(monthNumber);
            newInvoiceNumber = String.format("FV/%02d/%03d", monthNumber, countPerMonth + 1);
            boolean invoiceNumberExists = invoiceRepository.existsByInvoiceNumber(newInvoiceNumber);

            if(!invoiceNumberExists) {
                break;
            }

            countPerMonth++;
        }
        return  newInvoiceNumber;
    }
}
