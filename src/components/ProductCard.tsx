import { FaPlus } from "react-icons/fa";
import { CartItemType } from "../types/types";
import { GrView } from "react-icons/gr";
import { Link } from "react-router-dom";

type ProductProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItemType) => string | undefined;
}

const ProductCard = ({productId, photos, name,price,stock,handler}:ProductProps) => {
  return (
    <div className="product-card">
      <img src={photos?.[0]?.url} alt={name} />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <Link to={`/productDetails/${productId}`}>
          <GrView/>
        </Link>
        <button onClick={()=>handler({
          productId,
          photo: photos[0].url,
          name,
          price,
          stock,
          quantity: 1
        })}>
          <FaPlus/>
        </button>
      </div>
    </div>
  )
}

export default ProductCard