package com.app.controller;


import com.app.dto.ResponseDto;
import com.app.dto.invoice.CreateInvoiceDto;
import com.app.dto.invoice.InvoiceFilterDto;
import com.app.dto.invoice.InvoiceSummaryList;
import com.app.dto.invoice.UpdateInvoiceDto;
import com.app.model.Invoice;
import com.app.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // --- Get invoices (with filter) ---
    @GetMapping
    public ResponseEntity<ResponseDto<List<InvoiceSummaryList>>> getAllInvoices(InvoiceFilterDto filters) {
        return invoiceService.getAllInvoices(filters);
    }

    // --- Get invoice by id ---
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Invoice>> getInvoiceById(@PathVariable String id) {
        return invoiceService.getInvoiceById(id);
    }
    // --- Delete invoice by id ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDto<Void>> deleteInvoiceById(@PathVariable String id) {
        return invoiceService.deleteInvoiceById(id);
    }
    // --- Create new invoice ---
    @PostMapping("/create")
    public ResponseEntity<ResponseDto<Invoice>> createInvoice(@RequestBody @Valid CreateInvoiceDto dto) {
        return invoiceService.createInvoice(dto);
    }

    // --- Update existing invoice by id---
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseDto<Invoice>> updateInvoice(@PathVariable String id, @RequestBody @Valid UpdateInvoiceDto dto) {
        return invoiceService.updateInvoice(id, dto);
    }

    // --- Patch invoice favorite status by id ---
    @PatchMapping("/{id}/toggle-favorite")
    public ResponseEntity<ResponseDto<Invoice>> toggleFavorite(@PathVariable String id) {
        return invoiceService.toggleFavorite(id);
    }

    // --- Download invoice pdf by id ---
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable String id) {
        return invoiceService.downloadInvoicePdf(id);
    }


}
