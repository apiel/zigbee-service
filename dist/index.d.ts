import { ShepherdConfig } from "./shepherd.factory";
import { Logger } from "./logger";
import { ZigbeeService } from "./zigbee.service";
import { DeviceService } from "./device.service";
export declare function init(config: ShepherdConfig, logger?: Logger): {
    deviceService: DeviceService;
    zigbeeService: ZigbeeService;
};
