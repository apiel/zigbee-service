import * as debug from 'debug';

export class Logger {
    constructor(
        public readonly log = debug('zigbee-service:log'),
        public readonly warn = debug('zigbee-service:warn'),
        public readonly error = debug('zigbee-service:error'),
    ) {}
}
