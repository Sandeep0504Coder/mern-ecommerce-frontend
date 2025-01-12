import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, SystemSettingDetailByUniqueNameResponse, SystemSettingDetailsResponse, SystemSettingResponse, UpdateSystemSettingRequest } from "../../types/api.types";

export const systemSettingAPI = createApi( {
    reducerPath: "systemSettingApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/systemSetting/` } ),
    tagTypes: ["systemSettings"],
    endpoints: ( builder ) => ( {
        updateSystemSetting: builder.mutation<MessageResponse, UpdateSystemSettingRequest>( {
            query: ( { userId, systemSettingId, updateSystemSettingData } ) => ( {
                url: `${systemSettingId}?id=${userId}`,
                method: "PUT",
                body: updateSystemSettingData,
            } ),
            invalidatesTags: [ "systemSettings" ]
        } ),
        allSystemSettings: builder.query<SystemSettingResponse, string>( {
            query: ( userId ) => `all?id=${userId}`,
            providesTags: [ "systemSettings" ],
        } ),
        systemSettingDetails: builder.query<SystemSettingDetailsResponse, {userId: string, systemSettingId: string}>( {
            query: ( { userId, systemSettingId } ) => `${systemSettingId}?id=${userId}`,
            providesTags: [ "systemSettings" ],
        } ),
        systemSettingDetailByUniqueName: builder.query<SystemSettingDetailByUniqueNameResponse, {settingUniqueName: string}>( {
            query: ( { settingUniqueName } ) => `settingDetails?settingUniqueName=${settingUniqueName}`,
            providesTags: [ "systemSettings" ],
        } ),
    } ),
} );

export const {
    useUpdateSystemSettingMutation,
    useAllSystemSettingsQuery,
    useSystemSettingDetailsQuery,
    useSystemSettingDetailByUniqueNameQuery
} = systemSettingAPI;