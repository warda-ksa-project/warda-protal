export interface BannerData {
  titleKey: string;  // Translation Key
  descriptionKey?: string; // Translation Key
  imageUrl: string;
  breadcrumb: any[]; // PrimeNG Breadcrumb items
}