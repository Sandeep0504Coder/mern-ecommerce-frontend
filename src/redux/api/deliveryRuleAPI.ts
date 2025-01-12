import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateDeliveryRuleRequest, DeliveryRuleDetailsResponse, DeliveryRuleResponse, MessageResponse } from "../../types/api.types";

export const deliveryRuleAPI = createApi( {
    reducerPath: "deliveryRuleApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/deliveryRule/` } ),
    tagTypes: ["deliveryRules"],
    endpoints: ( builder ) => ( {
        createDeliveryRule: builder.mutation<MessageResponse, CreateDeliveryRuleRequest>( {
            query: ( { id, deliveryRuleData } ) => ( {
                url: `new?id=${id}`,
                method: "POST",
                body: deliveryRuleData,
            } ),
            invalidatesTags: [ "deliveryRules" ]
        } ),
        updateDeliveryRule: builder.mutation<MessageResponse,CreateDeliveryRuleRequest & { deliveryRuleId: string }>( {
            query: ( { id, deliveryRuleId, deliveryRuleData } ) => ( {
                url: `${deliveryRuleId}?id=${id}`,
                method: "PUT",
                body: deliveryRuleData,
            } ),
            invalidatesTags: [ "deliveryRules" ]
        } ),
        deleteDeliveryRule: builder.mutation<MessageResponse,{ userId: string; deliveryRuleId: string; }>( {
            query: ( { userId, deliveryRuleId } ) => ( {
                url: `${deliveryRuleId}?id=${userId}`,
                method: "DELETE"
            } ),
            invalidatesTags: [ "deliveryRules" ]
        } ),
        allDeliveryRules: builder.query<DeliveryRuleResponse, string>( {
            query: ( userId ) => `all?id=${userId}`,
            providesTags: [ "deliveryRules" ],
        } ),
        deliveryRuleDetails: builder.query<DeliveryRuleDetailsResponse, {userId: string, deliveryRuleId: string}>( {
            query: ( { userId, deliveryRuleId } ) => `${deliveryRuleId}?id=${userId}`,
            providesTags: [ "deliveryRules" ],
        } ),
    } ),
} );

export const {
    useCreateDeliveryRuleMutation,
    useUpdateDeliveryRuleMutation,
    useDeleteDeliveryRuleMutation,
    useAllDeliveryRulesQuery,
    useDeliveryRuleDetailsQuery,
} = deliveryRuleAPI;