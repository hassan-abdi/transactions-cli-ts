import axios, {AxiosInstance} from "axios";
import applyCaseMiddleware from 'axios-case-converter';
import {DataFormatter} from "../utilities/dataFormatter";
import {env} from "../utilities/env";

export interface Transaction {
    date: string;
    ledger: string;
    amount: number;
    company: string;
}

export interface TransactionPage {
    totalCount: number;
    page: number;
    transactions: Array<Transaction>;
}

export interface TransactionService {
    findAll(page: number): Promise<TransactionPage>
}
export interface TransactionDailySummary {
    date: string;
    amount: number;
}

export interface TransactionSummaryReport {
    aggregate(): Promise<Array<TransactionDailySummary>>;

    print(): Promise<void>;
}

export class TransactionServiceRestApi implements TransactionService {
    private client: AxiosInstance;

    constructor() {
        this.client = applyCaseMiddleware(axios.create());
    }

    async findAll(page: number): Promise<TransactionPage> {
        function emptyTransactionPage(page: number): TransactionPage {
            return {page: page, totalCount: 0, transactions: []};
        }

        const url = env('SERVICE_URL', 'https://resttest.bench.co').concat(`/transactions/${page}.json`);
        return new Promise<TransactionPage>((resolve, reject) => {
            this.client.get(url)
                .then((response: any) => {
                    resolve(response.data as TransactionPage)
                })
                .catch((error: any) => {
                    if (error.response.status == 404) {
                        resolve(emptyTransactionPage(page));
                        return;
                    }
                    reject(error);
                });
        });
    }
}



export class DefaultTransactionSummaryReport implements TransactionSummaryReport {

    constructor(private service: TransactionService) {
    }

    async print(): Promise<void> {
        try {
            for (const record of await this.aggregate()) {
                console.log(record.date + ' ' +
                    DataFormatter.formatMoney(record.amount, 2));
            }
        } catch (e) {
            console.log("Something went wrong, try later!")
            throw e;
        }
    }

    async aggregate(): Promise<Array<TransactionDailySummary>> {
        let map = await this.aggregateAllTransactionsByDate();
        let records = DefaultTransactionSummaryReport.toSummariesRecord(DefaultTransactionSummaryReport.sort(map));
        return Promise.resolve(records);
    }

    private async aggregateAllTransactionsByDate(): Promise<Map<string, number>> {
        let page = 0;
        let readRecordsCount = 0;
        let totalRecordsCount = 1;
        let pageSize = 1;
        const result = new Map<string, number>();
        do {
            const paginationPromises = this.createPaginationPromises(totalRecordsCount - readRecordsCount, pageSize, page);
            let transactionPages = await Promise.all(paginationPromises);
            page += transactionPages.length;
            transactionPages.forEach((transactionPage: TransactionPage) => {
                pageSize = transactionPage.transactions.length;
                totalRecordsCount = transactionPage.totalCount;
                readRecordsCount += transactionPage.transactions.length;
                this.calculateSumOfAmountsInOnePage(transactionPage, result);
            });
        } while (readRecordsCount < totalRecordsCount)
        return Promise.resolve(result);
    }

    private calculateSumOfAmountsInOnePage(transactionPage: TransactionPage, map: Map<string, number>): void {
        transactionPage.transactions.forEach((item: Transaction) => {
            map.set(item.date, Number(item.amount) + Number(map.get(item.date) ?? 0));
        });
    }

    private createPaginationPromises(unreadRecordsCount: number, pageSize: number, lastPage: number): Array<Promise<TransactionPage>> {
        const concurrentRequestCount = env('CONCURRENT_REQUEST', 5);
        const numberOfPages = unreadRecordsCount / pageSize;
        const numberOfTasks = numberOfPages > concurrentRequestCount ? concurrentRequestCount : numberOfPages;
        const tasks = [];
        for (let i = 0; i < Math.ceil(numberOfTasks); i++) {
            tasks.push(this.buildRequestPromise(lastPage + i + 1));
        }
        return tasks;
    }

    private static sort(summary: Map<string, number>) {
        return new Map([...summary.entries()].sort());
    }

    private static toSummariesRecord(map: Map<string, number>): Array<TransactionDailySummary> {
        return Array.from(map, ([date, amount]) => ({date, amount}));
    }

    private buildRequestPromise(page: number): Promise<TransactionPage> {
        return new Promise(resolve => {
            resolve(this.service.findAll(page));
        });
    }
}

let defaultTransactionSummaryReport = new DefaultTransactionSummaryReport(new TransactionServiceRestApi());
export {defaultTransactionSummaryReport};