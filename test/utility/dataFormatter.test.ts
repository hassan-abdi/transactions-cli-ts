import {DataFormatter} from "../../src/utilities/dataFormatter";

test("Should convert number to expected format", async () => {
    let actualFormat = DataFormatter.formatMoney(123.23444, 2);
    expect(actualFormat).toBe("123.23");
});

test("Should convert negative number to expected format", async () => {
    let actualFormat = DataFormatter.formatMoney(-3555622.2388444, 2);
    expect(actualFormat).toBe("-3555622.23");
});