export interface Options {
    storeName: string;
    dbMode: IDBTransactionMode;
    error: (e: Event) => any;
    complete?: (e: Event) => any;
    abort?: any;
}
export declare function validateStoreName(db: IDBDatabase, storeName: string): boolean;
export declare function validateBeforeTransaction(db: IDBDatabase, storeName: string, reject: (message: string) => void): void;
export declare function createTransaction(db: IDBDatabase, options: Options): IDBTransaction;
export declare function optionsGenerator(type: any, storeName: any, reject: (reason?: any) => void, resolve?: (e: any) => void): Options;
