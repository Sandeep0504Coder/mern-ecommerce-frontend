import { useAddEditReviewMutation, useAllReviewsOfProductQuery, useDeleteReviewMutation, useProductDetailsQuery } from "../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, modifySelectedShippingAddress } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { Address, CartItemType, review } from "../types/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MyntraCarousel, Slider, CarouselButtonType, useRating  } from "6pp";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";
import { FiEdit } from "react-icons/fi";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/features";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useMyAddressesQuery } from "../redux/api/userAPI";

const ProductDetails = () => {
    const dispatch = useDispatch( );
    const params = useParams();
    const searchQuery = useSearchParams()[0];
    const navigate = useNavigate( );
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const { cartItems, selectedShippingAddressId } = useSelector( ( state: RootState ) => state.cartReducer );
    const [ selectedVariantId ] = useState<string>( searchQuery.get( "variantId" ) || "" );
    const [ itemQuantity, setItemQuantity ] = useState<number>( 1 );
    const [ carouselOpen, setCarouselOpen ] = useState<boolean>( false );
    const [ configChangeLoding, setConfigChangeLoding ] = useState<boolean>( false );
    const [ itemPresentInCart, setItemPresentInCart ] = useState<boolean>( false );
    const [ reviewComment, setReviewComment ] = useState<string>( "" );
    const [selectedConfig, setSelectedConfig] = useState<Record<string, string>>({});
    const [selectedAddress, setSelectedAddress] = useState<Address>({
        _id: "",
        name: "",
        primaryPhone: "",
        secondaryPhone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        user: "",
        isDefault: false,
    });
    const reviewDialogRef = useRef<HTMLDialogElement>( null );
    const selectDeliveryAddressRef = useRef<HTMLDialogElement>( null );

    const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

    const reviewsResponse = useAllReviewsOfProductQuery( params.id! );

    const myAddressesResponse = useMyAddressesQuery( user?._id! );

    const [ addEditReview ] = useAddEditReviewMutation( );

    const [ deleteReview ] = useDeleteReviewMutation( );

    const { Ratings: RatingsEditable, rating, setRating } = useRating( {
        IconFilled:<FaStar/>,
        IconOutline: <FaRegStar/>,
        value: 0,
        selectable: true,
        styles: {
            fontSize: "1.5rem",
            color: "coral",
            justifyContent: "flex-start"
        }
    } );

    const { price, photos, name, stock, category, _id: productId, description, ratings, numOfReviews, suggestedItems, variants } = data?.product || {
        price: 0,
        photos: [],
        name: "",
        stock: 0,
        category: "",
        _id: "",
        description: "",
        ratings: 0,
        numOfReviews: 0,
        suggestedItems:[],
        variants: []
    };

    // Extract unique configurations and their values
    const uniqueConfigurations = variants.reduce((acc, variant) => {
        variant.configuration.forEach(({ key, value }) => {
            if (!acc[key]) acc[key] = new Set();
            acc[key].add(value);
        });
        return acc;
    }, {} as Record<string, Set<string>>);

    // Transform sets into arrays for rendering
    const configurations = Object.entries(uniqueConfigurations).reduce(
        (acc, [key, valueSet]) => {
            acc[key] = Array.from(valueSet);
            return acc;
        },
        {} as Record<string, string[]>
    );

    // Filter variants based on selected configuration
    const filteredVariant = variants.find((variant) =>
        variant.configuration.every(({ key, value }) => selectedConfig[key] === value)
    );

    let  selectedConfigName = "";

    filteredVariant?.configuration?.forEach( ( config, index )=> {
        if( index == 0 ){
            selectedConfigName += " ( ";
        }
        
        selectedConfigName +=`${config.value.toUpperCase( )} ${!( config.key.toUpperCase() == "COLOR" || config.key.toUpperCase() == "DISPLAY SIZE" ) ? config.key.toUpperCase( ) : ""}`;

        if( index != filteredVariant.configuration.length - 1 ){
            selectedConfigName += ", "; 
        } else {
            selectedConfigName += " )";
        }
    } );

    useEffect(() => {
        if (!filteredVariant) {
            const configurationKeys = Object.keys(configurations); // Prioritized configuration keys (order matters)
    
            // Find the closest valid variant based on priority
            const closestVariant = variants.reduce<{
                variant: typeof variants[0] | null;
                score: number;
            }>(
                (bestVariant, currentVariant) => {
                    const currentScore = currentVariant.configuration.reduce((score, { key, value }) => {
                        const keyPriority = configurationKeys.indexOf(key);
                        if (keyPriority !== -1 && selectedConfig[key] === value) {
                            score += configurationKeys.length - keyPriority; // Higher score for higher priority
                        }
                        return score;
                    }, 0);
    
                    const bestScore = bestVariant?.score || 0;
                    if (currentScore > bestScore) {
                        return { variant: currentVariant, score: currentScore };
                    }
                    return bestVariant;
                },
                { variant: null, score: 0 } // Initial state
            );
    
            if (closestVariant.variant) {
                const validConfig = closestVariant.variant.configuration.reduce<Record<string, string>>(
                    (acc, { key, value }) => ({ ...acc, [key]: value }),
                    {}
                );
                setSelectedConfig(validConfig);
            }
        }
    }, [filteredVariant, selectedConfig, configurations, variants]);

    const handleConfigurationChange = (key: string, value: string) => {
        setSelectedConfig((prev) => {
            const updatedConfig = { ...prev, [key]: value };
            return updatedConfig;
        });
    };
    
    useEffect( ( ) => {
        setConfigChangeLoding( true );
        if( itemQuantity > filteredVariant?.stock!  ){
            setItemQuantity( filteredVariant?.stock! );
        }

        const existingItemIndex = cartItems.findIndex( ( item ) => {
            if( item.productId === data?.product._id ){
                if( item.variant ){
                    return item.variant._id === filteredVariant?._id;
                } else {
                    return true;
                }
            }

            return false;
        } );

        if( existingItemIndex !== -1 ){
            setItemPresentInCart( true );
            setItemQuantity( cartItems[ existingItemIndex ].quantity );
        } else {
            setItemPresentInCart( false );
            setItemQuantity( 1 );
        }

        const timeOutId = setTimeout( function( ){
            setConfigChangeLoding( false );
        }, 1000 );

        return ( ) => {
            clearTimeout( timeOutId );
        }
    }, [ data, filteredVariant ] );

    const addToCartHandler = ( cartItem: CartItemType ) => {
        if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );
        if( cartItem.stock < cartItem.quantity ) return toast.error( "Exceeds available Stock." );
        
        dispatch( addToCart( {
            ...cartItem,
            updateItemIfFound: true,
        } ) );
        navigate( "/cart" );
    }

    const closeReviewDialog = ( ) => {
        reviewDialogRef.current?.close( );
        setRating( 0 );
        setReviewComment( "" );
    }

    const closeSelectAddressDialog = ( ) => {
        selectDeliveryAddressRef.current?.close( );
    }

    const handleSelectedAddressChange = ( addressId: string ) => {
        dispatch( modifySelectedShippingAddress( addressId ) );

        let selectedAddress = myAddressesResponse.data?.addresses.filter( ( address ) => address._id == addressId );

        if( selectedAddress ){
            setSelectedAddress( selectedAddress[0] );
        }

        closeSelectAddressDialog();
    };

    const addEditReviewHandler = async (e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault( );
        reviewDialogRef.current?.close( );

        try{
            if( !rating ){
                return;
            }

            const res = await addEditReview( {
                userId: user?._id,
                productId: params.id!,
                comment: reviewComment,
                rating
            } );

            setRating( 0 );
            setReviewComment( "" );

            responseToast( res, null, "" );
        } catch( error ){
            console.log( error );
        }
    }

    const deleteReviewHandler = async( reviewId: string ) => {
        try {
            const res = await deleteReview( {
                userId: user?._id,
                reviewId
            } );

            responseToast( res, null, "" );
        } catch( error ){
            console.log( error );
        }
    }

    const showReviewDialog = ( ) => {
        reviewDialogRef.current?.showModal( );
    }

    const showSelectAddressDialog = ( ) => {
        selectDeliveryAddressRef.current?.showModal( );
    }

    useEffect( function( ){
        variants[0]?.configuration.forEach( ( config ) => {
            handleConfigurationChange( config.key, config.value );
        } ) 
    },[ variants ] );

    useEffect( function( ){
        const selectedConfiguration = variants.find( ( variant ) => selectedVariantId == variant._id )?.configuration

        if( selectedConfiguration && selectedConfiguration.length ){
            selectedConfiguration.forEach( ( { key, value } ) => handleConfigurationChange( key, value ) );
        }
    },[ selectedVariantId, variants ] );

    useEffect( function( ){
        // dispatch( modifySelectedShippingAddress( "" ) )
        if( "data" in myAddressesResponse ){
            if( selectedShippingAddressId.length > 0 ){
                var selectedAddress = myAddressesResponse.data?.addresses.filter( ( address ) =>  address._id == selectedShippingAddressId );

                if( selectedAddress && selectedAddress.length > 0 ){
                    setSelectedAddress( selectedAddress[0] );
                }
            } else {
                var defaultAddress = myAddressesResponse.data?.addresses.filter( ( address ) => address.isDefault );

                if( defaultAddress && defaultAddress.length > 0 ){
                    setSelectedAddress( defaultAddress[0] );
                }
            }
        }
    },[ myAddressesResponse?.data ] );

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        <div className="product-details">
            { ( isLoading || configChangeLoding || myAddressesResponse.isLoading ) ? <ProductLoader/> : (
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
                            <code>{category.toUpperCase( )}</code>
                            <h1>{`${name}${selectedConfigName}`}</h1>
                            <em style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                                <RatingsComponent value={ratings}/>
                                {numOfReviews} reviews
                            </em>
                            <article>
                                <div>
                                    <button disabled={itemQuantity <= 1} onClick={ ( ) => { setItemQuantity( itemQuantity - 1 ) } }>-</button>
                                    <span>{itemQuantity}</span>
                                    <button disabled={itemQuantity >= 9999} onClick={ ( ) => {
                                        if(  itemQuantity === ( filteredVariant?.stock || stock ) ) return toast.error( `${filteredVariant?.stock || stock} available only` );
                                        setItemQuantity( itemQuantity + 1 );
                                    } }>+</button>
                                </div>
                                <button onClick={ ( ) => { addToCartHandler( {
                                    productId,
                                    photo: photos[0].url,
                                    name,
                                    price: filteredVariant?.price || price,
                                    stock: filteredVariant?.stock || stock,
                                    quantity: itemQuantity,
                                    variant: filteredVariant || undefined,
                                } ) } }>
                                    {itemPresentInCart ? "UPDATE CART" : "ADD TO CART"}
                                </button>
                            </article>
                            <h3>${filteredVariant?.price || price}</h3>
                            {Object.entries(configurations).map(([key, values]) => (
                                <div key={key} className="productDetailsElement">
                                    <label className="variantConfigLabel"><b>{key.toUpperCase()}</b></label>
                                    <div className="variantConfigValues">
                                        {values.map((value) => {
                                            const isSelected = selectedConfig[key] === value;
                                            return (
                                            <label key={value} style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", padding:"2px", minWidth: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${isSelected ? "blue" : "black"}`,
                                            color: isSelected ? "blue" : "black", }}>
                                                <input
                                                    type="radio"
                                                    name={key}
                                                    value={value}
                                                    checked={selectedConfig[key] === value}
                                                    onChange={() => handleConfigurationChange(key, value)}
                                                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                                                />
                                                {value}
                                            </label>
                                        )})}
                                    </div>
                                </div>
                            ))}
                            {
                                user !== null && selectedAddress._id != "" && (
                                    <div className="productDetailsElement">
                                        <label className="deliveryLabel"><b>Deliver to: </b></label>
                                        <div className="selected-delivery-address">
                                            <p style={{marginTop: 0, fontWeight:500}}>{`${selectedAddress.name}, ${selectedAddress.pinCode}`}</p>
                                            <p>{`${selectedAddress.address}, ${selectedAddress.address2} ${selectedAddress.address2.length ? "," : ""} ${selectedAddress.city}, ${selectedAddress.state}`}</p>
                                        </div>
                                        <button className="addressChangeBtn" onClick={showSelectAddressDialog}>Change</button>
                                    </div>
                                )
                            }
                            <div className="productDetailsElement">
                                <label className="descriptionLabel"><b>Description: </b></label>
                                <div className="productDescription">{description}</div>
                            </div>
                        </section>
                    </main>
                </>
            )}

            <dialog ref={reviewDialogRef} className="review-dialog">
                <button onClick={closeReviewDialog}>X</button>
                <h2>Write a Review</h2>
                <form onSubmit={addEditReviewHandler}>
                    <textarea placeholder="Review..." value={reviewComment} onChange={(e)=>{setReviewComment(e.target.value)}}></textarea>
                    <RatingsEditable/>
                    <button type="submit">
                        Submit
                    </button>
                </form>
            </dialog>
            <dialog ref={selectDeliveryAddressRef} className="review-dialog">
                <button onClick={closeSelectAddressDialog}>X</button>
                <h2>Select Delivery Address</h2>
                { myAddressesResponse.isLoading ? <></> : (
                    <div>
                        {myAddressesResponse.data?.addresses.map(( { _id, name, pinCode, address, address2, city, state, isDefault } ) => {
                            let isSelected = selectedShippingAddressId.length > 0 ? selectedShippingAddressId === _id : isDefault;
                            
                            return (
                            <label key={_id} style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", padding: "1rem", flexDirection: "column",
                                margin: "1rem 0", borderRadius: "0.5rem",  border: `2px solid ${isSelected ? "blue" : "black"}`,
                                color: isSelected ? "blue" : "black", }}>
                                <input
                                    type="radio"
                                    name="shippingAddress"
                                    value={_id}
                                    checked={isSelected}
                                    onChange={() => handleSelectedAddressChange(_id)}
                                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                                />
                                <p style={{marginTop: 0, fontWeight:500}}>{`${name}, ${pinCode}`}</p>
                                <p>{`${address}, ${address2} ${address2.length ? "," : ""} ${city}, ${state}`}</p>
                            </label>
                        )})}
                    </div>
                ) }
            </dialog>
            <section>
                <article>
                    <h2>Frequently Bought Together</h2>
                </article>
                <div className="product-recommendation">
                    {
                        isLoading ? (
                            <>
                                <Skeleton width="45rem" length={5}/>
                                <Skeleton width="45rem" length={5}/>
                                <Skeleton width="45rem" length={5}/>
                            </>
                        ) : (
                            suggestedItems?.map( ( product ) => {
                                    return (
                                      <ProductCard
                                        key={product.productId._id}
                                        productId={product.productId._id}
                                        price={product.productId.variants?.[0]?.price || product.productId.price}
                                        name={product.productId.name}
                                        stock={product.productId.variants?.[0]?.stock || product.productId.stock}
                                        photos={product.productId.photos}
                                        variants={product.productId.variants}
                                        handler={addToCartHandler}
                                      />
                                    )
                                  } 
                            )
                        )
                    }
                </div>
            </section>
            <section>
                <article>
                    <h2>Reviews</h2>
                    { ( reviewsResponse.isLoading ) ? null : (
                        user && (
                            <button onClick={showReviewDialog}>
                                <FiEdit/>
                            </button>
                        )
                    ) }
                </article>
                <div
                    style={{
                        display: "flex",
                        gap: "2rem",
                        overflowX: "auto",
                        padding: "2rem",
                    }}
                >
                    {
                        reviewsResponse.isLoading ? (
                            <>
                                <Skeleton width="45rem" length={5}/>
                                <Skeleton width="45rem" length={5}/>
                                <Skeleton width="45rem" length={5}/>
                            </>
                        ) : (
                            reviewsResponse.data?.reviews.map( ( review ) => (
                                <ReviewCard key={review._id} deleteReviewHandler={deleteReviewHandler} userId={user?._id} review={review}/> 
                            ) )
                        )
                    }
                </div>
            </section>
        </div>
    );
};

const ProductLoader = () => {
    return <div style={{
        display: "flex",
        gap: "2rem",
        height: "135vh",
    }}>
        <section style={{ width: "100%", height: "50%" }}>
            <Skeleton width="100%" containerHeight="100%" height="100%" length={1} />
        </section>
        <section style={{width: "100%", display: "flex", flexDirection: "column", gap: "4rem", padding: "2rem" }}>
            <Skeleton width="40%" length={3} />
            <Skeleton width="50%" length={4} />
            <Skeleton width="100%" length={2} />
            <Skeleton width="100%" length={10} />
        </section>
    </div>
}

const ReviewCard = ( { review, userId, deleteReviewHandler }: { review: review, userId?: string, deleteReviewHandler: ( reviewId: string ) => void } ) => (
    <div className="review">
        <RatingsComponent value={review.rating}/>
        <p>{review.comment}</p>
        <div>
            <img src={review.user.photo} alt="User"/>
            <small>{review.user.name}</small>
        </div>
        { review.user._id === userId && <button onClick={()=>{deleteReviewHandler( review._id )}} >
            <FaTrash/>
        </button> }
        
    </div>
);

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
