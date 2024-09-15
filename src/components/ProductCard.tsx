import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItemType } from "../types/types";

type ProductProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItemType) => string | undefined;
}

const ProductCard = ({productId, photo, name,price,stock,handler}:ProductProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <button onClick={()=>handler({
          productId,
          photo,
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