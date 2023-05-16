export interface ProductWithClassificationResponseDto {
  id: string;
  code: string;
  name: string;
  weight: number;
  length?: number;
  width?: number;
  height: number;
  diameter?: number;
  imageUrls: string[];
  classification: {
    id: string;
    name: string;
  };
}
