package com.app.controller;


import com.app.dto.ResponseDto;
import com.app.model.Invoice;
import com.app.service.InvoiceService;
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

    @GetMapping
    public ResponseEntity<ResponseDto<List<Invoice>>> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDto<Void>> deleteInvoiceById(@PathVariable String id) {
        return invoiceService.deleteInvoiceById(id);
    }
    @PostMapping("/add")
    public ResponseEntity<ResponseDto<Invoice>> createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

}
