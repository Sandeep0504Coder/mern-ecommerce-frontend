import {Link} from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/Loader"
import { CartItemType } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"
const Home = () => {
  const dispatch = useDispatch();

  const addToCartHandler = ( cartItem: CartItemType ) => {
    if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );

    dispatch( addToCart( cartItem ) );

    toast.success( `${cartItem.name} added to cart.` )
  }
  
  const{ data, isLoading, isError } = useLatestProductsQuery( "" );

  if( isError ) toast.error( "Cannot fetch the products" );

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>
      <main>
      {
        isLoading ? <Skeleton width="80vw"/> : data?.products?.map( ( product ) => {
          return (
            <ProductCard
              key={product._id}
              productId={product._id}
              price={product.price}
              name={product.name}
              stock={product.stock}
              photos={product.photos}
              handler={addToCartHandler}
            />
          )
        } )
      }
      </main>
    </div>
  )
}

export default Home