package com.app.exception.invoice;

import java.util.Map;

public class InvoiceCreationException extends RuntimeException {
    private final Map<String, String> fieldErrors;

    public InvoiceCreationException(Map<String, String> fieldErrors) {
        super("INVOICE_VALIDATION_FAILED");
        this.fieldErrors = fieldErrors;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
