package com.app.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class InvoiceTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should pass validation when all fields are valid")
    void shouldPassValidation_WhenAllFieldsAreValid() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertTrue(violations.isEmpty(), "Should pass validation when all fields are valid");
    }

    @Test
    @DisplayName("Should fail validation when invoiceNumber is blank")
    void shouldFailValidation_WhenInvoiceNumberIsBlank() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(""); // empty numer
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Powinien być błąd walidacji");

        boolean hasInvoiceNumberError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("invoiceNumber")
                    && violation.getMessage().equals("INVOICE_NUMBER_BLANK"));

        assertTrue(hasInvoiceNumberError, "Should be an error for blank invoice number");
    }

    @Test
    @DisplayName("Should fail validation when invoiceNumber is null")
    void shouldFailValidation_WhenInvoiceNumberIsNull() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(null); // null number
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Powinien być błąd walidacji");

        boolean hasInvoiceNumberError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("invoiceNumber")
                    && violation.getMessage().equals("INVOICE_NUMBER_BLANK"));

        assertTrue(hasInvoiceNumberError, "Should be an error for null invoice number");
    }

    @Test
    @DisplayName("Should fail validation when issueDate is null")
    void shouldFailValidation_WhenIssueDateIsNull() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(null); // null issue date
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasIssueDateError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("issueDate")
                    && violation.getMessage().equals("INVOICE_ISSUE_DATE_NULL"));

        assertTrue(hasIssueDateError, "Should be an error for null issue date");
    }

    @Test
    @DisplayName("Should fail validation when dueDate is null")
    void shouldFailValidation_WhenDueDateIsNull() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(null); // null due date
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasDueDateError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("dueDate")
                    && violation.getMessage().equals("INVOICE_DUE_DATE_NULL"));

        assertTrue(hasDueDateError, "Should be an error for null due date");
    }

    @Test
    @DisplayName("Should fail validation when buyer is null")
    void shouldFailValidation_WhenBuyerIsNull() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(null); // null buyer
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasBuyerError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("buyer")
                    && violation.getMessage().equals("INVOICE_BUYER_NULL"));

        assertTrue(hasBuyerError, "SHould be an error for null buyer");
    }

    @Test
    @DisplayName("Should fail validation when items list is empty")
    void shouldFailValidation_WhenItemsListIsEmpty() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(new ArrayList<>()); // empty items list
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Sould be a validation error");

        boolean hasItemsError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("items")
                    && violation.getMessage().equals("INVOICE_ITEMS_EMPTY"));

        assertTrue(hasItemsError, "Should be an error for empty items list");
    }

    @Test
    @DisplayName("Should cascade validation to buyer fields")
    void shouldCascadeValidation_ToBuyerFields() {
        //  --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        Buyer invalidBuyer = new Buyer();
        invalidBuyer.setName(null); // null buyer name
        invalidBuyer.setNip("1234567890");
        invalidBuyer.setStreet("Kwiecista 123");
        invalidBuyer.setCity("Warszawa");
        invalidBuyer.setPostalCode("12-345");
        invoice.setBuyer(invalidBuyer);
        invoice.setItems(createValidItems());
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        // Check if validation cascaded to buyer fields
        boolean hasBuyerNameError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("buyer.name")
                    && violation.getMessage().equals("INVOICE_BUYER_NAME_NULL"));

        assertTrue(hasBuyerNameError, "Should have cascade validation to buyer fields");
    }

    @Test
    @DisplayName("Should cascade validation to items fields")
    void shouldCascadeValidation_ToItemsFields() {
        // --- Given ---
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        List<Item> invalidItems = new ArrayList<>();
        Item invalidItem = new Item();
        invalidItem.setDescription(null); // null item description
        invalidItem.setQuantity(1);
        invalidItem.setUnitNetPrice(500.0);
        invalidItem.setVatRate(0.23);
        invalidItems.add(invalidItem);
        invoice.setItems(invalidItems);
        // --- When ---
        Set<ConstraintViolation<Invoice>> violations = validator.validate(invoice);
        // -- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        // Check if validation cascaded to items fields
        boolean hasItemDescriptionError = violations.stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("items[0].description")
                    && violation.getMessage().equals("INVOICE_ITEM_DESCRIPTION_NULL"));

        assertTrue(hasItemDescriptionError, "Should have cascade validation to items fields");
    }

    // #### Helper methods ####
    // --- Creates a valid Buyer instance ---
    private Buyer createValidBuyer() {
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("1234567890");
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        return buyer;
    }

    // --- Creates a list with one valid Item instance ---
    private List<Item> createValidItems() {
        List<Item> items = new ArrayList<>();
        Item item = new Item();
        item.setDescription("Licencja oprogramowania");
        item.setQuantity(2);
        item.setUnitNetPrice(1000.0);
        item.setVatRate(0.23);
        items.add(item);
        return items;
    }
}
