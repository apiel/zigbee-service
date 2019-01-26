import * as debug from 'debug';

export class Logger {
    constructor(
        public readonly log: any = debug('zigbee-service:log'),
        public readonly warn: any = debug('zigbee-service:warn'),
        public readonly error: any = debug('zigbee-service:error'),
    ) {}
}
