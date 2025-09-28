package com.app.service;

import com.app.dto.ResponseDto;
import com.app.dto.invoice.CreateInvoiceDto;
import com.app.dto.invoice.InvoiceFilterDto;
import com.app.dto.invoice.UpdateInvoiceDto;
import com.app.exception.invoice.InvoiceCreationException;
import com.app.exception.invoice.InvoiceNotFoundException;
import com.app.model.Invoice;
import com.app.repository.InvoiceRepository;
import com.app.service.filter.InvoiceFilter;
import com.app.util.InvoiceCalculator;
import com.app.util.InvoiceNumberGenerator;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class InvoiceService {

    // --- Invoice Repository (List implementation) ---
    private final InvoiceRepository invoiceRepository;
    private final InvoiceFilter invoiceFilter;

    public InvoiceService(InvoiceRepository invoiceRepository, InvoiceFilter invoiceFilter) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceFilter = invoiceFilter;
    }

    // --- Fetch invoices ---
    public ResponseEntity<ResponseDto<List<Invoice>>> getAllInvoices(InvoiceFilterDto filters) {
        // 1. Fetch all invoices from repository
        List<Invoice> invoices = invoiceRepository.getAllInvoices();

        // 2. Apply filters if provided
        List<Invoice> filteredInvoices = invoiceFilter.applyFilters(invoices, filters);

        // 3. Return response
        ResponseDto<List<Invoice>> responseDto =
                new ResponseDto<>(true, "INVOICES_RETRIEVED", filteredInvoices);
        return ResponseEntity.ok(responseDto);
    }

    // --- Fetch invoice by ID ---
    public ResponseEntity<ResponseDto<Invoice>> getInvoiceById(String id) {
        // 1. Fetch invoice from repository
        Invoice invoice = invoiceRepository.getInvoiceById(id)
                .orElseThrow(InvoiceNotFoundException::new);

        ResponseDto<Invoice> responseDto = new ResponseDto<>(true, "INVOICE_RETRIEVED", invoice);
        return ResponseEntity.ok(responseDto);
    }

    // --- Create a new invoice ---
    public ResponseEntity<ResponseDto<Invoice>> createInvoice(CreateInvoiceDto dto) {

        Invoice newInvoice = new Invoice();
        BeanUtils.copyProperties(dto, newInvoice);

        // 1. Handle invoice number (auto or manual from json file)
        if (newInvoice.getInvoiceNumber().equals("FV/(auto)")) {
            newInvoice.setInvoiceNumber(
                    InvoiceNumberGenerator.generateInvoiceNumber(invoiceRepository.getAllInvoices(), invoiceRepository)
            );
        } else if (invoiceRepository.existsByInvoiceNumber(newInvoice.getInvoiceNumber())) {
            throw new InvoiceCreationException("INVOICE_NUMBER_ALREADY_EXISTS");
        }

        // 2. Calculate prices
        InvoiceCalculator.calculateTotalPrices(newInvoice);

        // 3. Generate unique ID and creation timestamp
        newInvoice.setId(UUID.randomUUID());
        newInvoice.setCreatedAt(java.time.LocalDateTime.now());

        // 4. Add to repository (List)
        invoiceRepository.addInvoice(newInvoice);

        // 5. Return response
        ResponseDto<Invoice> responseDto = new ResponseDto<>(true, "INVOICE_CREATED", newInvoice);
        return ResponseEntity.ok(responseDto);
    }

    // Delete invoice by ID
    public ResponseEntity<ResponseDto<Void>> deleteInvoiceById(String id) {
        // 1. Attempt to delete the invoice
        boolean removedInvoice = invoiceRepository.deleteInvoiceById(id);

        // 2. If invoice not found, throw exception
        if (!removedInvoice) throw new InvoiceNotFoundException();

        // 3. Return response
        ResponseDto<Void> responseDto = new ResponseDto<>(true, "INVOICE_DELETED", null);
        return ResponseEntity.ok(responseDto);
    }

    // --- Update existing invoice by ID ---
    public ResponseEntity<ResponseDto<Invoice>> updateInvoice(String id, UpdateInvoiceDto dto) {
        // 1. Check if invoice exists
        Invoice existingInvoice = invoiceRepository.getInvoiceById(id)
                .orElseThrow(InvoiceNotFoundException::new);

        BeanUtils.copyProperties(dto, existingInvoice);

        // 2. Calculate prices
        InvoiceCalculator.calculateTotalPrices(existingInvoice);

        // 3. Save to repository
        Invoice updatedInvoice = invoiceRepository.updateInvoice(existingInvoice);

        // 4. Return response
        ResponseDto<Invoice> responseDto = new ResponseDto<>(true, "INVOICE_UPDATED", updatedInvoice);
        return ResponseEntity.ok(responseDto);
    }

    // --- Toggle invoice favorite status by ID ---
    public ResponseEntity<ResponseDto<Invoice>> toggleFavorite(String id) {
        // 1. Check if invoice exists
        Invoice invoice = invoiceRepository.getInvoiceById(id)
                .orElseThrow(InvoiceNotFoundException::new);

        // 2. Toggle favorite status
        invoice.setFavorite(!invoice.isFavorite());

        // 3. Return response
        ResponseDto<Invoice> responseDto = new ResponseDto<>(
                true,
                "INVOICE_FAVORITE_TOGGLED",
                invoice
        );
        return ResponseEntity.ok(responseDto);
    }
}

