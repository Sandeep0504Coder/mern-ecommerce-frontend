import { Link, Navigate, useParams } from "react-router-dom";
import {  useOrderDetailsQuery } from "../redux/api/orderAPI";
import { OrderItemType, OrderType } from "../types/types";
import { Skeleton } from "../components/Loader";

const defaultData: OrderType = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  user:{
    name: "",
    _id: "",
  },
  _id: "",
  status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
}

const OrderDetails = () => {
  const params = useParams( );
  const { data, isLoading, isError } = useOrderDetailsQuery( params.id! );

  const {
    shippingInfo: { address, city, state,country, pinCode },
    orderItems,
    user: {name},
    status,
    subtotal,
    discount,
    shippingCharges,
    tax,
    total
  } = data?.order || defaultData;

  if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="container">
      <main className="product-management">
        { isLoading? <Skeleton length={20}/> : <>
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>Order Items</h2>

            {orderItems.map((i) => (
              <ProductCard
                key={i._id}
                name={i.name}
                photo={i.photo}
                productId={i.productId}
                _id={i._id}
                quantity={i.quantity}
                price={i.price}
                variant={i.variant}
              />
            ))}
          </section>

          <article className="shipping-info-card">
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {name}</p>
            <p>
              Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
            </p>
            <h5>Amount Info</h5>
            <p>Subtotal: {subtotal}</p>
            <p>Shipping Charges: {shippingCharges}</p>
            <p>Tax: {tax}</p>
            <p>Discount: {discount}</p>
            <p>Total: {total}</p>

            <h5>Status Info</h5>
            <p>
              Status:{" "}
              <span
                className={
                  status === "Delivered"
                    ? "purple"
                    : status === "Shipped"
                    ? "green"
                    : "red"
                }
              >
                {status}
              </span>
            </p>
          </article>
        </> }
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
  variant
}:OrderItemType) => {
  let selectedConfigName = "";
  let variantQueyParam = variant?._id ? `?variantId=${variant._id}` : "";

  variant?.configuration?.forEach( ( config, index )=> {
    if( index == 0 ){
      selectedConfigName += " ( ";
    }

    selectedConfigName +=`${config.value.toUpperCase( )} ${config.key.toUpperCase() != "COLOR" ? config.key.toUpperCase( ) : ""}`;

    if( index != variant.configuration.length - 1 ){
      selectedConfigName += ", "; 
    } else {
      selectedConfigName += " )";
    }
  } );

  return (
    <div className="transaction-product-card">
      <img src={photo} alt={name} />
      <Link to={`/productDetails/${productId}${variantQueyParam}`}>{`${name}${selectedConfigName}`}</Link>
      <span>
        ${price} X {quantity} = ${price * quantity}
      </span>
    </div>
  )
};

export default OrderDetails