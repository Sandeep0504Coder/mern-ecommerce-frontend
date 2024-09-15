import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CartReducerInitialState } from "../../types/reducer.types";
import { CartItemType } from "../../types/types";

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
        addToCart: ( state, action: PayloadAction<CartItemType> ) => {
            state.loading = true;
            const index = state.cartItems.findIndex( ( item ) => item.productId === action.payload.productId );

            if( index !== -1 ){
                state.cartItems[ index ] = action.payload;
            } else {
                state.cartItems.push( action.payload );
            }
        
            state.loading = false;
        },
        removeFromCart: ( state, action:PayloadAction<string> ) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter( ( item ) => item.productId !== action.payload );
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
        }
    },
} );

export const { addToCart, removeFromCart, calculatePrice, applyDiscount } = cartReducer.actions;