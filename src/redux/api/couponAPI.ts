import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CouponResonse, CreateCouponRequest, DeleteCouponRequest, MessageResponse } from "../../types/api.types";

export const couponAPI = createApi( {
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/` } ),
    tagTypes: ["coupon"],
    endpoints: ( builder ) => ( {
        createCoupon: builder.mutation<MessageResponse, CreateCouponRequest>( {
            query: ( { id, formData } ) => {
                console.log(formData)
                return{
                url: `new?id=${id}`,
                method: "POST",
                body: {
                    coupon: formData.get( "coupon" ),
                    amount: formData.get( "amount" ),
                }
            } },
            invalidatesTags: [ "coupon" ]
        } ),
        deleteCoupon: builder.mutation<MessageResponse,DeleteCouponRequest>( {
            query: ( { userId, couponId } ) => ( {
                url: `${couponId}?id=${userId}`,
                method: "DELETE"
            } ),
            invalidatesTags: [ "coupon" ]
        } ),
        allCoupons: builder.query<CouponResonse, string>( {
            query: ( id ) => `all?id=${id}`,
            providesTags: [ "coupon" ]
        } ),
    } ),
} );

export const {
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useAllCouponsQuery,
} = couponAPI;