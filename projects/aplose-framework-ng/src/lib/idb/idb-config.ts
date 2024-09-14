import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

export function migrationFactory() {
  return {
    1: (db:IDBDatabase, transaction:IDBTransaction) => {
        const countryStore = transaction.objectStore('country');
        const configStore = transaction.objectStore('configuration');
        const translationStore = transaction.objectStore('translation');
        },
  };
}

export const dbConfig: DBConfig  = {
  name: 'AploseFrameworkDb',
  version: 1,
  objectStoresMeta: [ 
  {
    store: 'configuration',
    storeConfig: {keyPath:'key',autoIncrement:false},
    storeSchema:[
      { name: 'value', keypath: 'value', options: { unique: false } }
    ]
  },
  {
    store: 'translation',
    storeConfig: { keyPath: 'key', autoIncrement:false },
    storeSchema: [
      { name: 'value', keypath: 'value', options: { unique: false } }
    ]
  }],
  // provide the migration factory to the DBConfig
  migrationFactory

};
