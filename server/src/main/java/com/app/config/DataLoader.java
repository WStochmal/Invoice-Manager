package com.app.config;


import com.app.model.Invoice;
import com.app.repository.InvoiceRepository;
import com.app.util.InvoiceCalculator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Configuration
public class DataLoader {

    private final InvoiceRepository invoiceRepository;
    public DataLoader(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    @PostConstruct
    public void loadInvoices(){
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            // 1. Load JSON file from resources
            InputStream inputStream = getClass().getResourceAsStream("/invoices.json");
            if (inputStream == null) {
                throw new IllegalArgumentException("File not found: /invoices.json");
            }
            // 2. Parse JSON to List<Invoice>
            List<Invoice> invoices = mapper.readValue(inputStream, new TypeReference<List<Invoice>>() {});

            // 3. Add to repository
            for (Invoice invoice : invoices) {
                invoice.setId(UUID.randomUUID());
                InvoiceCalculator.calculateTotalPrices(invoice);
                invoiceRepository.addInvoice(invoice);
            }

        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
