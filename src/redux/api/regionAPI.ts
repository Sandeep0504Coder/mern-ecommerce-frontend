import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateRegionRequest, ManageStateRequest, MessageResponse, RegionDetailsResponse, RegionResoponse } from "../../types/api.types";

export const regionAPI = createApi( {
    reducerPath: "regionApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/region/` } ),
    tagTypes: ["regions"],
    endpoints: ( builder ) => ( {
        createRegion: builder.mutation<MessageResponse, CreateRegionRequest>( {
            query: ( { id, regionData } ) => ( {
                url: `new?id=${id}`,
                method: "POST",
                body: regionData,
            } ),
            invalidatesTags: [ "regions" ]
        } ),
        updateRegion: builder.mutation<MessageResponse, CreateRegionRequest & { regionId: string }>( {
            query: ( { id, regionId, regionData } ) => ( {
                url: `${regionId}?id=${id}`,
                method: "PUT",
                body: regionData,
            } ),
            invalidatesTags: [ "regions" ]
        } ),
        manageState: builder.mutation<MessageResponse, ManageStateRequest>( {
            query: ( { id, regionId, stateId, stateData } ) => ( {
                url: `manageState/regionId/${regionId}/stateId/${stateId}?id=${id}`,
                method: "PUT",
                body: stateData,
            } ),
            invalidatesTags: [ "regions" ]
        } ),
        removeState: builder.mutation<MessageResponse, {id: string; regionId: string; stateId: string}>( {
            query: ( { id, regionId, stateId } ) => ( {
                url: `removeState/regionId/${regionId}/stateId/${stateId}?id=${id}`,
                method: "PUT",
            } ),
            invalidatesTags: [ "regions" ]
        } ),
        deleteRegion: builder.mutation<MessageResponse,{ userId: string; regionId: string; }>( {
            query: ( { userId, regionId } ) => ( {
                url: `${regionId}?id=${userId}`,
                method: "DELETE"
            } ),
            invalidatesTags: [ "regions" ]
        } ),
        allRegions: builder.query<RegionResoponse, any>( {
            query: ( ) => `all`,
            providesTags: [ "regions" ],
        } ),
        regionDetails: builder.query<RegionDetailsResponse, {userId: string, regionId: string}>( {
            query: ( { userId, regionId } ) => `${regionId}?id=${userId}`,
            providesTags: [ "regions" ],
        } ),
    } ),
} );

export const {
    useCreateRegionMutation,
    useUpdateRegionMutation,
    useManageStateMutation,
    useRemoveStateMutation,
    useDeleteRegionMutation,
    useAllRegionsQuery,
    useRegionDetailsQuery
} = regionAPI;