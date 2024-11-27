import { FaPlus } from "react-icons/fa";
import { CartItemType, ProductVariantType } from "../types/types";
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
  variants: ProductVariantType[];
  handler: (cartItem: CartItemType) => string | undefined;
}

const ProductCard = ({productId, photos, name,price,stock, variants, handler}:ProductProps) => {
  let  selectedConfigName = "";

  variants?.[0]?.configuration?.forEach( ( config, index )=> {
    if( index == 0 ){
      selectedConfigName += " ( ";
    }
    selectedConfigName +=`${config.value.toUpperCase( )} ${config.key.toUpperCase() != "COLOR" ? config.key.toUpperCase( ) : ""}`;

    if( index != variants[0].configuration.length - 1 ){
      selectedConfigName += ", "; 
    } else {
      selectedConfigName += " )";
    }
  } );
  
  return (
    <div className="product-card">
      <img src={photos?.[0]?.url} alt={name} />
      <p>{`${name}${selectedConfigName}`}</p>
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
          quantity: 1,
          variant: variants?.[0] || undefined,
        })}>
          <FaPlus/>
        </button>
      </div>
    </div>
  )
}

export default ProductCard