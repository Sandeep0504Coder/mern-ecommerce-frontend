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
    description?: string;
}

export type Coupon = {
    _id: string;
    code: string;
    amount: number;
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
    descriptionUpdate?: string;
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

type CountAndChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
}

export type Stats = {
    categoryCount: Record<string, number>[];
    changePercent: CountAndChange;
    count: CountAndChange;
    chart: {
        order: number[];
        revenue: number[];
    };
    userRatio: {
        male: number;
        female: number;
    };
    latestTransaction: LatestTransaction[]
}

export type Pie = {
    orderFulfillment: {
        processing: number;
        shipped: number;
        delivered: number;
    };
    productCategories: Record<string, number>[];
    stockAvailability: {
        inStock: number;
        outOfStock: number;
    };
    revenueDistribution: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingCost: number;
    };
    adminCustomer: {
        admin: number;
        customer: number;
    };
    userAgeGroup: {
        teen: number;
        adult: number;
        old: number;
    };
}

export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
}

export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
}