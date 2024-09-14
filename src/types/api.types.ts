import { User, Product } from "./types";

export interface MessageResponse{
    success: boolean;
    message: string;
}

export interface UserResponse{
    success: boolean;
    user: User;
}

export interface ProductResponse{
    success: boolean;
    products: Product[];
}

export interface ProductCategoriesResponse{
    success: boolean;
    categories: string[];
}

export type CustomError = {
    status: number;
    data: {
        message: string;
        success:boolean;
    };
}

export interface SearchProductResponse extends ProductResponse{
    totalPage: number;
}

export interface ProductDetailsResponse{
    success: boolean;
    product: Product;
}

export interface SearchProductRequest{
    price: number;
    page: number;
    category: string;
    sort: string;
    search: string;
}

export interface CreateProductRequest{
    id: string;
    formData: FormData;
}

export interface UpdateProductRequest extends CreateProductRequest{
    productId: string;
}