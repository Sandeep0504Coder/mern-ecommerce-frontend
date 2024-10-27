import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CouponDetailsRequest, CouponDetailsResonse, CouponResonse, CreateCouponRequest, DeleteCouponRequest, MessageResponse, UpdateCouponRequest } from "../../types/api.types";

export const couponAPI = createApi( {
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/` } ),
    tagTypes: ["coupon"],
    endpoints: ( builder ) => ( {
        createCoupon: builder.mutation<MessageResponse, CreateCouponRequest>( {
            query: ( { id, formData } ) => {
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
        updateCoupon:  builder.mutation<MessageResponse, UpdateCouponRequest>( {
            query: ( { userId, couponId, formData } ) => {
                return{
                url: `${couponId}?id=${userId}`,
                method: "PUT",
                body: {
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
        couponDetails: builder.query<CouponDetailsResonse, CouponDetailsRequest>( {
            query: ( { userId, couponId } ) => `${couponId}?id=${userId}`,
            providesTags: [ "coupon" ]
        } ),
    } ),
} );

export const {
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useAllCouponsQuery,
    useCouponDetailsQuery
} = couponAPI;