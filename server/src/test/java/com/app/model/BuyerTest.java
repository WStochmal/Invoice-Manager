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

class BuyerTest {

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
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("1234567890");
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        // --- When ---
        Set<ConstraintViolation<Buyer>> violations = validator.validate(buyer);
        // --- Then ---
        assertTrue(violations.isEmpty(), "Should pass validation when all fields are valid");
    }

    @Test
    @DisplayName("Should fail validation when name is null")
    void shouldFailValidation_WhenNameIsNull() {
        // -- Given ---
        Buyer buyer = new Buyer();
        buyer.setName(null); // null name
        buyer.setNip("1234567890");
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        //--- When ---
        Set<ConstraintViolation<Buyer>> violations = validator.validate(buyer);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasNameError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("name")
                        && violation.getMessage().equals("INVOICE_BUYER_NAME_NULL"));

        assertTrue(hasNameError, "Should be an error for name field");
    }

    @Test
    @DisplayName("Should fail validation when NIP < 10 characters")
    void shouldFailValidation_WhenNipIsTooShort() {
        // --- Given ---
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("123456789"); // NIP < 10 characters
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        // --- When ---
        Set<ConstraintViolation<Buyer>> violations = validator.validate(buyer);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasNipError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("nip")
                        && violation.getMessage().equals("INVOICE_NIP_LENGTH_INVALID"));

        assertTrue(hasNipError, "Should be an error for too short NIP");
    }

    @Test
    @DisplayName("Should fail validation when NIP > 10 characters")
    void shouldFailValidation_WhenNipIsTooLong() {
        // --- Given ---
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("12345678901"); // NIP > 10 characters
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        // --- When ---
        Set<ConstraintViolation<Buyer>> violations = validator.validate(buyer);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Powinien być błąd walidacji");

        boolean hasNipError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("nip")
                        && violation.getMessage().equals("INVOICE_NIP_LENGTH_INVALID"));

        assertTrue(hasNipError, "Should be an error for too long NIP");
    }

    @Test
    @DisplayName("Should fail validation when postalCode has invalid format")
    void shouldFailValidation_WhenPostalCodeIsInvalid() {
        // --- Given ---
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("1234567890");
        buyer.setStreet("Kwiecista 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12345"); // wrong format, should be XX-XXX
        // --- When ---
        Set<ConstraintViolation<Buyer>> violations = validator.validate(buyer);
        // --- Then ---
        assertFalse(violations.isEmpty(), "Should be a validation error");

        boolean hasPostalCodeError = violations.stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("postalCode")
                        && violation.getMessage().equals("INVOICE_POSTAL_CODE_INVALID"));

        assertTrue(hasPostalCodeError, "Should be an error for invalid postal code format");
    }
}