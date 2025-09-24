package com.app.service;

import com.app.dto.ResponseDto;
import com.app.exception.invoice.InvoiceNotFoundException;
import com.app.model.Invoice;
import com.app.util.InvoiceCalculator;
import com.app.util.InvoiceRequiredFieldsValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class InvoiceService {
        private final List<Invoice> invoices;

        // Dummy data initialization
        public InvoiceService(List<Invoice> invoices) {
            this.invoices = invoices;
        }

        // Fetch all invoices
        public ResponseEntity<ResponseDto<List<Invoice>>> getAllInvoices() {
            ResponseDto<List<Invoice>> responseDto = new ResponseDto<>(true, "INVOICES_RETRIEVED", invoices);
            return ResponseEntity.ok(responseDto);
        }

        // Create a new invoice
        public ResponseEntity<ResponseDto<Invoice>> createInvoice(Invoice invoice) {
            // Validation of required fields
            InvoiceRequiredFieldsValidator.validate(invoice);
            // Calculate prices
            InvoiceCalculator.calculateTotalPrices(invoice);

            try {
                invoices.add(invoice);
            }  catch (Exception e) {
                throw new RuntimeException("Failed to create invoice");
            }

            ResponseDto<Invoice> responseDto = new ResponseDto<>(true, "INVOICE_CREATED", invoice);
            return ResponseEntity.ok(responseDto);
        }
        // Delete invoice by ID
        public ResponseEntity<ResponseDto<Void>> deleteInvoiceById(String id) {

            UUID invoiceId = UUID.fromString(id);

            boolean removedInvoice = invoices.removeIf(invoice -> invoice.getId().equals(invoiceId));

            if (!removedInvoice) {
               throw new InvoiceNotFoundException();
            }

            ResponseDto<Void> responseDto = new ResponseDto<>(true, "INVOICE_DELETED", null);
            return ResponseEntity.ok(responseDto);
        }
    }

