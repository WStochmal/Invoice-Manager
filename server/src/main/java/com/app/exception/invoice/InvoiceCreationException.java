package com.app.exception.invoice;

import java.util.Map;

public class InvoiceCreationException extends RuntimeException {
    private  Map<String, String> fieldErrors;

    public InvoiceCreationException(Map<String, String> fieldErrors) {
        super("INVOICE_VALIDATION_FAILED");
        this.fieldErrors = fieldErrors;
    }

    public InvoiceCreationException(String messageCode) {
        super(messageCode);

    }



    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
