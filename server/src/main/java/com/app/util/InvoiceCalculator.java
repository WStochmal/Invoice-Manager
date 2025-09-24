package com.app.util;

import com.app.model.Invoice;

public class InvoiceCalculator {
    private InvoiceCalculator(){}

    public static void calculateTotalPrices (Invoice invoice)
    {
        double totalNetPrice = 0.0;
        double totalGrossPrice = 0.0;
        double totalVatPrice = 0.0;

            for (var item : invoice.getItems()) {
                double itemNetAmount = item.getNetPrice() * item.getQuantity();
                double itemVatAmount = itemNetAmount * item.getVatRate();
                double itemGrossAmount = itemNetAmount + itemVatAmount;

                // Set gross and vat price for each product
                item.setGrossPrice(itemGrossAmount);
                item.setVatPrice(itemVatAmount);

                // Sum up totals
                totalNetPrice += itemNetAmount;
                totalVatPrice += itemVatAmount;
                totalGrossPrice += itemGrossAmount;


            }

        invoice.setTotalNetPrice(totalNetPrice);
        invoice.setTotalVatPrice(totalVatPrice);
        invoice.setTotalGrossPrice(totalGrossPrice);
    }

}
