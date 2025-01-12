import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api.types";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Loader";
import { useAllDeliveryRulesQuery } from "../../redux/api/deliveryRuleAPI";

interface DataType {
  ruleName: string;
  subtotalMinRange: number;
  subtotalMaxRange: number;
  amount: number;
  percentage: number;
  setDeliveryFeeTo: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Rule Name",
    accessor: "ruleName",
  },
  {
    Header: "Subtotal Range (Min)",
    accessor: "subtotalMinRange",
  },
  {
    Header: "SubtotalMaxRange",
    accessor: "subtotalMaxRange",
  },
  {
    Header: "Delivery Fee Amount",
    accessor: "amount",
  },
  {
    Header: "Delivery Fee Percentage",
    accessor: "percentage",
  },
  {
    Header: "Set Delivery Fee To",
    accessor: "setDeliveryFeeTo",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const DeliveryRules = () => {
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllDeliveryRulesQuery( user?._id! );

  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message )
  
  useEffect( () => {
    if( data )
      setRows(
        data.deliveryRules.map( ( { _id, ruleName, subtotalMinRange, subtotalMaxRange, amount, percentage, setDeliveryFeeTo } ) => ( {
          ruleName,
          subtotalMinRange,
          subtotalMaxRange,
          amount,
          percentage,
          setDeliveryFeeTo,
          action: <div style={{display: "flex",flexDirection:"row", gap:"4px", alignItems:"center"}}>
            <Link to={`/admin/deliveryRule/${_id}`}>Manage</Link>
          </div>,
        } ) )
      );
  }, [data] );
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Delivery Fee Rules",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
      <Link to="/admin/deliveryRule/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default DeliveryRules;
