import { Logger } from './logger';
export interface Shepherd {
    controller: any;
    acceptDevIncoming: () => void;
    start: any;
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
export declare const useFactory: (config: ShepherdConfig, logger: Logger) => Shepherd;
