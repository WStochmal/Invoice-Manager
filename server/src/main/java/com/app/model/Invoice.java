package com.app.model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Data
public class Invoice {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotBlank(message = "INVOICE_NUMBER_BLANK")
    private String invoiceNumber;

    @NotNull(message = "INVOICE_ISSUE_DATE_NULL")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;

    @NotNull(message = "INVOICE_DUE_DATE_NULL")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @NotNull(message = "INVOICE_BUYER_NULL")
    @Valid
    private Buyer buyer;

    @NotNull
    @Size(min = 1, message = "INVOICE_ITEMS_EMPTY")
    @Valid
    private List<Item> items;

    private String status;
    private boolean favorite;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double totalNetPrice;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double totalGrossPrice;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double totalVatPrice;

    private String currency = "PLN"; // Default currency
    private LocalDateTime createdAt;
    private String additionalNotes;
}