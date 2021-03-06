import * as ZShepherd from 'zigbee-shepherd';
import * as debug from 'debug';
import { Logger } from './logger';

export interface Shepherd {
    controller: any;
    acceptDevIncoming: () => void;
    start: any; // (callback: () => void) => void;
    on: any;
    list: any;
    find: any;
    permitJoin: any;
}

export interface ShepherdConfig {
    SERIAL_PATH: string;
    ZIGBEE_PERMIT_JOIN: number;
    DB_PATH: string;
}

export const useFactory = (
    config: ShepherdConfig,
    logger: Logger,
): Shepherd => {
    const path = config.SERIAL_PATH;
    const shepherd = new ZShepherd(path, {
        sp: { baudRate: 115200, rtscts: true },
        dbPath: config.DB_PATH,
    });
    shepherd.on('ready', async () => {
        logger.log('Server is ready.');
        const time = config.ZIGBEE_PERMIT_JOIN;
        await shepherd.permitJoin(time || 255);
        logger.log('Waiting for device');
    });
    return shepherd;
};
