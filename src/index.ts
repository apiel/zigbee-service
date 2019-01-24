import { ShepherdConfig, useFactory } from './shepherd.factory';
import { Logger } from './logger';
import { ZigbeeService } from './zigbee.service';
import { DeviceService } from './device.service';

export function init(
    config: ShepherdConfig,
    logger: Logger = new Logger,
) {
    const shepherd = useFactory(config, logger);
    const deviceService = new DeviceService(shepherd, logger);
    const zigbeeService = new ZigbeeService(shepherd, deviceService, logger);

    return {
        deviceService,
        zigbeeService,
    }
}

export { useFactory } from './shepherd.factory';
export { ZigbeeService } from './zigbee.service';
export { DeviceService } from './device.service';
