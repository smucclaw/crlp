export declare function fetchJson<T>(input: string | object): Promise<T>;
export declare function fetchUpdates<T>(url: string, previousData: T): Promise<T | null>;
export declare function sendToLadder<T>(url: string, data: unknown): Promise<T>;
