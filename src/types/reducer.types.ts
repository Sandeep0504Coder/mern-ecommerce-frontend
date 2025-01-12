import { CartItemType, ShippingInfo, User } from "./types";

export interface UserReducerInitialState{
    user: User | null;
    loading: boolean;
}

export interface CartReducerInitialState{
    loading: boolean;
    selectedShippingAddressId: string;
    cartItems: CartItemType[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
}