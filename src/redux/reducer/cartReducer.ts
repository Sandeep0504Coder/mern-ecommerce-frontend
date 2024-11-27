import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CartReducerInitialState } from "../../types/reducer.types";
import { CartItemType, ShippingInfo } from "../../types/types";
import toast from "react-hot-toast";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    },
}

export const cartReducer = createSlice( {
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: ( state, action: PayloadAction<CartItemType & { updateItemIfFound: boolean; }> ) => {
            state.loading = true;

            // Check if the product with the same variant already exists
            const existingItemIndex = state.cartItems.findIndex( ( item ) => {
                if( item.productId === action.payload.productId ){
                    if( item.variant ){
                        return item.variant._id === action.payload.variant?._id;
                    } else {
                        return true;
                    }
                }
            } );

            if( existingItemIndex !== -1 ){
                if( action.payload.updateItemIfFound ){
                    state.cartItems[ existingItemIndex ] = {
                        productId: action.payload.productId,
                        photo: action.payload.photo,
                        name: action.payload.name,
                        price: action.payload.price,
                        quantity: action.payload.quantity,
                        stock: action.payload.stock,
                        variant: action.payload.variant,
                    };
                    toast.success( `${action.payload.name} updated.` );
                } else {
                    toast( `${action.payload.name} already present in the cart please check the cart to update the item.` );
                }
            } else {
                state.cartItems.push( {
                    productId: action.payload.productId,
                    photo: action.payload.photo,
                    name: action.payload.name,
                    price: action.payload.price,
                    quantity: action.payload.quantity,
                    stock: action.payload.stock,
                    variant: action.payload.variant,
                } );

                toast.success( `${action.payload.name} added to cart.` )
            }
        
            state.loading = false;
        },
        removeFromCart: ( state, action:PayloadAction<{productId: string, variantId: string}> ) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter( ( item ) => {
                if( action.payload.variantId === "" ){
                    return item.productId !== action.payload.productId;
                } else {
                    return !( item.productId === action.payload.productId && item.variant?._id === action.payload.variantId );
                }
            } );
            state.loading = false;
        },
        calculatePrice: ( state ) => {
            state.subtotal = state.cartItems.reduce( ( prevState, item ) => prevState + item.price * item.quantity, 0 );
            state.shippingCharges = ( state.subtotal > 1000 || state.subtotal === 0 ) ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        },
        applyDiscount: ( state, action:PayloadAction<number> ) => {
            state.discount = action.payload;
        },
        saveShippingInfo: ( state, action:PayloadAction<ShippingInfo> ) => {
            state.shippingInfo = action.payload;
        },
        resetCart: ( ) => initialState,
    },
} );

export const { addToCart, removeFromCart, calculatePrice, applyDiscount, saveShippingInfo, resetCart } = cartReducer.actions;