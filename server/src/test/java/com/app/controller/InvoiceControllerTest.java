package com.app.controller;

import com.app.dto.ResponseDto;
import com.app.model.Buyer;
import com.app.model.Invoice;
import com.app.model.Item;
import com.app.service.InvoiceService;
import com.app.exception.invoice.InvoiceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InvoiceController.class)
class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;

    @Autowired
    private ObjectMapper objectMapper;

    private Invoice testInvoice;
    private ResponseDto<Invoice> successResponse;

    @BeforeEach
    void setUp() {
        testInvoice = createValidInvoice();
        successResponse = new ResponseDto<>(true, "SUCCESS", testInvoice);
    }

    @Test
    @DisplayName("GET /api/invoices should return 200 with invoice list")
    void getAllInvoices_ShouldReturnOkWithInvoiceList() throws Exception {
        // --- Given ---
        List<Invoice> invoices = Arrays.asList(testInvoice);
        ResponseDto<List<Invoice>> response =
                new ResponseDto<>(true, "INVOICES_RETRIEVED", invoices);

        when(invoiceService.getAllInvoices(any()))
                .thenReturn(ResponseEntity.ok(response));

        // --- When & Then ---
        mockMvc.perform(get("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.messageCode").value("INVOICES_RETRIEVED"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    @Test
    @DisplayName("POST /api/invoices/create with valid data should return 201")
    void createInvoice_WithValidData_ShouldReturnCreated() throws Exception {
        // --- Given ---
        ResponseDto<Invoice> createResponse =
                new ResponseDto<>(true, "INVOICE_CREATED", testInvoice);

        when(invoiceService.createInvoice(any()))
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(createResponse));

        // --- When & Then ---
        mockMvc.perform(post("/api/invoices/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testInvoice)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.messageCode").value("INVOICE_CREATED"))
                .andExpect(jsonPath("$.data.invoiceNumber").value(testInvoice.getInvoiceNumber()));
    }

    @Test
    @DisplayName("POST /api/invoices/create with empty invoice number should return 400")
    void createInvoice_WithEmptyInvoiceNumber_ShouldReturnBadRequest() throws Exception {
        // --- Given ---
        Invoice invalidInvoice = createValidInvoice();
        invalidInvoice.setInvoiceNumber(""); // empty invoice number

        // --- When & Then ---
        mockMvc.perform(post("/api/invoices/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidInvoice)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.messageCode").value(containsString("VALIDATION_ERROR")));
    }

    @Test
    @DisplayName("GET /api/invoices/{id} with valid ID should return invoice")
    void getInvoiceById_WithValidId_ShouldReturnInvoice() throws Exception {
        // --- Given ---
        String invoiceId = UUID.randomUUID().toString();
        when(invoiceService.getInvoiceById(invoiceId))
                .thenReturn(ResponseEntity.ok(successResponse));

        // --- When & Then ---
        mockMvc.perform(get("/api/invoices/{id}", invoiceId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.invoiceNumber").value(testInvoice.getInvoiceNumber()));
    }

    @Test
    @DisplayName("GET /api/invoices/{id} with invalid ID should return 404")
    void getInvoiceById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // --- Given ---
        String invalidId = "invalid-id";
        when(invoiceService.getInvoiceById(invalidId))
                .thenThrow(new InvoiceNotFoundException());

        // --- When & Then ---
        mockMvc.perform(get("/api/invoices/{id}", invalidId))
                .andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "   "})
    @DisplayName("POST /api/invoices/create with blank invoice numbers should return validation error")
    void createInvoice_WithBlankInvoiceNumbers_ShouldReturnValidationError(String blankNumber) throws Exception {
        // --- Given ---
        Invoice invoice = createValidInvoice();
        invoice.setInvoiceNumber(blankNumber);

        //
        mockMvc.perform(post("/api/invoices/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invoice)))
                .andExpect(status().isBadRequest());
    }
    
    // === HELPER METHODS ===
    
    private Invoice createValidInvoice() {
        Invoice invoice = new Invoice();
        invoice.setId(UUID.randomUUID());
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.of(2025, 1, 10));
        invoice.setDueDate(LocalDate.of(2025, 1, 25));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(Arrays.asList(createValidItem()));
        invoice.setStatus("UNPAID");
        invoice.setFavorite(false);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setTotalNetPrice(1000.0);
        invoice.setTotalVatPrice(230.0);
        invoice.setTotalGrossPrice(1230.0);
        return invoice;
    }
    
    private Buyer createValidBuyer() {
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("1234567890");
        buyer.setStreet("Testowa 123");
        buyer.setCity("Warszawa");
        buyer.setPostalCode("12-345");
        return buyer;
    }
    
    private Item createValidItem() {
        Item item = new Item();
        item.setDescription("Licencja oprogramowania");
        item.setQuantity(2);
        item.setUnitNetPrice(500.0);
        item.setVatRate(0.23);
        return item;
    }
}