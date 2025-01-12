import { Navigate, useParams } from "react-router-dom";
import { useRef } from "react";
import {  useOrderDetailsQuery } from "../redux/api/orderAPI";
import { OrderType } from "../types/types";
import { Skeleton } from "../components/Loader";

const Invoice= () => {
    const { id } = useParams<{ id: string }>();

    const invoiceRef = useRef<HTMLDivElement>(null);

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
    };

    const { data, isLoading, isError } = useOrderDetailsQuery( id! );

    const {
        shippingInfo: { name: customerName, address, address2, primaryPhone, secondaryPhone, city, state, pinCode, country },
        orderItems,
        subtotal,
        discount,
        shippingCharges,
        tax,
        total,
        _id,
        createdAt
    } = data?.order || defaultData;

    const handlePrintInvoice = () => {
        if (invoiceRef.current) {
          const printContents = invoiceRef.current.innerHTML;
          const originalContents = document.body.innerHTML;
          document.body.innerHTML = printContents;
          window.print();
          document.body.innerHTML = originalContents;
        }
    };

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        <div>
            { isLoading ? <Skeleton length={20}/> : <>
                <div ref={invoiceRef} style={{ width: "80%", margin: "auto", padding: "20px", border: "1px solid #ddd", fontFamily: "Arial, sans-serif" }}>
                    <header style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h1 style={{ margin: "0", color: "#333" }}>ShopSphere</h1>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Your Trusted Online Store</p>
                    </header>
                    <section style={{ marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "18px", color: "#333" }}>Invoice</h2>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Order ID: {_id}</p>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Date: {`${new Date( createdAt )}`}</p>
                    </section>
                    <section style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", color: "#333" }}>Customer Details</h3>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Name: {customerName}</p>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Phone No: {`${primaryPhone}${secondaryPhone ? `, ${secondaryPhone}` : ""}`}</p>
                        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>Address: {`${address}, ${address2 ? address2 : ""}${address2 && address2.length > 0 ? ", " : ""}${city}, ${state} ${pinCode} ${country.toUpperCase()}`}</p>
                    </section>
                    <section>
                        <h3 style={{ fontSize: "16px", color: "#333" }}>Order Details</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Item</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Price</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Quantity</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => {
                                    let selectedConfigName = "";
                                    item.variant?.configuration?.forEach( ( config, index )=> {
                                        if( index == 0 ){
                                          selectedConfigName += " ( ";
                                        }
                                    
                                        selectedConfigName +=`${config.value.toUpperCase( )} ${config.key.toUpperCase() != "COLOR" ? config.key.toUpperCase( ) : ""}`;
                                    
                                        let variantConfigLen = item.variant?.configuration?.length || 0;

                                        if( index != variantConfigLen - 1 ){
                                          selectedConfigName += ", "; 
                                        } else {
                                          selectedConfigName += " )";
                                        }
                                    } );

                                    return <tr key={index}>
                                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{`${item.name}${selectedConfigName}`}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>${item.price}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        <h3 style={{ fontSize: "16px", color: "#333", textAlign: "right" }}>
                            Subtotal: ${subtotal.toFixed(2)}
                        </h3><h3 style={{ fontSize: "16px", color: "#333", textAlign: "right" }}>
                            Shipping Charges: ${shippingCharges.toFixed(2)}
                        </h3><h3 style={{ fontSize: "16px", color: "#333", textAlign: "right" }}>
                            Tax: ${tax.toFixed(2)}
                        </h3>
                        <h3 style={{ fontSize: "16px", color: "#333", textAlign: "right" }}>
                            Discount: ${discount.toFixed(2)}
                        </h3>
                        <h3 style={{ fontSize: "16px", color: "#333", textAlign: "right" }}>
                            Total: ${total.toFixed(2)}
                        </h3>
                    </section>
                    <footer style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#777" }}>
                        Thank you for shopping with us!
                    </footer>
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                        onClick={handlePrintInvoice}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                    Print Invoice
                    </button>
                </div>
            </> }
        </div>
    );
};

export default Invoice;