import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { RootState } from "../../../redux/store";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/orderAPI";
import { OrderItemType, OrderType } from "../../../types/types";
import { Skeleton } from "../../../components/Loader";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";

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

const TransactionManagement = () => {
  const params = useParams( );
  const navigate = useNavigate( );
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );
  const [ updateOrder ] = useUpdateOrderMutation( );
  const [ deleteOrder ] = useDeleteOrderMutation( );
  const { data, isLoading, isError } = useOrderDetailsQuery( params.id! );

  const {
    shippingInfo: { name, address, address2, primaryPhone, secondaryPhone, city, state, pinCode, country },
    orderItems,
    status,
    subtotal,
    discount,
    shippingCharges,
    tax,
    total,
    _id : orderId
  } = data?.order || defaultData;

  const updateHandler = async() => {
    const res = await updateOrder( { userId: user?._id!, orderId } );
    responseToast( res, navigate, "/admin/transaction" );
  };

  const deleteHandler = async() => {
    const res = await deleteOrder( { userId: user?._id!, orderId } );
    responseToast( res, navigate, "/admin/transaction" );
  };

  if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
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
            <button className="product-delete-btn" onClick={deleteHandler}>
              <FaTrash />
            </button>
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {name}</p>
            <p>
              Phone No: {`${primaryPhone}${secondaryPhone ? `, ${secondaryPhone}` : ""}`}
            </p>
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
            <button className="shipping-btn" onClick={updateHandler}>
              Process Status
            </button>
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
  );
};

export default TransactionManagement;
