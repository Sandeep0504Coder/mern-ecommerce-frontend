import {Link} from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/Loader"
const Home = () => {
  const addToCartHandler = () => {}
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
              handler={addToCartHandler}
              photo={product.photo}
            />
          )
        } )
      }
      </main>
    </div>
  )
}

export default Home