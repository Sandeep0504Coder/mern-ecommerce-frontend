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
    photos: {
        public_id: string;
        url: string;
    }[];
    category: string;
    price: number;
    stock: number;
    _id: string;
    description: string;
    ratings: number;
    numOfReviews: number;
    suggestedItems: {
        productId: {
            _id: string;
            price: number;
            stock: number;
            description: string;
            name: string;
            photos: {
                public_id: string;
                url: string;
            }[];
            category: string;
            variants: ProductVariantType[];
        }
    }[],
    variants: ProductVariantType[];
}

export type review = {
    product: string;
    user: {
        name: string;
        photo: string;
        _id: string;
    };
    rating: number;
    comment: string;
    _id: string;
};

export type Address = {
    _id: string;
    name: string;
    primaryPhone: string;
    secondaryPhone: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    user: string;
    isDefault: boolean;
};

export type DeliveryRule = {
    _id: string;
    ruleName: string;
    subtotalMinRange: number;
    subtotalMaxRange: number;
    amount: number;
    percentage: number;
    setDeliveryFeeTo: string;
};

export type SystemSetting = {
    _id: string;
    settingCategory: string;
    settingUniqueName: string;
    settingName: string;
    settingValue: string;
    entityId: string;
    entityDetails: string;
};

export type SystemSettingDetail = {
    _id: string;
    settingCategory: string;
    settingUniqueName: string;
    settingName: string;
    settingValue: string;
    entityId: string;
    entityOptions?: any[]
};

export type SystemSettingValueDetail = {
    _id: string;
    settingCategory: string;
    settingUniqueName: string;
    settingName: string;
    settingValue: string;
    entityId: string;
    entityDetails?: any
};

export type Coupon = {
    _id: string;
    code: string;
    amount: number;
}

export type ShippingInfo = {
    name: string;
    primaryPhone: string;
    secondaryPhone: string;
    address: string;
    address2: string;
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
    variant: ProductVariantType | undefined;
}

export type OrderItemType = Omit<CartItemType, "stock"> & {
    _id: string;
}

export interface ProductUpdateFormData {
    nameUpdate: string;
    categoryUpdate: string;
    priceUpdate: number;
    stockUpdate: number;
    descriptionUpdate: string;
    variantsUpdate: ProductVariantType[];
}

export type CreateAddressFormData = {
    name: string;
    primaryPhone: string;
    secondaryPhone?: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    isDefault: boolean;
}

export type UpdateAddressFormData = {
    nameUpdate: string;
    primaryPhoneUpdate: string;
    secondaryPhoneUpdate?: string;
    addressUpdate: string;
    address2Update?: string;
    cityUpdate: string;
    stateUpdate: string;
    countryUpdate: string;
    pinCodeUpdate: string;
    isDefaultUpdate: boolean;
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
    createdAt: string;
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

export type ProductVariantType = {
    configuration: Configuration[];
    price: number;
    stock: number;
    _id?: string;
}

export interface Configuration {
    key: string;
    value: string;
}

export type CreateDeliveryRuleFormData = {
    ruleName: string;
    subtotalMinRange: number;
    subtotalMaxRange?: number;
    amount: number;
    percentage: number;
    setDeliveryFeeTo: string;
}

export type UpdateDeliveryRuleFormData = {
    ruleNameUpdate: string;
    subtotalMinRangeUpdate: number;
    subtotalMaxRangeUpdate?: number;
    amountUpdate: number;
    percentageUpdate: number;
    setDeliveryFeeToUpdate: string;
}

export type UpdateSystemSettingFormData = {
    entityIdUpdate: string;
    settingValueUpdate: string;
}