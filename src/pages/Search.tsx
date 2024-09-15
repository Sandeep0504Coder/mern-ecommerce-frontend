import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import { useAllCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI"
import { CustomError } from "../types/api.types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { server } from "../redux/store";
import { CartItemType } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
  const dispatch = useDispatch();
  const { data: categorieResponse, isLoading, isError, error } = useAllCategoriesQuery( "" );
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState(100000)
  const [category, setCategory] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const isNextPage = true;
  const isPrevPage = true;

  const { data: searchProductData, isLoading: isSearchProcessing, isError: productIsError, error: productError } = useSearchProductsQuery( {
    price: maxPrice,
    page,
    category,
    sort,
    search,
  } );

  const addToCartHandler = ( cartItem: CartItemType ) => {
    if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );

    dispatch( addToCart( cartItem ) );

    toast.success( `${cartItem.name} added to cart.` )
  }
  

  if( isError ) toast.error( ( error as CustomError ).data.message )
    if( productIsError ) toast.error( ( productError as CustomError ).data.message )

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: { maxPrice || ""}</h4>
          <input type="range" min={100} max={200000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
        </div>
        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">ALL</option>
            {!isLoading &&
              categorieResponse?.categories.map( ( category ) => (
              <option key={category} value={category}>{category.toUpperCase()}</option>
            ) )}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch((e.target.value))}/>
        
        { isSearchProcessing ? (
          <Skeleton length={10}/>
         ) : (
          <div className="search-product-list">
            {searchProductData?.products.map( ( product ) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                price={product.price}
                name={product.name}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            ) ) }
          </div>
        ) }
        { searchProductData && searchProductData.totalPage > 1 && (
          <article>
            <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            <span>
              {page} of {searchProductData?.totalPage}
            </span>
            <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </article>
        ) }
      </main>
    </div>
  )
}

export default Search