import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AddressDetailsResponse, AllUsersResponse, CreateAddressRequest, DeleteUserRequest, MessageResponse, MyAddressesResponse, UserResponse } from "../../types/api.types";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI = createApi( {
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` } ),
    tagTypes: [ "users", "address" ],
    endpoints: ( builder ) => ( {
        login: builder.mutation<MessageResponse, User>( {
            query: ( user ) => ( {
                url: "new",
                method: "POST",
                body: user,
            } ),
            invalidatesTags: [ "users" ]
        } ),
        deleteUser: builder.mutation<MessageResponse,DeleteUserRequest>( {
            query: ( { userId, adminUserId } ) => ( {
                url: `${userId}?id=${adminUserId}`,
                method: "DELETE"
            } ),
            invalidatesTags: [ "users" ]
        } ),
        allUsers: builder.query<AllUsersResponse, string>( {
            query: ( userId ) => `all?id=${userId}`,
            providesTags: [ "users" ]
        } ),
        creatAddress: builder.mutation< MessageResponse, CreateAddressRequest >( {
            query: ( { id, addressData } ) => {
                return {
                url: `address/new?id=${id}`,
                body: addressData,
                method: "POST"
            } },
            invalidatesTags: [ "address" ] 
        } ),
        updateAddress: builder.mutation<MessageResponse, CreateAddressRequest & { addressId: string }>( {
            query: ( { id, addressId, addressData } ) => {
                return {
                url: `address/${addressId}?id=${id}`,
                body: addressData,
                method: "PUT"
            } },
            invalidatesTags: [ "address" ]
        } ),
        deleteAddress: builder.mutation<MessageResponse, { addressId: string, userId: string }>( {
            query: ( { userId, addressId } ) => {
                return {
                url: `address/${addressId}?id=${userId}`,
                method: "DELETE"
            } },
            invalidatesTags: [ "address" ]
        } ),
        myAddresses: builder.query<MyAddressesResponse, string>( {
            query: ( userId ) => `address/my?id=${userId}`,
            providesTags: [ "address" ]
        } ),
        addressDetails: builder.query<AddressDetailsResponse, string>( {
            query: ( addressId ) => `address/${addressId}`,
            providesTags: [ "address" ]
        } ),
    } ),
} );

export const getUser = async( id: string ) => {
    try{
        const { data }: { data: UserResponse } = await axios.get( `${import.meta.env.VITE_SERVER}/api/v1/user/${id}` );

        return data;
    } catch( e ){
        throw e;
    }
}

export const {
    useLoginMutation,
    useAllUsersQuery,
    useDeleteUserMutation,
    useCreatAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useMyAddressesQuery,
    useAddressDetailsQuery
} = userAPI;