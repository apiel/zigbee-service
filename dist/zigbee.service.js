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
const zShepherdConverters = require("zigbee-shepherd-converters");
const zclPacket = require("zcl-packet");
const lodash_1 = require("lodash");
const events_1 = require("events");
exports.messageType = {
    devIncoming: 'devIncoming',
    attReport: 'attReport',
};
exports.eventType = {
    devIncoming: exports.messageType.devIncoming,
    ind: 'ind',
    indMessage: 'indMessage',
    afIncomingMsg: 'afIncomingMsg',
    devices: 'devices',
};
class ZigbeeService extends events_1.EventEmitter {
    constructor(shepherd, deviceService, logger) {
        super();
        this.shepherd = shepherd;
        this.deviceService = deviceService;
        this.logger = logger;
        this.start = (error) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                this.logger.error('Error when starting zigbee service. Exit process!', JSON.stringify(error));
                process.exit();
            }
            this.logger.log('Start zigbee');
            const devices = this.deviceService.getDevices();
            this.logger.log(`Zigbee devices: ${JSON.stringify(devices, null, 4)}`);
            this.emit(exports.eventType.devices, { devices });
            devices.forEach((device) => {
                this.attachDevice(device);
            });
        });
        this.error = (error) => {
            this.logger.error(error);
        };
        this.onInd = (message) => {
            this.logger.log(`> ind: ${message.type}`);
            this.emit(exports.eventType.ind, message);
            if (message.type === exports.messageType.devIncoming) {
                this.devIncoming(message);
            }
            else if (message.type === exports.messageType.attReport) {
                this.loadMessage(message);
            }
        };
        this.registerOnAfIncomingMsg = (addr, epId) => {
            const ep = this.shepherd.find(addr, epId);
            ep.onAfIncomingMsg = (message) => __awaiter(this, void 0, void 0, function* () {
                const data = yield zclPacket.parse(message.data, message.clusterid);
                this.emit(exports.eventType.afIncomingMsg, { addr, data });
            });
        };
        shepherd.start(this.start);
        shepherd.on('error', this.error);
        shepherd.on('ind', this.onInd);
    }
    devIncoming(message) {
        const device = lodash_1.get(message, 'endpoints[0].device');
        if (device) {
            const addr = device.ieeeAddr;
            this.logger.log(`devIncoming, new device ${addr}`);
            this.emit(exports.eventType.devIncoming, { addr });
            this.attachDevice(device);
        }
        else {
            this.logger.error('devIncoming without device');
        }
    }
    loadMessage(message) {
        const device = lodash_1.get(message, 'endpoints[0].device');
        const cid = lodash_1.get(message, 'data.cid');
        const cmdId = lodash_1.get(message, 'data.cmdId');
        if (device && (cid || cmdId)) {
            const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
            const converters = mappedModel.fromZigbee.filter((c) => {
                if (cid) {
                    return c.cid === cid && c.type === message.type;
                }
                else if (cmdId) {
                    return c.cmd === cmdId;
                }
                return false;
            });
            converters.forEach((converter) => {
                const data = converter.convert(mappedModel, message, null, device);
                const cmd = cid || cmdId;
                this.emit(exports.eventType.indMessage, { data, cmd });
            });
        }
    }
    attachDevice(device) {
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (mappedModel) {
            if (mappedModel.configure) {
                mappedModel.configure(device.ieeeAddr, this.shepherd, this.getCoordinator(), (ok) => {
                    const result = ok ? 'Succeed' : 'Failed';
                    this.logger.log(`${result} to configure ${mappedModel.description} ${device.ieeeAddr}`);
                });
            }
            if (mappedModel.onAfIncomingMsg) {
                mappedModel.onAfIncomingMsg.forEach((epId) => this.registerOnAfIncomingMsg(device.ieeeAddr, epId));
            }
        }
    }
    getCoordinator() {
        const device = this.shepherd.list().find((d) => d.type === 'Coordinator');
        return this.shepherd.find(device.ieeeAddr, 1);
    }
}
exports.ZigbeeService = ZigbeeService;
//# sourceMappingURL=zigbee.service.js.map