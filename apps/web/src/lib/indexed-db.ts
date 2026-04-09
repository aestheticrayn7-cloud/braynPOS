import Dexie, { type Table } from 'dexie';

export interface LocalSale {
  id: string;
  offlineReceiptNo: string;
  saleData: any;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export interface LocalItem {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  retailPrice: number;
  wholesalePrice: number;
  minRetailPrice: number;
  minWholesalePrice: number;
  weightedAvgCost: number;
  isSerialized: boolean;
  categoryName?: string;
  updatedAt: string;
}

export class BraynDatabase extends Dexie {
  sales!: Table<LocalSale>;
  items!: Table<LocalItem>;

  constructor() {
    super('BraynOfflineDB');
    this.version(2).stores({
      sales: 'id, offlineReceiptNo, syncStatus, createdAt',
      items: 'id, sku, barcode, name'
    });
  }
}

export const db = new BraynDatabase();
