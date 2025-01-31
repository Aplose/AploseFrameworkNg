import Dexie, { Table } from 'dexie';

export interface AuthenticationStore {
  key: string;
  value: any;
}

export interface TranslationStore {
  code: string;
  locale: string;
  message: string;
}

export class AploseDatabase extends Dexie {
  authentication!: Table<AuthenticationStore>;
  translation!: Table<TranslationStore>;

  constructor() {
    super('AploseFrameworkNg');
    this.version(2).stores({
      authentication: 'key',
      translation: 'code, locale'
    });
    this.version(3).upgrade(tx => {
      tx.table('authentication').clear();
      tx.table('translation').clear();
    });
  }
}

export const aploseDatabase = new AploseDatabase(); 