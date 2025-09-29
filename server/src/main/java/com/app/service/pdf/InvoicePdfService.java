package com.app.service.pdf;

import com.app.model.Invoice;
import com.app.model.Item;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.List;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;


public class InvoicePdfService {

    private static final DecimalFormat df = new DecimalFormat("#0.00");

    public static byte[] generateInvoicePdf(Invoice invoice) {


        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {



            // --- A4 Document ---
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            // --- Title ---
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD, Color.BLACK);
            Paragraph title = new Paragraph("Faktura VAT", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            // --- Invoice Number ---
            Font invoiceNumberFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.BLACK);
            Paragraph invoiceNumber = new Paragraph("nr " + invoice.getInvoiceNumber(), invoiceNumberFont);
            invoiceNumber.setAlignment(Element.ALIGN_LEFT);
            document.add(invoiceNumber);
            document.add(new Paragraph(" "));

            // --- IssueDate ---
            Font dateFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
            Paragraph date = new Paragraph("Data wystawienia: " + invoice.getIssueDate(), dateFont);
            date.setAlignment(Element.ALIGN_LEFT);
            document.add(date);
            document.add(new Paragraph(" "));


            // --- Buyer && Seller ---
            PdfPTable partyTable = new PdfPTable(2);
            partyTable.setWidthPercentage(100);
            partyTable.setWidths(new float[]{1, 1});

            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);
            // seller
            PdfPCell sellerCell = new PdfPCell();
            sellerCell.setBorder(Rectangle.LEFT);
            sellerCell.setPaddingLeft(10f);
            sellerCell.addElement(new Paragraph("Sprzedawca", boldFont));
            sellerCell.addElement(new Paragraph("ABCDEF Sp. z o.o.", normalFont));
            sellerCell.addElement(new Paragraph("NIP: 1234567890", normalFont));
            sellerCell.addElement(new Paragraph("Kwiaciana 25A", normalFont));
            sellerCell.addElement(new Paragraph("Warszawa 12-123", normalFont));

            partyTable.addCell(sellerCell);
            // buyer
            PdfPCell buyerCell = new PdfPCell();
            buyerCell.setBorder(Rectangle.LEFT);
            buyerCell.setPaddingLeft(10f);
            buyerCell.addElement(new Paragraph("Nabywca", boldFont));
            buyerCell.addElement(new Paragraph(invoice.getBuyer().getName(), normalFont));
            buyerCell.addElement(new Paragraph("NIP: " + invoice.getBuyer().getNip(), normalFont));
            buyerCell.addElement(new Paragraph(invoice.getBuyer().getStreet(), normalFont));
            buyerCell.addElement(new Paragraph(invoice.getBuyer().getCity() + " " + invoice.getBuyer().getPostalCode(), normalFont));
            partyTable.addCell(buyerCell);

            document.add(partyTable);

            document.add(new Paragraph(" "));

            // --- Table ---
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1,4, 1, 1, 1, 1,1, 2});
            Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font cellFont = new Font(Font.HELVETICA,9, Font.NORMAL);


            // --- Table header ---
            String[] headers = {"Lp.", "Towar lub usługa", "Ilość", "Cena jedn. netto", "Wartość netto",
                    "Stawka VAT", "Wartość VAT", "Wartość brutto"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5); // padding wewnętrzny
                table.addCell(cell);
            }


            // --- Table data ---
            int index = 1;

            for (Item item : invoice.getItems()) {
                PdfPCell cell;

                cell = new PdfPCell(new Phrase(String.valueOf(index), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(item.getDescription(), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(df.format(item.getUnitNetPrice()), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(df.format(item.getNetPrice()), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(String.valueOf(item.getVatRate() * 100) + "%", cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(df.format(item.getVatPrice()), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(df.format(item.getGrossPrice()), cellFont));
                cell.setPadding(4);
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);

                index++;
            }

            // table tfoot
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("Wartość faktury brutto", headerFont));
            totalLabelCell.setColspan(7);
            totalLabelCell.setPadding(4);
            totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(totalLabelCell);
            PdfPCell totalGrossCell = new PdfPCell(new Phrase(String.valueOf(invoice.getTotalGrossPrice()) +" " + invoice.getCurrency(), headerFont));
            totalGrossCell.setPadding(4);
            totalGrossCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(totalGrossCell);


            document.add(table);
            document.add(new Paragraph(" "));


            // --- Summary ---
            PdfPTable summaryTable = new PdfPTable(3);
            summaryTable.setWidthPercentage(50);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{1, 1, 1});

            String[] summaryHeaders = {"Wartość netto", "Wartość VAT", "Wartość brutto"};

            for (String header : summaryHeaders) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                summaryTable.addCell(cell);
            }

            PdfPCell cell1 = new PdfPCell(new Phrase(df.format(invoice.getTotalNetPrice()), cellFont));
            cell1.setPadding(5);
            cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell1);

            PdfPCell cell2 = new PdfPCell(new Phrase(df.format(invoice.getTotalVatPrice()), cellFont));
            cell2.setPadding(5);
            cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell2);

            PdfPCell cell3 = new PdfPCell(new Phrase(df.format(invoice.getTotalGrossPrice()), cellFont));
            cell3.setPadding(5);
            cell3.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell3);

            document.add(summaryTable);


            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }
}


