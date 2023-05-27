import { ProductOrderPostDto } from "./product-order-post.dto";

export interface AddOrderDto {
    clientId: string|undefined;
    priceId: string;
    products: ProductOrderPostDto[];
};