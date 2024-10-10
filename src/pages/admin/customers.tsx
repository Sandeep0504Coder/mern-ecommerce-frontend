import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { Skeleton } from "../../components/Loader";
import { CustomError } from "../../types/api.types";
import toast from "react-hot-toast";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const [ deleteUser ] = useDeleteUserMutation();
  const { user } = useSelector( ( state: RootState ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllUsersQuery( user?._id! );
  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message );

  const deleteUserHandler = async( userId: string ) => {
    const res = await deleteUser( {
      adminUserId: user?._id!,
      userId
    } );

    responseToast( res, null, "" );
  }

  useEffect(() => {
    if( data ){
      setRows( data.users.map( ( user ) => (
        {
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={`${user.photo}`}
              alt={user.name}
            />
          ),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={( ) => { deleteUserHandler( user._id ) }}>
              <FaTrash/>
            </button>
          ),
        }
      ) ) ) 
    } 
  }, [data])
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
    </div>
  );
};

export default Customers;
