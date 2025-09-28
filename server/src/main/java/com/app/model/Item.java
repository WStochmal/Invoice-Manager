package com.app.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class Item {

    @NotNull(message = "INVOICE_ITEM_DESCRIPTION_NULL")
    private String description;

    @NotNull(message = "INVOICE_ITEM_QUANTITY_NULL")
    @Min(value = 1, message = "INVOICE_ITEM_QUANTITY_MIN")
    private Integer quantity;

    @NotNull(message = "INVOICE_ITEM_UNIT_NET_PRICE_NULL")
    private Double unitNetPrice;

    @NotNull(message = "INVOICE_ITEM_VAT_RATE_NULL")
    @DecimalMin(value = "0.0", inclusive = true, message = "VAT_RATE_TOO_LOW")
    @DecimalMax(value = "1.0", inclusive = true, message = "VAT_RATE_TOO_HIGH")
    private Double vatRate;

    // Calculated fields with READ_ONLY access
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double netPrice; // total net amount

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double grossPrice; // total gross amount

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double vatPrice; // total VAT amount
}
