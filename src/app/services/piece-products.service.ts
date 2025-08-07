import { effect, inject, Injectable, signal } from '@angular/core';
import { ToasterService } from './toaster.service';

@Injectable({ providedIn: 'root' })
export class PieceProductService {
  private readonly STORAGE_KEY = 'piece-products-cart';

  private _items = signal<any[]>(this.loadItemsFromStorage());
  readonly items = this._items.asReadonly();
  toaster = inject(ToasterService);

  constructor() {
    // 🧠 Effect runs automatically when `_items()` changes
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
    });
  }

  private loadItemsFromStorage(): any[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addItem(newItem: any) {
    const currentItems = this._items();

    // ✅ Prevent adding different traderId items — only after the first item is added
    if (currentItems.length > 0) {
      const existingTraderId = currentItems[0].traderId;
      if (newItem.traderId !== existingTraderId) {
        this.toaster.errorToaster('لا يمكنك إضافة منتجات من تاجر مختلف');
        return;
      }
    }

    // 🧠 Now safe to check for existence
    const existingIndex = currentItems.findIndex(item => item.id === newItem.id);

    if (existingIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += 1;
      this._items.set(updatedItems);
      this.toaster.successToaster('تم زيادة الكمية بنجاح');
    } else {
      newItem.quantity = 1;
      this._items.set([...currentItems, newItem]);
      this.toaster.successToaster('تمت إضافة المنتج بنجاح');
    }
    console.log(this.items());
  }


  removeItem(id: number) {
    this._items.update(items => items.filter(item => item.id !== id));
    this.toaster.successToaster('تم ازاله المنتج');
     console.log(this.items());
  }

  increaseQuantity(id: number) {
    this._items.update(items =>
      items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
     console.log(this.items());
  }

  decreaseQuantity(id: number) {
    this._items.update(items =>
      items
        .map(item => {
          if (item.id === id && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
     console.log(this.items());
  }

  clear() {
    this._items.set([]);
    localStorage.removeItem(this.STORAGE_KEY); // 'piece-products-cart'
  }
}