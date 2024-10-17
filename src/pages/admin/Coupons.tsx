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
import { useAllCouponsQuery, useDeleteCouponMutation } from "../../redux/api/couponAPI";
import { FaTrashCan } from "react-icons/fa6";
import { responseToast } from "../../utils/features";

interface DataType {
  code: string;
  amount: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Coupons = () => {
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );
  const [ deleteCoupon ] = useDeleteCouponMutation( );

  const { data, isLoading, isError, error } = useAllCouponsQuery( user?._id! );

  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message )
  

    const deleteCouponHandler = async( couponId: string ) => {
        const res = await deleteCoupon( {
          userId: user?._id!,
          couponId: couponId
        } );
    
        responseToast( res, null, "" );
    }

  useEffect( () => {
    if( data )
      setRows(
        data.coupons.map( ( coupon ) => ( {
          code: coupon.code,
          amount: coupon.amount,
          action: <button onClick={ ( ) => { deleteCouponHandler( coupon._id ) } }><FaTrashCan/></button>
        } ) )
      );
  }, [data] );
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-coupon-box",
    "Coupons",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
      <Link to="/admin/coupon/new" className="create-coupon-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Coupons;
