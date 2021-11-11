import {TransactionPage, TransactionService} from '../../src/service/transaction';
import {transactionsData} from './transaction.data';

export class TransactionServiceFake implements TransactionService {
    async findAll(page: number): Promise<TransactionPage> {
        if (page > transactionsData.length || page <= 0) {
            throw new TypeError('Page not found error')
        }
        return Promise.resolve(transactionsData[page - 1]);
    }
}