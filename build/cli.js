#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const transaction_1 = require("./service/transaction");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command('$0', 'The default command', () => {
    transaction_1.defaultTransactionSummaryReport.print();
})
    .strict()
    .alias({ h: 'help' })
    .argv;
