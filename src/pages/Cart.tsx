import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer.types";
import { CartItemType } from "../types/types";
import { addToCart, removeFromCart, calculatePrice, applyDiscount } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";
import { useSystemSettingDetailByUniqueNameQuery } from "../redux/api/systemSettingAPI";
import { Skeleton } from "../components/Loader";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector( ( state:{ cartReducer: CartReducerInitialState } ) => state.cartReducer );
  const [ couponCode, setCouponCode ] = useState<string>("");
  const [ isValidCouponCode, setIsValidCouponCode ] = useState<boolean>(false);
  const { data: deliveryFeeData, isLoading: deliveryFeeLoading, isError: deliveryFeeError } = useSystemSettingDetailByUniqueNameQuery( { settingUniqueName: "deliveryFee" } );
  const { data: taxRateData, isLoading: taxRateLoading, isError: taxRateError } = useSystemSettingDetailByUniqueNameQuery( { settingUniqueName: "taxRate" } );

  const incrementHandler = ( cartItem: CartItemType ) => {
    if( cartItem.stock <= cartItem.quantity ) return toast.error( "Out of Stock." );

    dispatch( addToCart( {
      ...cartItem,
      quantity: cartItem.quantity + 1,
      updateItemIfFound: true,
    } ) );
  }

  const decrementHandler = ( cartItem: CartItemType ) => {
    if( cartItem.quantity <= 1 ) return toast.error( "Minimum quantity is 1." );

    dispatch( addToCart( {
      ...cartItem,
      quantity: cartItem.quantity - 1,
      updateItemIfFound: true,
    } ) );
  }

  const removeHandler = ( productId: string, variantId: string ) => {
    dispatch( removeFromCart( { productId, variantId } ) );
  }

  useEffect(() => {
    dispatch( calculatePrice( { deliveryFeeData: deliveryFeeData, taxRateData: taxRateData } ) )
  }, [ deliveryFeeData, taxRateData, cartItems ])
  

  useEffect(() => {
    const {token, cancel} = axios.CancelToken.source();
    const timeOutId = setTimeout(()=>{
      axios.get( `${server}/api/v1/payment/discount?coupon=${couponCode}`, {cancelToken: token} )
      .then( ( res ) => {
        dispatch( applyDiscount( res.data.discount ) );
        dispatch( calculatePrice( {deliveryFeeData: deliveryFeeData, taxRateData: taxRateData} ) );
        setIsValidCouponCode(true);
      } )
      .catch( ( ) => {
        dispatch( applyDiscount( 0 ) );
        dispatch( calculatePrice( { deliveryFeeData: deliveryFeeData, taxRateData: taxRateData } ) );
        setIsValidCouponCode(false);
      } )
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    }
  }, [couponCode, deliveryFeeData, taxRateData])

  if( deliveryFeeError || taxRateError ) return <Navigate to={"/404"}/>;

  return (
    <div className="cart">
      { ( deliveryFeeLoading || taxRateLoading ) ?  <Skeleton length={20}/> : <>
        <main>
          {cartItems.length > 0 ? (
            cartItems.map((item, index)=>(
              <CartItem
                key={index}
                cartItem={item}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
              />
            ))
          ) : (
            <h1>No Items Added.</h1>
          )
        }
        </main>
        <aside>
          <p>Subtotal: ${subtotal}</p>
          <p>Shipping Charges: ${shippingCharges}</p>
          <p>Tax: ${tax}</p>
          <p>
            Discount: <em className="red"> - ${discount}</em>
          </p>
          <p><b>Total: ${total}</b></p>
          <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}/>
          {couponCode && (isValidCouponCode
            ?<span className="green">${discount} off using the <code>{couponCode}</code></span>
            :<span className="red">Invalid Coupon <VscError/></span>)
          }
          {
            cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
          }
        </aside>
      </>}
    </div>
  )
}

export default Cart