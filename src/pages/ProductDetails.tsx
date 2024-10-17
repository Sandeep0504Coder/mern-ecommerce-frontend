import { useProductDetailsQuery } from "../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../redux/store";
import { Skeleton } from "../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { CartItemType } from "../types/types";
import { useState } from "react";

const ProductDetails = () => {
    const dispatch = useDispatch( );
    const params = useParams();
    const navigate = useNavigate( );

    const [ itemQuantity ] = useState<number>( 1 );

    const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

    const { price, photo, name, stock, _id: productId, description } = data?.product || {
        price: 0,
        photo: "",
        name: "",
        stock: 0,
        category: "",
        _id: "",
        description: ""
    };

    const addToCartHandler = ( cartItem: CartItemType ) => {
        if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );
        
        dispatch( addToCart( cartItem ) );
        navigate( "/cart" );
        toast.success( `${cartItem.name} added to cart.` );
    }

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        <div className="container">
            <main className="product-management">
                {isLoading ? <Skeleton length={20}/> : (
                    <>
                        <section>
                            <img src={`${server}/${photo}`} alt="Product" />
                            {stock > 0 ? (
                                <span className="green">{stock} Available</span>
                            ) : (
                                <span className="red"> Not Available</span>
                            )}
                            <button className="addToCartButton" onClick={ ( ) => { addToCartHandler( {
                                productId,
                                photo,
                                name,
                                price,
                                stock,
                                quantity: itemQuantity
                            } ) } }>
                                ADD TO CART
                            </button>
                        </section>
                        <article>
                            <h2>{name}</h2>
                            <h3>₹{price}</h3>
                            <div className="product-description">
                                <h4>Description</h4>
                                <p>
                                    {description}
                                </p>
                            </div>
                        </article>
                    </>
                )}
            </main>
        </div>
    );
};

export default ProductDetails;
