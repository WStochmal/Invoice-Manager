package com.app.model;


import com.app.util.Required;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Product {
    @NotNull
    @Required
    private String description;
    @NotNull
    @Required
    private int quantity;
    @NotNull
    @Required
    private double netPrice;
    @NotNull
    @Required
    private double vatRate = 0.23; // Default VAT rate of 23%
    private double grossPrice;
    private double vatPrice;
}
