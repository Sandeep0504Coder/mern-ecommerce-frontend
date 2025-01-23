import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HomePageContentDetailsResponse, HomePageContentResponse, MessageResponse, UpdateHomePageContentRequest } from "../../types/api.types";

export const homePageContentAPI = createApi( {
    reducerPath: "homePageContentApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/homePageContent/` } ),
    tagTypes: ["homePageContent"],
    endpoints: ( builder ) => ( {
        updateHomePageContent: builder.mutation<MessageResponse, UpdateHomePageContentRequest>( {
            query: ( { userId, homePageContentId, formData } ) => ( {
                url: `${homePageContentId}?id=${userId}`,
                method: "PUT",
                body: formData,
            } ),
            invalidatesTags: [ "homePageContent" ]
        } ),
        allHomePageContents: builder.query<HomePageContentResponse, string>( {
            query: ( userId ) => `all?id=${userId}`,
            providesTags: [ "homePageContent" ],
        } ),
        homePageContentDetails: builder.query<HomePageContentDetailsResponse, {userId: string, homePageContentId: string}>( {
            query: ( { userId, homePageContentId } ) => `${homePageContentId}?id=${userId}`,
            providesTags: [ "homePageContent" ],
        } ),
        heroSectionDetails: builder.query<HomePageContentDetailsResponse, any>( {
            query: ( ) => `hero`,
            providesTags: [ "homePageContent" ],
        } ),
    } ),
} );

export const {
    useUpdateHomePageContentMutation,
    useAllHomePageContentsQuery,
    useHomePageContentDetailsQuery,
    useHeroSectionDetailsQuery
} = homePageContentAPI;