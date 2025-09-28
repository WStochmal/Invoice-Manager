package com.app.dto.invoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceFilterDto {
    private String search;
    private String issueDate;
    private String dueDate;
    private String status;
}
