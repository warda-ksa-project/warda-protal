// trader-card.interface.ts
export interface TraderCategory {
  categoryId?: number;
  enName?: string;
  arName?: string;
}

export interface TraderCardData {
  id?: number;
  name?: string;
  storeName?: string;
  image?: string | null;
  enDescription?: string | null;
  arDescription?: string | null;
  categories?: TraderCategory[];
  reviewAverage?: number;
  traderReviews?: any[];
}
