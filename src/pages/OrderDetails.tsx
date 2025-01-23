import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {  useOrderDetailsQuery } from "../redux/api/orderAPI";
import { OrderItemType, OrderType } from "../types/types";
import { Skeleton } from "../components/Loader";

const defaultData: OrderType = {
  shippingInfo: {
    name: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
    address2: "",
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
  createdAt: "",
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
}

const OrderDetails = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // Determines whether it's confirmation or details
  const { data, isLoading, isError } = useOrderDetailsQuery( params.id! );

  const {
    shippingInfo: { name, primaryPhone, secondaryPhone, address, address2, city, state, pinCode, country },
    orderItems,
    status,
    subtotal,
    discount,
    shippingCharges,
    tax,
    total,
    _id
  } = data?.order || defaultData;

  if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className={`container ${type === "confirmation" ? "confirmation" : ""}`}>
      { isLoading? <Skeleton length={20}/> : <>
        {type === "confirmation" && (
          <section className="confirmation-banner">
            <h1>Thank you for your order!</h1>
            <p>Your order has been placed successfully.</p>
          </section>
        )}
        <main className="product-management">
          <section 
            style={{
              padding: "2rem",
            }}>
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
            <p>Phone No: {`${primaryPhone}${secondaryPhone ? `, ${secondaryPhone}` : ""}`}</p>
            <p>
              Address: {`${address}, ${address2 ? address2 : ""}${address2 && address2.length > 0 ? ", " : ""}${city}, ${state} ${pinCode} ${country.toUpperCase()}`}
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
            { status === "Delivered" && <Link className="view-invoice-btn" to ={`/viewInvoice/${_id}`}>
              View Invoice
            </Link> }
          </article>
        </main>
      </> }
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

    selectedConfigName +=`${config.value.toUpperCase( )} ${config.key.toUpperCase() != "COLOR" && config.key.toUpperCase() != "DISPLAY SIZE" ? config.key.toUpperCase( ) : ""}`;

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