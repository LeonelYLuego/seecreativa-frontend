export interface ProductCreateDto {
  code: string;
  name: string;
  weight: number;
  width?: number;
  length?: number;
  height: number;
  diameter?: number;
  classificationId: string;
}
