import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderAPI } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";
import { couponAPI } from "./api/couponAPI";

export const server = import.meta.env.VITE_SERVER;

// Configuration for Redux Persist
const cartPersistConfig = {
    key: "cart",
    storage, // Use localStorage for persistence
};

// Wrap the cart reducer with persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer.reducer);

export const store = configureStore( {
    reducer: {
        [ userAPI.reducerPath ]: userAPI.reducer,
        [ productAPI.reducerPath ]: productAPI.reducer,
        [ orderAPI.reducerPath ]: orderAPI.reducer,
        [ dashboardApi.reducerPath ]: dashboardApi.reducer,
        [ couponAPI.reducerPath ]: couponAPI.reducer,
        [ userReducer.name ]: userReducer.reducer,
        [ cartReducer.name ]: persistedCartReducer, // Use the persisted reducer for cart
    },
    middleware: ( defaultMiddleware ) => defaultMiddleware( ).concat( [
        userAPI.middleware,
        productAPI.middleware,
        orderAPI.middleware,
        dashboardApi.middleware,
        couponAPI.middleware,
    ] ),
} );

// Create a persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
