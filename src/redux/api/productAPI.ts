import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateProductRequest, DeleteProductRequest, MessageResponse, ProductCategoriesResponse, ProductDetailsResponse, ProductResponse, SearchProductRequest, SearchProductResponse, UpdateProductRequest } from "../../types/api.types";

export const productAPI = createApi( {
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery( { baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` } ),
    tagTypes: ["product", "allProducts"],
    endpoints: ( builder ) => ( {
        createProduct: builder.mutation<MessageResponse, CreateProductRequest>( {
            query: ( { id, formData } ) => ( {
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            } ),
            invalidatesTags: [ "allProducts" ]
        } ),
        updateProduct: builder.mutation<MessageResponse,UpdateProductRequest>( {
            query: ( { id, productId, formData } ) => ( {
                url: `${productId}?id=${id}`,
                method: "PUT",
                body: formData,
            } ),
            invalidatesTags: [ "product", "allProducts" ]
        } ),
        deleteProduct: builder.mutation<MessageResponse,DeleteProductRequest>( {
            query: ( { userId, productId } ) => ( {
                url: `${productId}?id=${userId}`,
                method: "DELETE"
            } ),
            invalidatesTags: [ "allProducts" ]
        } ),
        latestProducts: builder.query<ProductResponse, any>( {
            query: ( ) => "latest",
            providesTags: [ "allProducts" ],
        } ),
        allProducts: builder.query<ProductResponse, string>( {
            query: ( userId ) => `admin-products?id=${userId}`,
            providesTags: [ "allProducts" ],
        } ),
        allCategories: builder.query<ProductCategoriesResponse, string>( {
            query: ( ) => "categories",
            providesTags: [ "allProducts" ],
        } ),
        searchProducts: builder.query<SearchProductResponse, SearchProductRequest>( {
            query: ( data ) => {
                let url = "all";

                Object.entries( data ).forEach( ( [key,value], index ) => {
                    if( value ){
                        if( index === 0 ) {
                            url = url + `?${key}=${value}`;
                        } else {
                            url = url + `&${key}=${value}`;
                        }
                    }
                } );
                return url;
            },
            providesTags: [ "allProducts" ],
        } ),
        ProductDetails: builder.query<ProductDetailsResponse, string>( {
            query: ( productId ) => productId,
            providesTags: [ "product" ],
        } ),
    } ),
} );

export const {
    useLatestProductsQuery,
    useAllProductsQuery,
    useAllCategoriesQuery,
    useSearchProductsQuery,
    useCreateProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productAPI;