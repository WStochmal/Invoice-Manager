import { createNewInvoice } from "../../../../utils/invoice/createNewInvoice";

describe("createNewInvoice", () => {
  beforeAll(() => {
    // Mock Date
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-10-15T10:30:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should create a new invoice with default values", () => {
    const newInvoice = createNewInvoice();

    expect(newInvoice).toMatchObject({
      id: "",
      invoiceNumber: "FV/(auto)",
      issueDate: "2023-10-15",
      dueDate: "",
      buyer: {
        name: "",
        NIP: "",
        street: "",
        city: "",
        postalCode: "",
      },
      items: [],
      status: "UNPAID",
      favorite: false,
      totalNetPrice: 0,
      totalGrossPrice: 0,
      totalVatPrice: 0,
      currency: "PLN",
      additionalNotes: "",
    });

    expect(newInvoice.createdAt).toBe("2023-10-15T10:30:00.000Z");
  });

  it("should return different instances each time", () => {
    const invoice1 = createNewInvoice();
    const invoice2 = createNewInvoice();

    expect(invoice1).not.toBe(invoice2);
    expect(invoice1).toEqual(invoice2);
  });

  it("should have correct buyer structure", () => {
    const newInvoice = createNewInvoice();

    expect(newInvoice.buyer).toHaveProperty("name");
    expect(newInvoice.buyer).toHaveProperty("NIP");
    expect(newInvoice.buyer).toHaveProperty("street");
    expect(newInvoice.buyer).toHaveProperty("city");
    expect(newInvoice.buyer).toHaveProperty("postalCode");

    expect(typeof newInvoice.buyer.name).toBe("string");
    expect(typeof newInvoice.buyer.NIP).toBe("string");
  });

  it("should initialize with empty items array", () => {
    const newInvoice = createNewInvoice();

    expect(Array.isArray(newInvoice.items)).toBe(true);
    expect(newInvoice.items).toHaveLength(0);
  });

  it("should set default currency to PLN", () => {
    const newInvoice = createNewInvoice();
    expect(newInvoice.currency).toBe("PLN");
  });

  it("should set default status to UNPAID", () => {
    const newInvoice = createNewInvoice();
    expect(newInvoice.status).toBe("UNPAID");
  });
});
