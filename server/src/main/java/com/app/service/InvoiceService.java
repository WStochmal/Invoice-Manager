package com.app.service;

import com.app.dto.ResponseDto;
import com.app.exception.invoice.InvoiceCreationException;
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
        // Fetch invoice by ID
    public ResponseEntity<ResponseDto<Invoice>> getInvoiceById(String id) {
            UUID invoiceId = UUID.fromString(id);
            Invoice invoice = invoices.stream()
                    .filter(inv -> inv.getId().equals(invoiceId))
                    .findFirst()
                    .orElseThrow(InvoiceNotFoundException::new);

            ResponseDto<Invoice> responseDto = new ResponseDto<>(true, "INVOICE_RETRIEVED", invoice);
            return ResponseEntity.ok(responseDto);
        }

        // Create a new invoice
        public ResponseEntity<ResponseDto<Invoice>> createInvoice(Invoice invoice) {
            // 1. Validation of required fields
            InvoiceRequiredFieldsValidator.validate(invoice);

            // 2. Unique Invoice Number check
            boolean invoiceNumberExists = invoices.stream()
                    .anyMatch(existingInvoice -> existingInvoice.getInvoiceNumber().equals(invoice.getInvoiceNumber()));
            if (invoiceNumberExists) throw new InvoiceCreationException("INVOICE_NUMBER_ALREADY_EXISTS");

            // 3. Calculate prices
            InvoiceCalculator.calculateTotalPrices(invoice);

            // 4. Add to the list
            try {
                invoices.add(invoice);
            }  catch (Exception e) {
                throw new RuntimeException("Failed to create invoice");
            }

            // 5. Return response
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

