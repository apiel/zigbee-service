import * as zShepherdConverters from 'zigbee-shepherd-converters';
import { EventEmitter } from 'events';

import { Shepherd } from './shepherd.factory';
import { DeviceNotFound } from './device.error';
import { Logger } from './logger';

export interface MappedModel {
    zigbeeModel: string[];
    model: string;
    description: string;
    supports: string;
    vendor: string;
    fromZigbee: [{ cid: string, type: string }];
    toZigbee: any;
}

export interface Device {
    type: string;
    ieeeAddr: string;
    nwkAddr: number;
    manufId: number;
    manufName: string;
    powerSource: string;
    modelId: string;
    epList: number[];
    status: string;
    joinTime: number;
}

export interface DeviceEndPoint {
    device: Device;
    epId: number;
}

export interface DeviceModel extends DeviceEndPoint {
    mappedModel: MappedModel;
}

export interface Action {
    addr: string;
    action: any;
    type: 'set' | 'get';
}

export class DeviceService extends EventEmitter {
    constructor(
        private shepherd: Shepherd,
        private logger: Logger,
    ) {
        super();
    }

    getDevices() {
        return this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
    }

    getDevice(addr: string) {
        const device = this.shepherd.list().find((d: Device) => d.ieeeAddr === addr);
        if (!device) {
            throw new DeviceNotFound(`Failed to find device with ID ${addr}`);
        }
        return device;
    }

    sendAction({ addr, action, type = 'set' }: Action): Promise<any> {
        const { device, mappedModel, epId } = this.getMappedModel(addr);
        return Promise.all(
            Object.keys(action).map((key) => {
                const converter = mappedModel.toZigbee.find((c) => c.key.includes(key));
                if (!converter) {
                    throw new Error(`No converter available for '${key}' (${action[key]})`);
                }
                const message = converter.convert(key, action[key], action, type); // we might have to handle null as message
                if (!message) {
                    throw new Error('No message available to send action');
                }
                return this.sendMessage(device, epId, message);
            }),
        );
    }

    sendMessage(device: Device, epId: number, message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error, response: any) => {
                if (error) {
                    if (error.message === 'ccznp has not been initialized yet') {
                        this.logger.error('Exit because ccznp has been deactivated.');
                        this.emit('error', 'ccznp exit');
                    }
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            const ep = this.shepherd.find(device.ieeeAddr, epId);
            if (message.cmdType === 'functional') {
                ep.functional(message.cid, message.cmd, message.zclData, callback);
            } else if (message.cmdType === 'foundation') {
                ep.foundation(message.cid, message.cmd, [message.zclData], callback);
            } else {
                reject(`Unknown zigbee publish type ${message.type}`);
            }
        });
    }

    getMappedModel(addr: string): DeviceModel {
        const { device, epId } = this.getEndPoint(addr);
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (!mappedModel) {
            this.logger.warn('No model found');
            return;
        }
        return { device, mappedModel, epId };
    }

    getEndPoint(addr: string): DeviceEndPoint {
        const device = this.getDevice(addr);
        const epId = device.epList[0];
        return { device, epId };
    }

    async getState(addr: string, cId: string, attrId: string) {
        try {
            const { epId } = this.getEndPoint(addr);
            const ep = this.shepherd.find(addr, epId);
            return await ep.read(cId, attrId);
        } catch (error) {
            this.emit('error', 'ccznp exit');
            throw error();
        }
    }
}
