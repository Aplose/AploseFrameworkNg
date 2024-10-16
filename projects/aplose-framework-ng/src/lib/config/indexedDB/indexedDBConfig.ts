import { DBConfig } from "ngx-indexed-db";


export const aploseDBConfig: DBConfig = {
    name: 'aploseFrameworkNg',
    version: 1,
    objectStoresMeta: [
        {
            store: 'authentication',
            storeConfig: { keyPath: 'key', autoIncrement: false },
            storeSchema: [
                { name: 'key', keypath: 'key', options: { unique: true } },
            ]
        },
        {
            store: 'translation',
            storeConfig: {keyPath: 'transaction', autoIncrement: false},
            storeSchema: [
                { name: 'transaction', keypath: 'transaction', options: {unique: true}}
            ]
        }
    ],
};


