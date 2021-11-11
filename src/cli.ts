#!/usr/bin/env node

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {defaultTransactionSummaryReport} from "./service/transaction";
import dotenv from 'dotenv';

dotenv.config();

yargs(hideBin(process.argv))
    .command('$0', 'The default command', () => {
        defaultTransactionSummaryReport.print();
    })
    .strict()
    .alias({h: 'help'})
    .argv;