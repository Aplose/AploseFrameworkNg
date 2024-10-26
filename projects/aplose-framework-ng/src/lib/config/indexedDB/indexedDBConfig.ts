import { DBConfig } from "ngx-indexed-db";


export const aploseDBConfig: DBConfig = {
    name: 'AploseFrameworkNg',
    version: 2,
    objectStoresMeta: [
        {
            store: 'authentication',
            storeConfig: { keyPath: 'key', autoIncrement: false },
            storeSchema: [
                { name: 'key', keypath: 'key', options: { unique: true } },
                { name: 'value', keypath: 'value', options: {unique: false}}
            ]
        },
        {
            store: 'translation',
            storeConfig: {keyPath: 'code', autoIncrement: false},
            storeSchema: [
                { name: 'code', keypath: 'code', options: {unique: true}},
                { name: 'locale', keypath: 'locale', options: {unique: false}},
            ]
        }
    ],
    migrationFactory: () => {
        return {
            1: (db: IDBDatabase, transaction: IDBTransaction) => {
                console.log('migration 1');
            },
            2: (db: IDBDatabase, transaction: IDBTransaction) => {
                console.log('migration 2: Recréation de l\'objectStore translation');
                if (db.objectStoreNames.contains('translation')) {
                    db.deleteObjectStore('translation');
                }
                const translationStore = db.createObjectStore('translation', { keyPath: 'key', autoIncrement: false });
                translationStore.createIndex('key', 'key', { unique: true });
                console.log('migration 2: ObjectStore translation recréé');
                console.log('migration 2: Recréation de l\'objectStore authentication');
                if (db.objectStoreNames.contains('authentication')) {
                    db.deleteObjectStore('authentication');
                }
                const authenticationStore = db.createObjectStore('authentication', { keyPath: 'key', autoIncrement: false });
                authenticationStore.createIndex('key', 'key', { unique: true });
                console.log('migration 2: ObjectStore authentication recréé');
                
            }
        };
    }
};


