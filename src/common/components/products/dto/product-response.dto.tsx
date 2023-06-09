export interface ProductResponseDto {
  id: string;
  code: string;
  name: string;
  weight: number;
  length?: number;
  width?: number;
  height: number;
  diameter?: number;
  imageUrls: string[];
  classificationId: string;
}
