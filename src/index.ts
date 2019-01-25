import { ShepherdConfig, useFactory } from './shepherd.factory';
import { Logger } from './logger';
import { ZigbeeService } from './zigbee.service';
import { DeviceService } from './device.service';

export function init(
    config: ShepherdConfig,
    logger: Logger = new Logger(),
) {
    const shepherd = useFactory(config, logger);
    const deviceService = new DeviceService(shepherd, logger);
    const zigbeeService = new ZigbeeService(shepherd, deviceService, logger);

    return {
        device: deviceService,
        zigbee: zigbeeService,
    };
}

export { useFactory, Shepherd, ShepherdConfig } from './shepherd.factory';
export { ZigbeeService, eventType, messageType } from './zigbee.service';
export { DeviceService, Action, Device, DeviceEndPoint, DeviceModel, MappedModel } from './device.service';
