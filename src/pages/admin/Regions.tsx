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
import { useAllRegionsQuery } from "../../redux/api/regionAPI";

interface DataType {
  countryName: string;
  countryAbbreviation: string;
  stateName: string;
  stateAbbreviation: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Country Name",
    accessor: "countryName",
  },
  {
    Header: "Country Abbreviation",
    accessor: "countryAbbreviation",
  },
  {
    Header: "State Name",
    accessor: "stateName",
  },
  {
    Header: "State Abbreviation",
    accessor: "stateAbbreviation",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Regions = () => {
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllRegionsQuery( user?._id! );

  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message )
  
  useEffect( () => {
    if( data ){
        var rowData: DataType[] = [];

        data.regions.forEach( ( { _id, countryName, countryAbbreviation, states } ) => {
            rowData.push( {
              countryName,
              countryAbbreviation,
              stateName: "",
              stateAbbreviation: "",
              action: <div style={{display: "flex",flexDirection:"row", gap:"4px", alignItems:"center"}}>
                <Link to={`/admin/region/${_id}`}>Manage</Link>
                <Link to={`/admin/region/addState/${_id}`}>Add State</Link>
              </div>
            } );
            
            states.forEach( ( { _id: stateId, stateName, stateAbbreviation } ) => {
                rowData.push( {
                  countryName: "",
                  countryAbbreviation: "",
                  stateName,
                  stateAbbreviation,
                  action: <div style={{display: "flex",flexDirection:"row", gap:"4px", alignItems:"center"}}>
                    <Link to={`/admin/region/manageState/regionId/${_id}/stateId/${stateId}`}>Manage</Link>
                  </div>
                } );
            } );
          } )
        setRows(
            rowData
        );
    }  
  }, [data] );
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Regions",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
      <Link to="/admin/region/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Regions;
