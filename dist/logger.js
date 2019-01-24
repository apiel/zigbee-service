"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
class Logger {
    constructor(log = debug('zigbee-service:log'), warn = debug('zigbee-service:warn'), error = debug('zigbee-service:error')) {
        this.log = log;
        this.warn = warn;
        this.error = error;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map