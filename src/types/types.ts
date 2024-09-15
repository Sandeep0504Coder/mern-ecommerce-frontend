export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}

export type Product = {
    name: string;
    photo: string;
    category: string;
    price: number;
    stock: number;
    _id: string;
}

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export type CartItemType = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

export type OrderItemType = Omit<CartItemType, "stock"> & {
    _id: string;
}

export interface ProductUpdateFormData {
    nameUpdate: string;
    photoUpdate: string;
    categoryUpdate: string;
    priceUpdate: number;
    stockUpdate: number;
    photoFile: File | undefined;
}

export type OrderType = {
    orderItems: OrderItemType[],
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
}