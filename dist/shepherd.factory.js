"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ZShepherd = require("zigbee-shepherd");
exports.useFactory = (config, logger) => {
    const path = config.SERIAL_PATH;
    const shepherd = new ZShepherd(path, {
        sp: { baudRate: 115200, rtscts: true },
        dbPath: config.DB_PATH,
    });
    shepherd.on('ZNP:CLOSE', () => {
        logger.error('ZNP:CLOSE exit app!');
        process.exit();
    });
    shepherd.on('ready', () => __awaiter(this, void 0, void 0, function* () {
        logger.log('Server is ready.');
        const time = config.ZIGBEE_PERMIT_JOIN;
        yield shepherd.permitJoin(time || 255);
        logger.log('Waiting for device');
    }));
    return shepherd;
};
//# sourceMappingURL=shepherd.factory.js.map