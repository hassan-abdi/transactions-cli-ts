"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTransactionSummaryReport = exports.DefaultTransactionSummaryReport = exports.TransactionServiceRestApi = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_case_converter_1 = __importDefault(require("axios-case-converter"));
const dataFormatter_1 = require("../utilities/dataFormatter");
const env_1 = require("../utilities/env");
class TransactionServiceRestApi {
    constructor() {
        this.client = (0, axios_case_converter_1.default)(axios_1.default.create());
    }
    async findAll(page) {
        function emptyTransactionPage(page) {
            return { page: page, totalCount: 0, transactions: [] };
        }
        const url = (0, env_1.env)('SERVICE_URL', 'https://resttest.bench.co').concat(`/transactions/${page}.json`);
        return new Promise((resolve, reject) => {
            this.client.get(url)
                .then((response) => {
                resolve(response.data);
            })
                .catch((error) => {
                if (error.response.status == 404) {
                    resolve(emptyTransactionPage(page));
                    return;
                }
                reject(error);
            });
        });
    }
}
exports.TransactionServiceRestApi = TransactionServiceRestApi;
class DefaultTransactionSummaryReport {
    constructor(service) {
        this.service = service;
    }
    async print() {
        try {
            for (const record of await this.aggregate()) {
                console.log(record.date + ' ' +
                    dataFormatter_1.DataFormatter.formatMoney(record.amount, 2));
            }
        }
        catch (e) {
            console.log("Something went wrong, try later!");
            throw e;
        }
    }
    async aggregate() {
        let map = await this.aggregateAllTransactionsByDate();
        let records = DefaultTransactionSummaryReport.toSummariesRecord(DefaultTransactionSummaryReport.sort(map));
        return Promise.resolve(records);
    }
    async aggregateAllTransactionsByDate() {
        let page = 0;
        let readRecordsCount = 0;
        let totalRecordsCount = 1;
        let pageSize = 1;
        const result = new Map();
        do {
            const paginationPromises = this.createPaginationPromises(totalRecordsCount - readRecordsCount, pageSize, page);
            let transactionPages = await Promise.all(paginationPromises);
            page += transactionPages.length;
            transactionPages.forEach((transactionPage) => {
                pageSize = transactionPage.transactions.length;
                totalRecordsCount = transactionPage.totalCount;
                readRecordsCount += transactionPage.transactions.length;
                this.calculateSumOfAmountsInOnePage(transactionPage, result);
            });
        } while (readRecordsCount < totalRecordsCount);
        return Promise.resolve(result);
    }
    calculateSumOfAmountsInOnePage(transactionPage, map) {
        transactionPage.transactions.forEach((item) => {
            map.set(item.date, Number(item.amount) + Number(map.get(item.date) ?? 0));
        });
    }
    createPaginationPromises(unreadRecordsCount, pageSize, lastPage) {
        const concurrentRequestCount = (0, env_1.env)('CONCURRENT_REQUEST', 5);
        const numberOfPages = unreadRecordsCount / pageSize;
        const numberOfTasks = numberOfPages > concurrentRequestCount ? concurrentRequestCount : numberOfPages;
        const tasks = [];
        for (let i = 0; i < Math.ceil(numberOfTasks); i++) {
            tasks.push(this.buildRequestPromise(lastPage + i + 1));
        }
        return tasks;
    }
    static sort(summary) {
        return new Map([...summary.entries()].sort());
    }
    static toSummariesRecord(map) {
        return Array.from(map, ([date, amount]) => ({ date, amount }));
    }
    buildRequestPromise(page) {
        return new Promise(resolve => {
            resolve(this.service.findAll(page));
        });
    }
}
exports.DefaultTransactionSummaryReport = DefaultTransactionSummaryReport;
let defaultTransactionSummaryReport = new DefaultTransactionSummaryReport(new TransactionServiceRestApi());
exports.defaultTransactionSummaryReport = defaultTransactionSummaryReport;
