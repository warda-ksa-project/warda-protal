import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'piece_product_items';

@Injectable({ providedIn: 'root' })
export class PieceProductService {
  private _items = signal<Record<string, any>[]>(this.loadFromLocalStorage());

  readonly items = computed(() => this._items());

  private loadFromLocalStorage(): Record<string, any>[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(items: Record<string, any>[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  addItem(item: Record<string, any>) {
    const items = [...this._items(), item];
    this._items.set(items);
    this.saveToLocalStorage(items);
  }

  removeItem(id: any) {
    const items = this._items().filter((item: any) => item.id !== id);
    this._items.set(items);
    this.saveToLocalStorage(items);
  }
}