"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
function env(key, defaultValue) {
    return (process.env[key]) ?? defaultValue;
}
exports.env = env;
