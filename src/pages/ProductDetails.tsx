import { useAddEditReviewMutation, useAllReviewsOfProductQuery, useDeleteReviewMutation, useProductDetailsQuery } from "../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { CartItemType, review } from "../types/types";
import { FormEvent, useRef, useState } from "react";
import { MyntraCarousel, Slider, CarouselButtonType, useRating  } from "6pp";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";
import { FiEdit } from "react-icons/fi";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/features";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";

const ProductDetails = () => {
    const dispatch = useDispatch( );
    const params = useParams();
    const navigate = useNavigate( );
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ itemQuantity, setItemQuantity ] = useState<number>( 1 );
    const [ carouselOpen, setCarouselOpen ] = useState<boolean>( false );
    const [ reviewComment, setReviewComment ] = useState<string>( "" );
    const reviewDialogRef = useRef<HTMLDialogElement>( null );

    const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

    const reviewsResponse = useAllReviewsOfProductQuery( params.id! );

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

    const { price, photos, name, stock, category, _id: productId, description, ratings, numOfReviews } = data?.product || {
        price: 0,
        photos: [],
        name: "",
        stock: 0,
        category: "",
        _id: "",
        description: "",
        ratings: 0,
        numOfReviews: 0
    };

    const addToCartHandler = ( cartItem: CartItemType ) => {
        if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );
        if( cartItem.stock < cartItem.quantity ) return toast.error( "Exceeds available Stock." );
        
        dispatch( addToCart( cartItem ) );
        navigate( "/cart" );
        toast.success( `${cartItem.name} added to cart.` );
    }

    const closeReviewDialog = ( ) => {
        reviewDialogRef.current?.close( );
        setRating( 0 );
        setReviewComment( "" );
    }

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
                            <code>{category}</code>
                            <h1>{name}</h1>
                            <em style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                                <RatingsComponent value={ratings}/>
                                {numOfReviews} reviews
                            </em>
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

            <section>
                <article>
                    <h2>Reviews</h2>
                    {reviewsResponse.isLoading ? null : (
                        <button onClick={showReviewDialog}>
                            <FiEdit/>
                        </button>
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
        height: "80vh",
    }}>
        <section style={{ width: "100%", height: "100%" }}>
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
