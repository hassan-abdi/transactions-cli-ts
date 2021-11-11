export class DataFormatter {
    public static formatMoney(num: number, fractionDigits: number): string {
        if ((num > 0 && num < 0.000001) || (num < 0 && num > -0.000001)) {
            num = 0;
        }
        const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fractionDigits || -1) + '})?');
        const arr = num.toString().match(re);
        return Number(arr ? arr[0] : 0).toFixed(fractionDigits);
    }
}