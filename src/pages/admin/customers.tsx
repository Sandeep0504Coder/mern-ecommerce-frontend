import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer.types";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { server } from "../../redux/store";
import { Skeleton } from "../../components/Loader";
import { CustomError } from "../../types/api.types";
import toast from "react-hot-toast";
import { responseToast } from "../../utils/features";
import { useNavigate } from "react-router-dom";

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

// const img = "https://randomuser.me/api/portraits/women/54.jpg";
// const img2 = "https://randomuser.me/api/portraits/women/50.jpg";

// const arr: Array<DataType> = [
//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img}
//         alt="Shoes"
//       />
//     ),
//     name: "Emily Palmer",
//     email: "emily.palmer@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },

//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img2}
//         alt="Shoes"
//       />
//     ),
//     name: "May Scoot",
//     email: "aunt.may@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },
// ];

const Customers = () => {
  const [ deleteUser ] = useDeleteUserMutation();
  const navigate = useNavigate();
  const { user } = useSelector( ( state: { userReducer: UserReducerInitialState } ) => ( state.userReducer ) );

  const { data, isLoading, isError, error } = useAllUsersQuery( user?._id! );
  const [rows, setRows] = useState<DataType[]>( [] );

  if( isError ) toast.error( ( error as CustomError ).data.message );

  const deleteUserHandler = async( userId: string ) => {
    const res = await deleteUser( {
      adminUserId: user?._id!,
      userId
    } );

    responseToast( res, navigate, "/admin/customer" );
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
            <button>
              <FaTrash onClick={( ) => { deleteUserHandler( user._id ) }}/>
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
