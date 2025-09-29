import { createNewItem } from "../../../../utils/invoice/createNewItem";

describe("createNewItem", () => {
  it("should create a new item with default values", () => {
    const newItem = createNewItem();

    expect(newItem).toEqual({
      description: "",
      quantity: 1,
      unitNetPrice: 0.0,
      netPrice: 0.0,
      vatRate: 0.0,
      vatPrice: 0.0,
      grossPrice: 0.0,
    });
  });

  it("should return different instances each time", () => {
    const item1 = createNewItem();
    const item2 = createNewItem();

    expect(item1).not.toBe(item2);
    expect(item1).toEqual(item2);
  });

  it("should have correct types", () => {
    const newItem = createNewItem();

    expect(typeof newItem.description).toBe("string");
    expect(typeof newItem.quantity).toBe("number");
    expect(typeof newItem.unitNetPrice).toBe("number");
    expect(typeof newItem.netPrice).toBe("number");
    expect(typeof newItem.vatRate).toBe("number");
    expect(typeof newItem.vatPrice).toBe("number");
    expect(typeof newItem.grossPrice).toBe("number");
  });
});
