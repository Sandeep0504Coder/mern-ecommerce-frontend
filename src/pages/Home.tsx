import {Link} from "react-router-dom"
import ProductCard from "../components/ProductCard"
const Home = () => {
  const addToCartHandler = () => {}

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>
      <main>
        <ProductCard
          productId="qrqwtws"
          price={5000}
          name="Macbook"
          stock={455}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
        />
      </main>
    </div>
  )
}

export default Home