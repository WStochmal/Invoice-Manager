import { parseInvoiceFile } from '../../../utils/invoiceParseFileUtils';

// Mock FileReader
const mockFileReader = {
  readAsText: jest.fn(),
  result: null as string | null,
  error: null,
  onload: jest.fn(),
  onerror: jest.fn(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).FileReader = jest.fn(() => mockFileReader);

describe('parseInvoiceFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse valid JSON file successfully', async () => {
    const mockInvoice = {
      id: "test-id",
      invoiceNumber: "FV/001/2023",
      issueDate: "2023-10-15",
      buyer: { name: "Test Buyer", NIP: "123456789" },
      items: [],
      totalNetPrice: 100,
    };

    const mockFile = new File([JSON.stringify(mockInvoice)], 'invoice.json', {
      type: 'application/json',
    });

    // Mock successful file reading
    mockFileReader.readAsText.mockImplementation(() => {
      process.nextTick(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: JSON.stringify(mockInvoice) } });
        }
      });
    });

    const result = await parseInvoiceFile(mockFile);
    
    expect(result).toEqual(mockInvoice);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
  });

  it('should reject with error for invalid JSON', async () => {
    const mockFile = new File(['invalid json content'], 'invoice.json', {
      type: 'application/json',
    });

    // Mock file reading with invalid JSON
    mockFileReader.readAsText.mockImplementation(() => {
      process.nextTick(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: 'invalid json content' } });
        }
      });
    });

    await expect(parseInvoiceFile(mockFile)).rejects.toThrow('Invalid JSON file');
  });

  it('should reject with error when file reading fails', async () => {
    const mockFile = new File(['{}'], 'invoice.json', {
      type: 'application/json',
    });

    // Mock file reading error
    mockFileReader.readAsText.mockImplementation(() => {
      process.nextTick(() => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror(new Error('File reading failed'));
        }
      });
    });

    await expect(parseInvoiceFile(mockFile)).rejects.toThrow('File reading failed');
  });

  it('should handle empty file', async () => {
    const mockFile = new File([''], 'invoice.json', {
      type: 'application/json',
    });

    // Mock reading empty file
    mockFileReader.readAsText.mockImplementation(() => {
      process.nextTick(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: '' } });
        }
      });
    });

    await expect(parseInvoiceFile(mockFile)).rejects.toThrow('Invalid JSON file');
  });

  it('should handle file with null result', async () => {
    const mockFile = new File(['null'], 'invoice.json', {
      type: 'application/json',
    });

    // Mock file reading with null string (which parses to null)
    mockFileReader.readAsText.mockImplementation(() => {
      process.nextTick(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: 'null' } });
        }
      });
    });

    const result = await parseInvoiceFile(mockFile);
    expect(result).toBeNull();
  });
});