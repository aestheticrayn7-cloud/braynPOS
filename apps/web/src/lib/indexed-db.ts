import Dexie, { type Table } from 'dexie';

export interface LocalSale {
  id: string;
  offlineReceiptNo: string;
  saleData: any;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export class BraynDatabase extends Dexie {
  sales!: Table<LocalSale>;

  constructor() {
    super('BraynOfflineDB');
    this.version(1).stores({
      sales: 'id, offlineReceiptNo, syncStatus, createdAt'
    });
  }
}

export const db = new BraynDatabase();
