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
const events_1 = require("events");
const device_error_1 = require("./device.error");
class DeviceService extends events_1.EventEmitter {
    constructor(shepherd, logger) {
        super();
        this.shepherd = shepherd;
        this.logger = logger;
    }
    getDevices() {
        return this.shepherd.list().filter((device) => device.type !== 'Coordinator');
    }
    getDevice(addr) {
        const device = this.shepherd.list().find((d) => d.ieeeAddr === addr);
        if (!device) {
            throw new device_error_1.DeviceNotFound(`Failed to find device with ID ${addr}`);
        }
        return device;
    }
    sendAction({ addr, action, type = 'set' }) {
        const { device, mappedModel, epId } = this.getMappedModel(addr);
        return Promise.all(Object.keys(action).map((key) => {
            const converter = mappedModel.toZigbee.find((c) => c.key.includes(key));
            if (!converter) {
                throw new Error(`No converter available for '${key}' (${action[key]})`);
            }
            const message = converter.convert(key, action[key], action, type);
            if (!message) {
                throw new Error('No message available to send action');
            }
            return this.sendMessage(device, epId, message);
        }));
    }
    sendMessage(device, epId, message) {
        return new Promise((resolve, reject) => {
            const callback = (error, response) => {
                if (error) {
                    if (error.message === 'ccznp has not been initialized yet') {
                        this.logger.error('Exit because ccznp has been deactivated.');
                        this.emit('error', 'ccznp exit');
                    }
                    reject(error);
                }
                else {
                    resolve(response);
                }
            };
            const ep = this.shepherd.find(device.ieeeAddr, epId);
            if (message.cmdType === 'functional') {
                ep.functional(message.cid, message.cmd, message.zclData, callback);
            }
            else if (message.cmdType === 'foundation') {
                ep.foundation(message.cid, message.cmd, [message.zclData], callback);
            }
            else {
                reject(`Unknown zigbee publish type ${message.type}`);
            }
        });
    }
    getMappedModel(addr) {
        const { device, epId } = this.getEndPoint(addr);
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (!mappedModel) {
            this.logger.warn('No model found');
            return;
        }
        return { device, mappedModel, epId };
    }
    getEndPoint(addr) {
        const device = this.getDevice(addr);
        const epId = device.epList[0];
        return { device, epId };
    }
    getState(addr, cId, attrId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { epId } = this.getEndPoint(addr);
                const ep = this.shepherd.find(addr, epId);
                return yield ep.read(cId, attrId);
            }
            catch (error) {
                this.emit('error', 'ccznp exit');
                throw error();
            }
        });
    }
}
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map