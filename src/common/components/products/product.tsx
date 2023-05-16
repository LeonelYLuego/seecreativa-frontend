export interface Product {
  id: string;
  code: string;
  name: string;
  weight: number;
  length?: number;
  with?: number;
  height: number;
  diameter?: number;
  imageUrls: string[];
  classificationId: string;
}
