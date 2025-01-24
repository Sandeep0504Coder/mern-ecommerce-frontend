import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../components/admin/AdminSidebar";
import TableHOC from "../components/admin/TableHOC";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../types/api.types";
import { useSelector } from "react-redux";
import { Skeleton } from "../components/Loader";
import { useAllHomePageContentsQuery } from "../redux/api/homePageContentAPI";

interface DataType {
    photo: ReactElement;
    promotionalText: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Promotional Text",
    accessor: "promotionalText",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const HomePageManager = () => {
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllHomePageContentsQuery( user?._id! );

  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message )
  
  useEffect( () => {
    if( data )
      setRows(
        data.homePageContents.map( ( { _id, banners, promotionalText } ) => ( {
            photo: <img src={banners[0].url} />,
            promotionalText,
            action: <div style={{display: "flex",flexDirection:"row", gap:"4px", alignItems:"center"}}>
                <Link to={`/admin/homePageContent/${_id}`}>Manage</Link>
            </div>,
        } ) )
      );
  }, [data] );
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "System Settings",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
    </div>
  );
};

export default HomePageManager;
