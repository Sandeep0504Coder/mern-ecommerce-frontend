import { User, Product, CartItemType, ShippingInfo, OrderType, Stats, Pie, Line, Bar, Coupon, review, Address, CreateAddressFormData, DeliveryRule, CreateDeliveryRuleFormData, SystemSetting, SystemSettingDetail, SystemSettingValueDetail, Region, CreateRegionFormData, ManageStateFormData, HomePageContent } from "./types";

export type MessageResponse = {
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
export interface MyAddressesResponse{
    success: boolean;
    addresses: Address[];
}

export interface AddressDetailsResponse{
    success: boolean;
    address: Address;
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

export type DeliveryRuleResponse = {
    success: boolean;
    deliveryRules: DeliveryRule[];
}

export type RegionResoponse = {
    success: boolean;
    regions: Region[];
}

export type SystemSettingResponse = {
    success: boolean;
    systemSettings: SystemSetting[];
}

export type SystemSettingDetailsResponse = {
    success: boolean;
    systemSetting: SystemSettingDetail;
}

export type SystemSettingDetailByUniqueNameResponse = {
    success: boolean;
    systemSetting: SystemSettingValueDetail;
}

export interface DeliveryRuleDetailsResponse{
    success: boolean;
    deliveryRule: DeliveryRule;
}

export type RegionDetailsResponse = {
    success: boolean;
    region: Region;
}

export type HomePageContentResponse = {
    success: boolean;
    homePageContents: HomePageContent[];
}

export interface HomePageContentDetailsResponse{
    success: boolean;
    homePageContent: HomePageContent;
}

export interface SearchProductRequest{
    maxPrice: number;
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

export interface ManageRecommendationsRequest{
    userId: string;
    productId: string;
    suggestedProductIds: string;
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

export type CreateAddressRequest = {
    id: string;
    addressData: CreateAddressFormData;
}

export type CreateDeliveryRuleRequest = {
    id: string;
    deliveryRuleData: CreateDeliveryRuleFormData;
}

export type CreateRegionRequest = {
    id: string;
    regionData: CreateRegionFormData;
}

export type ManageStateRequest = {
    id: string;
    regionId: string;
    stateId: string;
    stateData: ManageStateFormData;
}

export type UpdateSystemSettingRequest = {
    userId: string;
    systemSettingId: string;
    updateSystemSettingData: {
        entityId: string;
        settingValue: string;
    };
}

export type UpdateHomePageContentRequest = {
    userId: string;
    homePageContentId: string;
    formData: FormData;
}