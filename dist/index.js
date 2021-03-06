"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shepherd_factory_1 = require("./shepherd.factory");
const logger_1 = require("./logger");
const zigbee_service_1 = require("./zigbee.service");
const device_service_1 = require("./device.service");
class ZigbeeAndDevice {
    init(config, logger = new logger_1.Logger()) {
        const shepherd = shepherd_factory_1.useFactory(config, logger);
        this.device = new device_service_1.DeviceService(shepherd, logger);
        this.zigbee = new zigbee_service_1.ZigbeeService(shepherd, this.device, logger);
    }
}
exports.ZigbeeAndDevice = ZigbeeAndDevice;
var shepherd_factory_2 = require("./shepherd.factory");
exports.useFactory = shepherd_factory_2.useFactory;
var zigbee_service_2 = require("./zigbee.service");
exports.ZigbeeService = zigbee_service_2.ZigbeeService;
exports.eventType = zigbee_service_2.eventType;
exports.messageType = zigbee_service_2.messageType;
var device_service_2 = require("./device.service");
exports.DeviceService = device_service_2.DeviceService;
//# sourceMappingURL=index.js.map