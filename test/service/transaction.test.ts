import {TransactionServiceFake} from "./transaction.fake";
import {DefaultTransactionSummaryReport, TransactionDailySummary} from "../../src/service/transaction";

test('Check number of total records', async () => {
    let transactionPage = await new TransactionServiceFake().findAll(1);
    expect(transactionPage.totalCount).toBe(38);
});

test('Check current page number', async () => {
    let transactionPage = await new TransactionServiceFake().findAll(2);
    expect(transactionPage.page).toBe(2);
});

test('Check current page data', async () => {
    let transactionPage = await new TransactionServiceFake().findAll(3);
    expect(transactionPage.transactions.length).toBe(10);
});

test('Should throw an error, Page not found.', async () => {
    try {
        await new TransactionServiceFake().findAll(10);
    } catch (e) {
        expect(true).toBe(e instanceof TypeError);
    }
});

test('Should calculate sum of transactions simultaneously.', async () => {
    const expectedSummaries = new Map<string, number>();
    expectedSummaries.set("2013-12-12", -227.35);
    expectedSummaries.set("2013-12-13", -1229.58);
    expectedSummaries.set("2013-12-15", -5.39);
    expectedSummaries.set("2013-12-16", -4575.53);
    expectedSummaries.set("2013-12-17", 10686.27);
    expectedSummaries.set("2013-12-18", -1841.29);
    expectedSummaries.set("2013-12-19", 19753.30);
    expectedSummaries.set("2013-12-20", -4054.60);
    expectedSummaries.set("2013-12-21", -17.98);
    expectedSummaries.set("2013-12-22", -110.71);
    let actualSummaries = await new DefaultTransactionSummaryReport(new TransactionServiceFake()).aggregate();
    actualSummaries.forEach((item: TransactionDailySummary) => {
        const value = expectedSummaries.get(item.date);
        expect(value).toBeCloseTo(item.amount, 0);
    });
});


test("Should print summary result in mocked console with expected format", async () => {
    console.log = jest.fn();
    await new DefaultTransactionSummaryReport(new TransactionServiceFake()).print();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('2013-12-12 -227.35'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('2013-12-22 -110.71'));
});