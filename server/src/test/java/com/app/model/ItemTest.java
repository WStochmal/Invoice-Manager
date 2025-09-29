package com.app.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ItemTest {

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
        Item item = new Item();
        item.setDescription("Licencja oprogramowania");
        item.setQuantity(2);
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.23);
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        // --- Then ---
        assertTrue(violations.isEmpty(), "Corrent item should pass validation");
    }

    @Test
    @DisplayName("Should fail validation when item description is null")
    void shouldFailValidation_WhenDescriptionIsNull() {
        // --- Given ---
        Item item = new Item();
        item.setDescription(null); // null description
        item.setQuantity(2);
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.23);
        //  --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasDescriptionError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("description"));

        assertTrue(hasDescriptionError, "Should be an error for description field");

        String errorMessage = violations.stream()
                .filter(violation -> violation.getPropertyPath().toString().equals("description"))
                .findFirst()
                .map(ConstraintViolation::getMessage)
                .orElse("");

        assertEquals("INVOICE_ITEM_DESCRIPTION_NULL", errorMessage);
    }

    @Test
    @DisplayName("Should fail validation when quantity is less than 1")
    void shouldFailValidation_WhenQuantityIsLessThanOne() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Service");
        item.setQuantity(0); // quantity < 1
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.23);
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);

        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasQuantityError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("quantity")
                        && violation.getMessage().equals("INVOICE_ITEM_QUANTITY_MIN"));

        assertTrue(hasQuantityError, "Should be an error for quantity < 1");
    }

    @Test
    @DisplayName("Should fail validation when quantity is null")
    void shouldFailValidation_WhenQuantityIsNull() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Serivce");
        item.setQuantity(null); // null quantity
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.23);
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);

        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasQuantityError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("quantity")
                        && violation.getMessage().equals("INVOICE_ITEM_QUANTITY_NULL"));

        assertTrue(hasQuantityError, "Should be an error for null quantity");
    }

    @Test
    @DisplayName("Should fail validation when vatRate is too high (above 1.0)")
    void shouldFailValidation_WhenVatRateIsTooHigh() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Service");
        item.setQuantity(1);
        item.setUnitNetPrice(500.0);
        item.setVatRate(1.5); // VAT > 100%
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasVatRateError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("vatRate")
                        && violation.getMessage().equals("VAT_RATE_TOO_HIGH"));

        assertTrue(hasVatRateError, "Should be an error for vatRate > 1.0");
    }

    @Test
    @DisplayName("Should fail validation when vatRate < 0.0")
    void shouldFailValidation_WhenVatRateIsTooLow() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Service");
        item.setQuantity(1);
        item.setUnitNetPrice(500.0);
        item.setVatRate(-0.1); // VAT < 0.0
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasVatRateError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("vatRate")
                        && violation.getMessage().equals("VAT_RATE_TOO_LOW"));

        assertTrue(hasVatRateError, "Should be an error for vatRate < 0.0");
    }

    @Test
    @DisplayName("Should pass validation when vatRate is exactly 0.0")
    void shouldPassValidation_WhenVatRateIsZero() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Service");
        item.setQuantity(1);
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.0); // 0% VAT
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        // --- Then ---
        boolean hasVatRateError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("vatRate"));

        assertFalse(hasVatRateError, "There should be no error for vatRate = 0.0");
    }

    @Test
    @DisplayName("Should pass validation when vatRate is exactly 1.0")
    void shouldPassValidation_WhenVatRateIsOne() {
        // --- Given ---
        Item item = new Item();
        item.setDescription("Service");
        item.setQuantity(1);
        item.setUnitNetPrice(500.0);
        item.setVatRate(1.0); // 100% VAT
        // --- When ---
        Set<ConstraintViolation<Item>> violations = validator.validate(item);

        // --- Then ---
        boolean hasVatRateError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("vatRate"));

        assertFalse(hasVatRateError, "There should be no error for vatRate = 1.0");
    }
}