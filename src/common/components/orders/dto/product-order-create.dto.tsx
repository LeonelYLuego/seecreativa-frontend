export interface ProductOrderCreateDto {
    id: string;
    quantity: number;
    code: string;
    name: string;
    weight: number;
    length?: number;
    width?: number;
    height: number;
    diameter?: number;
    imageUrls?: string[];
    classificationId?: string;
}