package com.app.model;
import com.app.util.Required;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    private UUID id = UUID.randomUUID();
    @NotBlank
    @Required
    private String invoiceNumber;
    @NotNull
    @Required
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;
    @NotNull
    @Required
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
    @NotNull
    @Required
    private Buyer buyer;
    @NotNull
    @Required
    @Size(min = 1)
    private List<Product> items;
    private String status;
    private boolean favorite;

    private double totalNetPrice;
    private double totalGrossPrice;
    private double totalVatPrice;

    private String currency = "PLN"; // Default currency is PLN
    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp of creation in system
    private String additionalNotes;
}