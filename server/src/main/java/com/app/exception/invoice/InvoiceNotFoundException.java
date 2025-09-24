package com.app.exception.invoice;

public class InvoiceNotFoundException extends RuntimeException {
    public InvoiceNotFoundException() {
        super("INVOICE_NOT_FOUND");
    }
}
