import { DBConfig } from "ngx-indexed-db";


export const aploseDBConfig: DBConfig = {
    name: 'aploseFrameworkIDB',
    version: 1,
    objectStoresMeta: [{
        store: 'authentication',
        storeConfig: { keyPath: 'key', autoIncrement: false },
        storeSchema: [
            { name: 'key', keypath: 'key', options: { unique: true } },
        ]
    }],
  };