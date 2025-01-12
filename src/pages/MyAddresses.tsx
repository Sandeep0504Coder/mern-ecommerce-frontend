import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CustomError } from "../types/api.types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { RootState } from "../redux/store";
import { useMyAddressesQuery } from "../redux/api/userAPI";
import { FaPlus } from "react-icons/fa";

type DataType = {
    name: string;
    address: string;
    primaryPhone: string;
    default: ReactElement;
    action: ReactElement;
}

const column: Column<DataType>[] = [
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Address",
        accessor: "address",
    },
    {
        Header: "Phone No",
        accessor: "primaryPhone",
    },
    {
        Header: "Default",
        accessor: "default",
    },
    {
        Header: "Action",
        accessor: "action",
    },
]
const MyAddresses = () => {
    const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

    const { data, isLoading, isError, error } = useMyAddressesQuery( user?._id! );

    const [rows, setRows] = useState<DataType[]>( [] );

    if( isError ) toast.error( ( error as CustomError ).data.message );

    useEffect( () => {
        if( data )
          setRows(
            data.addresses.map( ( { _id, name, address, address2, city, state, pinCode, primaryPhone, isDefault } ) => {
                return {
                name,
                address: `${address}, ${address2}${address2.length ? "," : ""} ${city}, ${state} - ${pinCode}`,
                primaryPhone,
                default:  isDefault ? <span className="green"> Default </span> : <></>,
                action: <Link to={`/manageAddress/${_id}`}>Manage</Link>, 
            } } )
          );
      }, [data] );

    const Table = TableHOC<DataType>(
        column,
        rows,
        "user-saved-addresses",
        "Addresses",
        rows.length> 6 ? true : false
    )()
  return (
    <div className='container'>
        <h1>My Addresses</h1>
        <Link to="/createAddress" className="create-product-btn">
            <FaPlus />
        </Link>
        {isLoading ? <Skeleton length={20}/> : Table}
    </div>
  )
}

export default MyAddresses