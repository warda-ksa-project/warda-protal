export interface CardData {
  id?: number;
  arName?: string;
  enName?: string;
  enDescription?: string;
  arDescription?: string;
  categoryId?: number;
  image?: {
    id: number;
    productId: number;
    image: string;
    mediaTypeEnum: number;
  }[]; // ✅ Array of images
  productReviews?: any[]; // ✅ Placeholder for reviews
  reviewAverage?: number;
  startDate?: string;
  endDate?: string;
  stockQuantity?: number;
  hasDiscount?: boolean;
  discountType?: number;
  amount?: number;
  price?: number;
  priceAfterDiscount?: number;
  mainCategoryNameAr?: string;
  mainCategoryNameEn?: string;
  subCategoryNameAr?: string;
  subCategoryNameEn?: string;
  isFavorite?: boolean;
}
