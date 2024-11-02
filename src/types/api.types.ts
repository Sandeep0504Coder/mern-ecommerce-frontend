import { User, Product, CartItemType, ShippingInfo, OrderType, Stats, Pie, Line, Bar, Coupon, review } from "./types";

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

export interface AllReviewsResponse{
    success: boolean;
    reviews: review[];
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

export interface AllOrdersResponse{
    success: boolean;
    orders: OrderType[];
}

export interface OrderDetailsResponse{
    success: boolean;
    order: OrderType;
}

export type StatsResponse = {
    success: boolean;
    stats: Stats;
}

export type PieResponse = {
    success: boolean;
    charts: Pie;
}

export type LineChartsResponse = {
    success: boolean;
    charts: Line;
}

export type BarResponse = {
    success: boolean;
    charts: Bar;
}
export interface CouponResonse{
    success: boolean;
    coupons: Coupon[];
}

export interface CouponDetailsResonse{
    success: boolean;
    coupon: Coupon;
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

export interface AddEditReviewRequest{
    userId?: string;
    productId: string;
    rating: number;
    comment: string;
}

export interface DeleteReviewRequest{
    userId?: string;
    reviewId: string;
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

export interface CreateCouponRequest{
    id: string;
    formData: FormData;
}

export interface UpdateCouponRequest{
    userId: string;
    couponId: string;
    formData: FormData;
}

export interface DeleteCouponRequest{
    userId: string;
    couponId: string;
}

export interface CouponDetailsRequest{
    userId: string;
    couponId: string;
}