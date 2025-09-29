package com.app.dto.invoice;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
public class InvoiceSummaryList {
    private UUID id;
    private LocalDate issueDate;
    private String invoiceNumber;
    private String buyerName;
    private double totalNetPrice;
    private boolean favorite;
    private String status;
}
