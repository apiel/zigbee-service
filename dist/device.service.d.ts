/// <reference types="node" />
import { EventEmitter } from 'events';
import { Shepherd } from './shepherd.factory';
import { Logger } from './logger';
export interface MappedModel {
    zigbeeModel: string[];
    model: string;
    description: string;
    supports: string;
    vendor: string;
    fromZigbee: [{
        cid: string;
        type: string;
    }];
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
export declare class DeviceService extends EventEmitter {
    private shepherd;
    private logger;
    constructor(shepherd: Shepherd, logger: Logger);
    getDevices(): any;
    getDevice(addr: string): any;
    sendAction({ addr, action, type }: Action): Promise<any>;
    protected parseError(error: Error): void;
    sendMessage(device: Device, epId: number, message: any): Promise<any>;
    getMappedModel(addr: string): DeviceModel;
    getEndPoint(addr: string): DeviceEndPoint;
    getState(addr: string, cId: string, attrId: string): Promise<any>;
}
