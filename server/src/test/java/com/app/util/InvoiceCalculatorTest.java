package com.app.util;

import com.app.model.Invoice;
import com.app.model.Item;
import com.app.model.Buyer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class InvoiceCalculatorTest {

    @Test
    @DisplayName("Should calculate  for single item with 23% VAT")
    void shouldCalculateCorrect_ForSingleItemWithStandardVAT() {
        // --- Given ---
        Invoice invoice = createInvoice();
        Item item = createItem("Licencja", 2, 500.0, 0.23); // item
        invoice.setItems(Arrays.asList(item));
        // --- When ---
        InvoiceCalculator.calculateTotalPrices(invoice);
        // --- Then ---
        // Item totals
        assertEquals(1000.0, item.getNetPrice(), 0.01, "Item net price should be 1000");
        assertEquals(230.0, item.getVatPrice(), 0.01, "Item VAT price should be 230");
        assertEquals(1230.0, item.getGrossPrice(), 0.01, "Item gross price should be 1230");
        // Invoice totals
        assertEquals(1000.0, invoice.getTotalNetPrice(), 0.01, "Total net price should be 1000");
        assertEquals(230.0, invoice.getTotalVatPrice(), 0.01, "Total VAT price should be 230");
        assertEquals(1230.0, invoice.getTotalGrossPrice(), 0.01, "Total gross price should be 1230");
    }

    @Test
    @DisplayName("Should calculate correct totals for multiple items")
    void shouldCalculateCorrectTotals_ForMultipleItems() {
        // --- Given ---
        Invoice invoice = createInvoice();
        Item item1 = createItem("Licencja", 2, 500.0, 0.23); // item 1
        Item item2 = createItem("Usługa", 1, 1500.0, 0.23);  // item 2
        invoice.setItems(Arrays.asList(item1, item2));
        // --- When ---
        InvoiceCalculator.calculateTotalPrices(invoice);
        // --- Then ---
        // Item 1 totals
        assertEquals(1000.0, item1.getNetPrice(), 0.01);
        assertEquals(230.0, item1.getVatPrice(), 0.01);
        assertEquals(1230.0, item1.getGrossPrice(), 0.01);
        // Item 2 totals
        assertEquals(1500.0, item2.getNetPrice(), 0.01);
        assertEquals(345.0, item2.getVatPrice(), 0.01);
        assertEquals(1845.0, item2.getGrossPrice(), 0.01);
        // Invoice totals
        assertEquals(2500.0, invoice.getTotalNetPrice(), 0.01, "Total net:  2500");
        assertEquals(575.0, invoice.getTotalVatPrice(), 0.01, "Total VAT: 575");
        assertEquals(3075.0, invoice.getTotalGrossPrice(), 0.01, "Total gross: 3075");
    }

    @Test
    @DisplayName("Should handle mixed VAT rates correctly")
    void shouldCalculateCorrectTotals_ForMixedVATRates() {
        // --- Given ---
        Invoice invoice = createInvoice();
        Item item1 = createItem("Usługa standard", 1, 1000.0, 0.23); // item 1
        Item item2 = createItem("Książka", 2, 50.0, 0.08);           // item 2
        Item item3 = createItem("Usługa zwolniona", 1, 500.0, 0.0);  // item 3
        invoice.setItems(Arrays.asList(item1, item2, item3));
        // --- When
        InvoiceCalculator.calculateTotalPrices(invoice);
        // --- Then ---
        assertEquals(1600.0, invoice.getTotalNetPrice(), 0.01, "Total net: 1600");
        assertEquals(238.0, invoice.getTotalVatPrice(), 0.01, "Total VAT: 238");
        assertEquals(1838.0, invoice.getTotalGrossPrice(), 0.01, "Total gross: 1838");
    }

    @Test
    @DisplayName("Should handle empty items list")
    void shouldCalculateZeroTotals_ForEmptyItemsList() {
        // --- Given ---
        Invoice invoice = createInvoice();
        invoice.setItems(new ArrayList<>()); // pusta lista
        // -- When ---
        InvoiceCalculator.calculateTotalPrices(invoice);
        // -- Then ---
        assertEquals(0.0, invoice.getTotalNetPrice(), 0.01, "Total net should be 0 for empty list");
        assertEquals(0.0, invoice.getTotalVatPrice(), 0.01, "Total VAT should be 0 for empty list");
        assertEquals(0.0, invoice.getTotalGrossPrice(), 0.01, "Total gross should be 0 for empty list");
    }

    @Test
    @DisplayName("Should handle fractional prices")
    void shouldCalculateCorrectTotals_ForFractionalValues() {
        // --- Given ---
        Invoice invoice = createInvoice();
        Item item = createItem("Usluga", 2, 123.45, 0.23);
        invoice.setItems(Arrays.asList(item));
        // -- When ---
        InvoiceCalculator.calculateTotalPrices(invoice);
        // -- Then ---
        assertEquals(246.90, item.getNetPrice(), 0.01, "Net: 246.90");
        assertEquals(56.787, item.getVatPrice(), 0.001, "VAT: 56.787");
        assertEquals(303.687, item.getGrossPrice(), 0.001, "Gross : 303.687");
    }

    // === HELPER METHODS ===

    // --- Creates a basic invoice ---
    private Invoice createInvoice() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("TEST/001");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createBuyer());
        return invoice;
    }

    // --- Creates an item  ---
    private Item createItem(String description, int quantity, double unitNetPrice, double vatRate) {
        Item item = new Item();
        item.setDescription(description);
        item.setQuantity(quantity);
        item.setUnitNetPrice(unitNetPrice);
        item.setVatRate(vatRate);
        return item;
    }

    // --- Creates a buyer ---
    private Buyer createBuyer() {
        Buyer buyer = new Buyer();
        buyer.setName("Test Company");
        buyer.setNip("1234567890");
        buyer.setStreet("Test St. 123");
        buyer.setCity("Warsaw");
        buyer.setPostalCode("12-345");
        return buyer;
    }
}