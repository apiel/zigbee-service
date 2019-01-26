import { ShepherdConfig, useFactory } from './shepherd.factory';
import { Logger } from './logger';
import { ZigbeeService } from './zigbee.service';
import { DeviceService } from './device.service';

export class ZigbeeAndDevice {
    device: DeviceService;
    zigbee: ZigbeeService;

    init(
        config: ShepherdConfig,
        logger: Logger = new Logger(),
    ): void {
        const shepherd = useFactory(config, logger);
        this.device = new DeviceService(shepherd, logger);
        this.zigbee = new ZigbeeService(shepherd, this.device, logger);
    }
}

export { useFactory, Shepherd, ShepherdConfig } from './shepherd.factory';
export { ZigbeeService, eventType, messageType } from './zigbee.service';
export { DeviceService, Action, Device, DeviceEndPoint, DeviceModel, MappedModel } from './device.service';
