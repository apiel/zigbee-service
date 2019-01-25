import { ShepherdConfig } from './shepherd.factory';
import { Logger } from './logger';
import { ZigbeeService } from './zigbee.service';
import { DeviceService } from './device.service';
export declare function init(config: ShepherdConfig, logger?: Logger): {
    device: DeviceService;
    zigbee: ZigbeeService;
};
export { useFactory, Shepherd, ShepherdConfig } from './shepherd.factory';
export { ZigbeeService, eventType, messageType } from './zigbee.service';
export { DeviceService, Action, Device, DeviceEndPoint, DeviceModel, MappedModel } from './device.service';
