package com.app.service.filter;

import com.app.dto.invoice.InvoiceFilterDto;
import com.app.model.Invoice;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class InvoiceFilterService {

    // ### Filter invoices based on criteria (InvoiceFilterDto) ###
    public List<Invoice> applyFilters(List<Invoice> invoices, InvoiceFilterDto filters) {


        System.out.println("Applying filters: " + filters.toString());

        //  search (InvoiceNumber,buyer.name)
        if (filters.getSearch() != null && filters.getSearch().length() >= 3) {
            String searchLower = filters.getSearch().toLowerCase();
            invoices = invoices.stream()
                    .filter(inv -> inv.getInvoiceNumber().toLowerCase().contains(searchLower)
                            || (inv.getBuyer() != null
                            && inv.getBuyer().getName().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }

        //  issueDate
        if (filters.getIssueDate() != null && !filters.getIssueDate().isEmpty()) {
            LocalDate issueDateFrom = LocalDate.parse(filters.getIssueDate());
            invoices = invoices.stream()
                    .filter(inv -> !inv.getIssueDate().isBefore(issueDateFrom))
                    .collect(Collectors.toList());
        }

        //  dueDate
        if (filters.getDueDate() != null && !filters.getDueDate().isEmpty()) {
            LocalDate dueDateTo = LocalDate.parse(filters.getDueDate());
            invoices = invoices.stream()
                    .filter(inv -> !inv.getDueDate().isAfter(dueDateTo))
                    .collect(Collectors.toList());
        }

        //  status
        if (filters.getStatus() != null && !filters.getStatus().isEmpty()) {
            invoices = invoices.stream()
                    .filter(inv -> inv.getStatus().equalsIgnoreCase(filters.getStatus()))
                    .collect(Collectors.toList());
        }
        return invoices;
    }
}