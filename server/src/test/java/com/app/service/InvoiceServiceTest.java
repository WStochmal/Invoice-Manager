package com.app.service;

import com.app.dto.ResponseDto;
import com.app.dto.invoice.CreateInvoiceDto;
import com.app.dto.invoice.InvoiceFilterDto;
import com.app.exception.invoice.InvoiceCreationException;
import com.app.exception.invoice.InvoiceNotFoundException;
import com.app.model.Buyer;
import com.app.model.Invoice;
import com.app.model.Item;
import com.app.repository.InvoiceRepository;
import com.app.service.filter.InvoiceFilterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private InvoiceFilterService invoiceFilterService;

    @InjectMocks
    private InvoiceService invoiceService;

    private Invoice testInvoice;
    private CreateInvoiceDto createInvoiceDto;

    @BeforeEach
    void setUp() {
        testInvoice = createValidInvoice();
        createInvoiceDto = createValidCreateInvoiceDto();
    }

    @Test
    @DisplayName("getAllInvoices should return filtered invoices")
    void getAllInvoices_ShouldReturnFilteredInvoices() {
        // --- Given ---
        List<Invoice> mockInvoices = Arrays.asList(testInvoice);
        InvoiceFilterDto filters = new InvoiceFilterDto();
        when(invoiceRepository.getAllInvoices()).thenReturn(mockInvoices);
        when(invoiceFilterService.applyFilters(mockInvoices, filters)).thenReturn(mockInvoices);
        // --- When ---
        ResponseEntity<ResponseDto<List<Invoice>>> response = invoiceService.getAllInvoices(filters);
        // --- Then ---
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("INVOICES_RETRIEVED", response.getBody().getMessageCode());
        assertEquals(1, response.getBody().getData().size());

        verify(invoiceRepository).getAllInvoices();
        verify(invoiceFilterService).applyFilters(mockInvoices, filters);
    }

    @Test
    @DisplayName("getInvoiceById should return invoice when exists")
    void getInvoiceById_WhenExists_ShouldReturnInvoice() {
        // --- Given ---
        String invoiceId = "test-id";
        when(invoiceRepository.getInvoiceById(invoiceId)).thenReturn(Optional.of(testInvoice));
        // -- When ---
        ResponseEntity<ResponseDto<Invoice>> response = invoiceService.getInvoiceById(invoiceId);
        // --- Then ---
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("INVOICE_RETRIEVED", response.getBody().getMessageCode());
        assertEquals(testInvoice, response.getBody().getData());
        verify(invoiceRepository).getInvoiceById(invoiceId);
    }

    @Test
    @DisplayName("getInvoiceById should throw exception when not exists")
    void getInvoiceById_WhenNotExists_ShouldThrowException() {
        // --- Given ---
        String invoiceId = "non-existent";
        when(invoiceRepository.getInvoiceById(invoiceId)).thenReturn(Optional.empty());
        // --- When & Then ---
        assertThrows(InvoiceNotFoundException.class, () -> {
            invoiceService.getInvoiceById(invoiceId);
        });

        verify(invoiceRepository).getInvoiceById(invoiceId);
    }
    @Test
    @DisplayName("createInvoice should create invoice with auto-generated number")
    void createInvoice_WithAutoNumber_ShouldCreateInvoice() {
        // --- Given ---
        createInvoiceDto.setInvoiceNumber("FV/(auto)");
        when(invoiceRepository.getAllInvoices()).thenReturn(new ArrayList<>());
        when(invoiceRepository.existsByInvoiceNumber(anyString())).thenReturn(false);
        // --- When ---
        ResponseEntity<ResponseDto<Invoice>> response = invoiceService.createInvoice(createInvoiceDto);
        // --- Then ---
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("INVOICE_CREATED", response.getBody().getMessageCode());
        assertNotNull(response.getBody().getData());
        assertNotEquals("FV/(auto)", response.getBody().getData().getInvoiceNumber());
        verify(invoiceRepository).addInvoice(any(Invoice.class));
    }

    @Test
    @DisplayName("createInvoice should throw exception when invoice number exists")
    void createInvoice_WhenInvoiceNumberExists_ShouldThrowException() {
        // --- Given ---
        when(invoiceRepository.existsByInvoiceNumber(createInvoiceDto.getInvoiceNumber())).thenReturn(true);
        // --- When & Then ---
        assertThrows(InvoiceCreationException.class, () -> {
            invoiceService.createInvoice(createInvoiceDto);
        });
        verify(invoiceRepository).existsByInvoiceNumber(createInvoiceDto.getInvoiceNumber());
        verify(invoiceRepository, never()).addInvoice(any(Invoice.class));
    }

    @Test
    @DisplayName("deleteInvoiceById should delete existing invoice")
    void deleteInvoiceById_WhenExists_ShouldDeleteInvoice() {
        // --- Given ---
        String invoiceId = "test-id";
        when(invoiceRepository.deleteInvoiceById(invoiceId)).thenReturn(true);
        // -- When ---
        ResponseEntity<ResponseDto<Void>> response = invoiceService.deleteInvoiceById(invoiceId);
        // --- Then ---
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("INVOICE_DELETED", response.getBody().getMessageCode());
        verify(invoiceRepository).deleteInvoiceById(invoiceId);
    }

    @Test
    @DisplayName("deleteInvoiceById should throw exception when not exists")
    void deleteInvoiceById_WhenNotExists_ShouldThrowException() {
        // --- Given ---
        String invoiceId = "non-existent";
        when(invoiceRepository.deleteInvoiceById(invoiceId)).thenReturn(false);
        // -- When & Then ---
        assertThrows(InvoiceNotFoundException.class, () -> {
            invoiceService.deleteInvoiceById(invoiceId);
        });
        verify(invoiceRepository).deleteInvoiceById(invoiceId);
    }


    // Helper methods
    private Invoice createValidInvoice() {
        Invoice invoice = new Invoice();
        invoice.setId(UUID.randomUUID());
        invoice.setInvoiceNumber("FV/2025/01/01");
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));
        invoice.setBuyer(createValidBuyer());
        invoice.setItems(createValidItems());
        invoice.setStatus("UNPAID");
        return invoice;
    }

    private CreateInvoiceDto createValidCreateInvoiceDto() {
        CreateInvoiceDto dto = new CreateInvoiceDto();
        dto.setInvoiceNumber("FV/2025/01/01");
        dto.setIssueDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().plusDays(30));
        dto.setBuyer(createValidBuyer());
        dto.setItems(createValidItems());
        dto.setStatus("UNPAID");
        return dto;
    }

    private Buyer createValidBuyer() {
        Buyer buyer = new Buyer();
        buyer.setName("ABC Sp. z o.o.");
        buyer.setNip("1234567890");
        buyer.setStreet("Test Street 123");
        buyer.setCity("Warsaw");
        buyer.setPostalCode("00-001");
        return buyer;
    }

    private List<Item> createValidItems() {
        Item item1 = new Item();
        item1.setDescription("Licencja oprogramowania");
        item1.setQuantity(2);
        item1.setUnitNetPrice(500.0);
        item1.setVatRate(0.23);

        Item item2 = new Item();
        item2.setDescription("Usługa wdrożeniowa");
        item2.setQuantity(1);
        item2.setUnitNetPrice(1500.0);
        item2.setVatRate(0.23);

        return Arrays.asList(item1, item2);
    }
}