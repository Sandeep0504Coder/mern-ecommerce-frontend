import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api.types";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Loader";
import { useAllSystemSettingsQuery } from "../../redux/api/systemSettingAPI";

interface DataType {
    settingCategory: string;
    settingName: string;
    settingValue: string;
    settingEnabled: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Setting Category",
    accessor: "settingCategory",
  },
  {
    Header: "Setting Name",
    accessor: "settingName",
  },
  {
    Header: "Value",
    accessor: "settingValue",
  },
  {
    Header: "Enabled",
    accessor: "settingEnabled",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const SystemSettings = () => {
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllSystemSettingsQuery( user?._id! );

  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message )
  
  useEffect( () => {
    if( data )
      setRows(
        data.systemSettings.map( ( { _id, settingCategory, settingName, settingValue, entityId, entityDetails } ) => ( {
            settingCategory,
            settingName,
            settingValue: entityId?.length > 0 ? entityDetails : settingValue,
            settingEnabled: entityId?.length > 0 ? settingValue : "",
            action: <div style={{display: "flex",flexDirection:"row", gap:"4px", alignItems:"center"}}>
                <Link to={`/admin/systemSetting/${_id}`}>Manage</Link>
            </div>,
        } ) )
      );
  }, [data] );
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Settings",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
    </div>
  );
};

export default SystemSettings;
