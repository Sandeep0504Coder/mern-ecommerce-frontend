import { User, Product, CartItemType, ShippingInfo, OrderType } from "./types";

export interface MessageResponse{
    success: boolean;
    message: string;
}

export interface UserResponse{
    success: boolean;
    user: User;
}

export interface AllUsersResponse{
    success: boolean;
    users: User[];
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

export interface DeleteProductRequest{
    userId: string;
    productId: string;
}

export interface DeleteUserRequest{
    userId: string;
    adminUserId: string;
}

export interface NewOrderRequest{
    orderItems: CartItemType[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
    user: string;
}

export interface UpdateOrderRequest{
    userId: string;
    orderId: string;
}

export interface AllOrdersResponse{
    success: boolean;
    orders: OrderType[];
}

export interface OrderDetailsResponse{
    success: boolean;
    order: OrderType;
}