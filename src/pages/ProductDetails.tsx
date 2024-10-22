import { useProductDetailsQuery } from "../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { CartItemType } from "../types/types";
import { useState } from "react";
import { MyntraCarousel, Slider, CarouselButtonType  } from "6pp";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";

const ProductDetails = () => {
    const dispatch = useDispatch( );
    const params = useParams();
    const navigate = useNavigate( );

    const [ itemQuantity, setItemQuantity ] = useState<number>( 1 );
    const [ carouselOpen, setCarouselOpen ] = useState<boolean>( false );

    const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

    const { price, photos, name, stock, category, _id: productId, description } = data?.product || {
        price: 0,
        photos: [],
        name: "",
        stock: 0,
        category: "",
        _id: "",
        description: ""
    };

    const addToCartHandler = ( cartItem: CartItemType ) => {
        if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );
        if( cartItem.stock < cartItem.quantity ) return toast.error( "Exceeds available Stock." );
        
        dispatch( addToCart( cartItem ) );
        navigate( "/cart" );
        toast.success( `${cartItem.name} added to cart.` );
    }

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        <div className="product-details">
            {isLoading ? <ProductLoader/> : (
                <>
                    <main>
                        <section>
                            <Slider showThumbnails showNav={false} onClick={() => setCarouselOpen( true )} images={data?.product?.photos.map( i => i.url ) || []}/>
                            {
                                carouselOpen && (
                                    <MyntraCarousel
                                        darkMode
                                        NextButton={NextButton}
                                        PrevButton={PrevButton}
                                        setIsOpen={setCarouselOpen}
                                        images={data?.product?.photos.map( i => i.url ) || []}
                                    />
                                )
                            }
                        </section>
                        <section>
                            <h1>{name}</h1>
                            <code>{category}</code>
                            <RatingsComponent value={4}/>
                            <article>
                                <div>
                                    <button disabled={itemQuantity <= 1} onClick={ ( ) => { setItemQuantity( itemQuantity - 1 ) } }>-</button>
                                    <span>{itemQuantity}</span>
                                    <button disabled={itemQuantity >= 9999} onClick={ ( ) => {
                                        if( stock === itemQuantity ) return toast.error( `${stock} available only` );
                                        setItemQuantity( itemQuantity + 1 );
                                    } }>+</button>
                                </div>
                                <button onClick={ ( ) => { addToCartHandler( {
                                    productId,
                                    photo: photos[0].url,
                                    name,
                                    price,
                                    stock,
                                    quantity: itemQuantity
                                } ) } }>
                                    ADD TO CART
                                </button>
                            </article>
                            <h3>₹{price}</h3>
                            <p>
                                {description}
                            </p>
                        </section>
                    </main>
                </>
            )}
        </div>
    );
};

const ProductLoader = () => {
    return <div style={{
        display: "flex",
        gap: "2rem",
    }}>
        <section style={{ width: "100%", height: "100%" }}>
            <Skeleton width="100%" containerHeight="100%" height="100%" length={1} />
        </section>
        <section style={{width: "100%", display: "flex", flexDirection: "column", gap: "4rem", padding: "2rem" }}>
            <Skeleton width="100%" length={3} />
            <Skeleton width="100%" length={4} />
            <Skeleton width="100%" length={4} />

        </section>
    </div>
}

const NextButton: CarouselButtonType = ( { onClick } ) => (
    <button className="carousel-btn" onClick={onClick}>
        <FaArrowRightLong/>
    </button>
);

const PrevButton: CarouselButtonType = ( { onClick } ) => (
    <button className="carousel-btn" onClick={onClick}>
        <FaArrowLeftLong/>
    </button>
);

export default ProductDetails;
