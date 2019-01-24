/// <reference types="node" />
import { EventEmitter } from 'events';
import { Shepherd } from './shepherd.factory';
import { Device, DeviceService } from './device.service';
import { Logger } from './logger';
export declare const messageType: {
    devIncoming: string;
    attReport: string;
};
export declare const eventType: {
    devIncoming: string;
    ind: string;
    indMessage: string;
    afIncomingMsg: string;
    devices: string;
};
export declare class ZigbeeService extends EventEmitter {
    private shepherd;
    private deviceService;
    private logger;
    constructor(shepherd: Shepherd, deviceService: DeviceService, logger: Logger);
    protected start: (error: Error) => Promise<void>;
    protected error: (error: Error) => void;
    protected onInd: (message: any) => void;
    protected devIncoming(message: any): void;
    protected loadMessage(message: any): void;
    protected attachDevice(device: Device): void;
    protected registerOnAfIncomingMsg: (addr: string, epId: number) => void;
    getCoordinator(): any;
}
