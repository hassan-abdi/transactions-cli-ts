"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFormatter = void 0;
class DataFormatter {
    static formatMoney(num, fractionDigits) {
        if ((num > 0 && num < 0.000001) || (num < 0 && num > -0.000001)) {
            num = 0;
        }
        const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fractionDigits || -1) + '})?');
        const arr = num.toString().match(re);
        return Number(arr ? arr[0] : 0).toFixed(fractionDigits);
    }
}
exports.DataFormatter = DataFormatter;
