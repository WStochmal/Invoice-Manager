package com.app.repository;


import com.app.model.Invoice;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class InvoiceRepository {

    private final List<Invoice> invoices = new ArrayList<>();

    public List<Invoice> getAllInvoices() {
        return invoices;
    }

    public Optional<Invoice> getInvoiceById(String id) {
        UUID invoiceId = UUID.fromString(id);
        return invoices.stream()
                .filter(inv -> inv.getId().equals(invoiceId))
                .findFirst();
    }

    public void addInvoice(Invoice invoice) {
        invoices.add(invoice);
    }
    public boolean deleteInvoiceById(String id) {
        UUID invoiceId = UUID.fromString(id);
        return invoices.removeIf(inv -> inv.getId().equals(invoiceId));
    }
    public boolean existsByInvoiceNumber(String invoiceNumber) {
        return invoices.stream()
                .anyMatch(existingInvoice -> existingInvoice.getInvoiceNumber().equals(invoiceNumber));
    }

    public long countInvoicesForMonth(int month) {
        return invoices.stream()
                .filter(inv -> inv.getIssueDate().getMonthValue() == month)
                .count();
    }
    public Invoice updateInvoice(Invoice updatedInvoice) {
        for (int i = 0; i < invoices.size(); i++) {
            if (invoices.get(i).getId().equals(updatedInvoice.getId())) {
                invoices.set(i, updatedInvoice);
                return updatedInvoice;
            }
        }
        throw new RuntimeException("Invoice not found");
    }

}
