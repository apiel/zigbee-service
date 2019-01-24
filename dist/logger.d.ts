import * as debug from 'debug';
export declare class Logger {
    readonly log: debug.IDebugger;
    readonly warn: debug.IDebugger;
    readonly error: debug.IDebugger;
    constructor(log?: debug.IDebugger, warn?: debug.IDebugger, error?: debug.IDebugger);
}
