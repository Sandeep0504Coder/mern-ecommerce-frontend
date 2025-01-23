import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItemType } from "../types/types";

type CartItemProps = {
    cartItem: CartItemType;
    incrementHandler:( cartItem: CartItemType ) => void;
    decrementHandler:( cartItem: CartItemType ) => void;
    removeHandler:( id: string, variantId: string ) => void;
}

const CartItem = ( { cartItem, incrementHandler, decrementHandler, removeHandler } : CartItemProps ) => {
    const { photo, productId, name, price, quantity, variant } = cartItem;
    let  selectedConfigName = "";
    let variantQueyParam = variant?._id ? `?variantId=${variant._id}` : "";
    variant?.configuration?.forEach( ( config, index )=> {
        if( index == 0 ){
            selectedConfigName += " ( ";
        }

        selectedConfigName +=`${config.value.toUpperCase( )} ${config.key.toUpperCase() != "COLOR" && config.key.toUpperCase() != "DISPLAY SIZE" ? config.key.toUpperCase( ) : ""}`;
  
        if( index != variant.configuration.length - 1 ){
            selectedConfigName += ", "; 
        } else {
            selectedConfigName += " )";
        }
    } );

    return (
        <div className="cart-item">
            <img src={photo} alt={name} />
            <article>
                <Link to={`/productDetails/${productId}${variantQueyParam}`}>{`${name}${selectedConfigName}`}</Link>
                <span>${price}</span>
            </article>
            <div>
                <button onClick={() => (decrementHandler(cartItem))}>-</button>
                <p>{quantity}</p>
                <button onClick={() => (incrementHandler(cartItem))}>+</button>
            </div>
            <button onClick={() => (removeHandler(productId, variant?._id || ""))}>
                <FaTrash/>
            </button>
        </div>
    );
}

export default CartItem