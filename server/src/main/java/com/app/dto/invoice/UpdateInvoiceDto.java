package com.app.dto.invoice;

import com.app.model.Buyer;
import com.app.model.Item;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class UpdateInvoiceDto {
    private LocalDate issueDate;
    private LocalDate dueDate;
    @Valid
    private Buyer buyer;
    @Valid
    private List<Item> items;
    private String status;
    private Boolean favorite;
    private String additionalNotes;
}