import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { CustomError } from "../types/api.types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { RootState } from "../redux/store";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}

const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    },
]
const Orders = () => {
    const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

    const { data, isLoading, isError, error } = useMyOrdersQuery( user?._id! );

    const [rows, setRows] = useState<DataType[]>( [] );

    if( isError ) toast.error( ( error as CustomError ).data.message );

    useEffect( () => {
        if( data )
          setRows(
            data.orders.map( ( order ) => ( {
                _id: order._id,
                amount: order.total,
                quantity: order.orderItems.length,
                discount: order.discount,
                status: <span className={ order.status === "Processing" ? "red" : order.status === "Shipped" ? "green" : "purple"}>{order.status}</span>,
                action: <Link to={`/orderDetails/${order._id}`}>View</Link>, 
            } ) )
          );
      }, [data] );

    const Table = TableHOC<DataType>(
        column,
        rows,
        "dashboard-product-box",
        "Orders",
        rows.length> 6 ? true : false
    )()
  return (
    <div className='container'>
        <h1>My Orders</h1>
        {isLoading ? <Skeleton length={20}/> : Table}
    </div>
  )
}

export default Orders