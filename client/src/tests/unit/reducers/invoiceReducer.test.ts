import { InvoiceReducer } from '../../../reducers/invoiceReducer';
import { createNewInvoice } from '../../../utils/invoice/createNewInvoice';
import { createNewItem } from '../../../utils/invoice/createNewItem';
import type { Invoice } from '../../../types/Invoice.type';

describe('InvoiceReducer', () => {
  let mockInvoice: Invoice;

  beforeEach(() => {
    mockInvoice = createNewInvoice();
    mockInvoice.id = 'test-invoice-id';
    mockInvoice.invoiceNumber = 'FV/001/2023';
  });

  describe('SET_INVOICE', () => {
    it('should set the invoice', () => {
      const action = { type: 'SET_INVOICE' as const, payload: mockInvoice };
      const result = InvoiceReducer(null, action);

      expect(result).toEqual(mockInvoice);
      expect(result).toBe(mockInvoice); // Returns the exact payload reference
    });
  });

  describe('UPDATE_INVOICE_FIELD', () => {
    it('should update a simple field', () => {
      const action = {
        type: 'UPDATE_INVOICE_FIELD' as const,
        payload: { field: 'invoiceNumber' as keyof Invoice, value: 'FV/002/2023' }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.invoiceNumber).toBe('FV/002/2023');
      expect(result?.id).toBe(mockInvoice.id); // Other fields unchanged
    });

    it('should handle numeric fields', () => {
      const action = {
        type: 'UPDATE_INVOICE_FIELD' as const,
        payload: { field: 'totalNetPrice' as keyof Invoice, value: 150 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.totalNetPrice).toBe(150);
    });

    it('should return null if state is null', () => {
      const action = {
        type: 'UPDATE_INVOICE_FIELD' as const,
        payload: { field: 'invoiceNumber' as keyof Invoice, value: 'test' }
      };

      const result = InvoiceReducer(null, action);

      expect(result).toBeNull();
    });
  });

  describe('UPDATE_INVOICE_BUYER_FIELD', () => {
    it('should update buyer fields', () => {
      const action = {
        type: 'UPDATE_INVOICE_BUYER_FIELD' as const,
        payload: { field: 'name' as keyof Invoice['buyer'], value: 'New Buyer Name' }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.buyer.name).toBe('New Buyer Name');
      expect(result?.buyer.NIP).toBe(mockInvoice.buyer.NIP); // Other buyer fields unchanged
      expect(result?.id).toBe(mockInvoice.id); // Other invoice fields unchanged
    });

    it('should update buyer NIP', () => {
      const action = {
        type: 'UPDATE_INVOICE_BUYER_FIELD' as const,
        payload: { field: 'NIP' as keyof Invoice['buyer'], value: '9876543210' }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.buyer.NIP).toBe('9876543210');
    });
  });

  describe('UPDATE_INVOICE_ITEM_FIELD', () => {
    beforeEach(() => {
      // Add items to mock invoice
      mockInvoice.items = [
        { ...createNewItem(), description: 'Item 1', quantity: 1, unitNetPrice: 100, vatRate: 0.23 },
        { ...createNewItem(), description: 'Item 2', quantity: 2, unitNetPrice: 50, vatRate: 0.08 }
      ];
    });

    it('should update item description without recalculating prices', () => {
      const action = {
        type: 'UPDATE_INVOICE_ITEM_FIELD' as const,
        payload: { index: 0, field: 'description' as keyof typeof mockInvoice.items[0], value: 'Updated Item 1' }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items[0].description).toBe('Updated Item 1');
      expect(result?.items[1].description).toBe('Item 2'); // Other items unchanged
      // Prices should not be recalculated for description changes
      expect(result?.totalNetPrice).toBe(mockInvoice.totalNetPrice);
    });

    it('should update item quantity and recalculate prices', () => {
      const action = {
        type: 'UPDATE_INVOICE_ITEM_FIELD' as const,
        payload: { index: 0, field: 'quantity' as keyof typeof mockInvoice.items[0], value: 3 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items[0].quantity).toBe(3);
      // Should recalculate item prices
      expect(result?.items[0].netPrice).toBe(300); // 3 * 100
      expect(result?.items[0].vatPrice).toBe(69); // 300 * 0.23
      expect(result?.items[0].grossPrice).toBe(369); // 300 + 69
    });

    it('should update unit price and recalculate totals', () => {
      const action = {
        type: 'UPDATE_INVOICE_ITEM_FIELD' as const,
        payload: { index: 1, field: 'unitNetPrice' as keyof typeof mockInvoice.items[0], value: 75 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items[1].unitNetPrice).toBe(75);
      expect(result?.items[1].netPrice).toBe(150); // 2 * 75
    });

    it('should handle invalid item index', () => {
      const action = {
        type: 'UPDATE_INVOICE_ITEM_FIELD' as const,
        payload: { index: 99, field: 'quantity' as keyof typeof mockInvoice.items[0], value: 5 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      // Should not crash and return state unchanged
      expect(result?.items).toHaveLength(2);
      expect(result?.items[0].quantity).toBe(1); // Original values
    });
  });

  describe('UPDATE_INVOICE_NEW_ITEM', () => {
    it('should add new item to invoice', () => {
      const originalItemsLength = mockInvoice.items.length;
      const action = { type: 'UPDATE_INVOICE_NEW_ITEM' as const };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(originalItemsLength + 1);
      const newItem = result?.items[result.items.length - 1];
      expect(newItem?.description).toBe('');
      expect(newItem?.quantity).toBe(1);
      expect(newItem?.unitNetPrice).toBe(0);
    });

    it('should return null if state is null', () => {
      const action = { type: 'UPDATE_INVOICE_NEW_ITEM' as const };

      const result = InvoiceReducer(null, action);

      expect(result).toBeNull();
    });
  });

  describe('UPDATE_INVOICE_REMOVE_ITEM', () => {
    beforeEach(() => {
      // Add items for removal tests
      mockInvoice.items = [
        { ...createNewItem(), description: 'Item 1', netPrice: 100, vatPrice: 23, grossPrice: 123 },
        { ...createNewItem(), description: 'Item 2', netPrice: 200, vatPrice: 46, grossPrice: 246 },
        { ...createNewItem(), description: 'Item 3', netPrice: 50, vatPrice: 4, grossPrice: 54 }
      ];
    });

    it('should remove item at specified index', () => {
      const action = {
        type: 'UPDATE_INVOICE_REMOVE_ITEM' as const,
        payload: { index: 1 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(2);
      expect(result?.items[0].description).toBe('Item 1');
      expect(result?.items[1].description).toBe('Item 3');
      // Should recalculate totals
      expect(result?.totalNetPrice).toBe(150); // 100 + 50
      expect(result?.totalVatPrice).toBe(27); // 23 + 4
      expect(result?.totalGrossPrice).toBe(177); // 123 + 54
    });

    it('should handle removal of first item', () => {
      const action = {
        type: 'UPDATE_INVOICE_REMOVE_ITEM' as const,
        payload: { index: 0 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(2);
      expect(result?.items[0].description).toBe('Item 2');
    });

    it('should handle removal of last item', () => {
      const action = {
        type: 'UPDATE_INVOICE_REMOVE_ITEM' as const,
        payload: { index: 2 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(2);
      expect(result?.items[1].description).toBe('Item 2');
    });

    it('should return unchanged state if index is undefined', () => {
      const action = {
        type: 'UPDATE_INVOICE_REMOVE_ITEM' as const,
        payload: {}
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(3);
      expect(result).toEqual(mockInvoice);
    });

    it('should handle invalid index gracefully', () => {
      const action = {
        type: 'UPDATE_INVOICE_REMOVE_ITEM' as const,
        payload: { index: 99 }
      };

      const result = InvoiceReducer(mockInvoice, action);

      expect(result?.items).toHaveLength(3); // No items removed
    });
  });

  describe('edge cases', () => {
    it('should return state for unknown action types', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unknownAction = { type: 'UNKNOWN_ACTION' as any };

      const result = InvoiceReducer(mockInvoice, unknownAction);

      expect(result).toBe(mockInvoice);
    });

    it('should return null for unknown action when state is null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unknownAction = { type: 'UNKNOWN_ACTION' as any };

      const result = InvoiceReducer(null, unknownAction);

      expect(result).toBeNull();
    });

    it('should handle actions on null state appropriately', () => {
      const nonSetAction = {
        type: 'UPDATE_INVOICE_FIELD' as const,
        payload: { field: 'invoiceNumber' as keyof Invoice, value: 'test' }
      };

      const result = InvoiceReducer(null, nonSetAction);

      expect(result).toBeNull();
    });
  });
});