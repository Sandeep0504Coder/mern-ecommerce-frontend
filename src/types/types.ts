export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}

export interface Product {
    name: string;
    photo: string;
    category: string;
    price: number;
    stock: number;
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