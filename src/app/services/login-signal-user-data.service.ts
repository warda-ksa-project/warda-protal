import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSignalUserDataService {
  user = signal<any | null>(this.loadUserFromStorage());
  api = inject(ApiService);

  setUser(userData: any) {
    console.log('Setting user:', userData);
    this.user.set(userData);

    // ✅ Save full user object
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('favoriteCount');
  }

  // ✅ LOAD user + cartCount + favoriteCount from localStorage
  private loadUserFromStorage(): any | null {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      const storedCartCount = Number(localStorage.getItem('cartCount')) || 0;
      const storedFavoriteCount = Number(localStorage.getItem('favoriteCount')) || 0;

      return {
        ...parsedUser,
        cartCount: storedCartCount,
        favoriteCount: storedFavoriteCount
      };
    }

    return null;
  }

 updateCartCount() {
  forkJoin({
    cart1: this.api.get('portal/ShoppingCart/GetAll/2'),
    cart2: this.api.get('portal/ShoppingCart/GetAllGroup/2')
  }).subscribe(({ cart1, cart2 }) => {
  const cartItems1 = (cart1 as any).data ?? [];
  const cartItems2 = (cart2 as any).data ?? [];

    const newCount = cartItems1.length + cartItems2.length;

    localStorage.setItem('cartCount', newCount.toString());

    const currentUser = this.user();
    if (currentUser) {
      this.user.set({
        ...currentUser,
        cartCount: newCount
      });
    }
  });
}

  updateFavoriteCount() {
    this.api.get('portal/ShoppingCart/GetAll/1').subscribe((res: any) => {
      const wishlistItems = res?.data ?? [];
      const newCount = wishlistItems.length;

      localStorage.setItem('favoriteCount', newCount.toString());

      const currentUser = this.user();
      if (currentUser) {
        this.user.set({
          ...currentUser,
          favoriteCount: newCount
        });
      }
    });
  }
}
