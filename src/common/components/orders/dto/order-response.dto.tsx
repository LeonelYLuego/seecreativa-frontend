import { ProductOrderCreateDto } from "./product-order-create.dto";

export interface OrderResponseDto {
    id?: string;
    clientId: string;
    priceId: string;
    createdAt?: string;
    deliveredAt?: string;
    // array of products
    products: ProductOrderCreateDto[];
}