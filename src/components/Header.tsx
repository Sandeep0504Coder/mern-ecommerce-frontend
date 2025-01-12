import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import Badge from '@mui/material/Badge';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface HeaderPropsType{
    user: User | null;

}

const Header = ( { user }: HeaderPropsType ) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { cartItems } = useSelector( ( state: RootState ) => ( state.cartReducer ) );
    const logOutHandler = async() =>{
        try{
            await signOut( auth );
            toast.success( "Sign out Successfully" );
            setIsOpen( false );
        } catch( e ){
            toast.error( "Sign Out Fail" );
        }
        
    };

    return (
        <nav className="header">
            <Link className="brandName" onClick={()=>{setIsOpen(false)}} to ="/">ShopSphere</Link>
            <Link onClick={()=>{setIsOpen(false)}} to ="/search"><FaSearch/></Link>
            <Badge badgeContent={cartItems.length} color="primary">
                <Link className="cartLink" onClick={()=>{setIsOpen(false)}} to ="/cart"><FaShoppingBag/></Link>
            </Badge>
            {user?._id? (
                    <>
                        <button onClick={()=>{setIsOpen(prev=>!prev)}}>
                            <FaUser/>
                        </button>
                        <dialog open={isOpen}>
                            <div>
                                {user.role === "admin" && (
                                    <Link onClick={()=>{setIsOpen(false)}} to ="/admin/dashboard">Admin</Link>
                                ) }
                                <Link onClick={()=>{setIsOpen(false)}} to ="/addresses">Addresses</Link>
                                <Link onClick={()=>{setIsOpen(false)}} to ="/orders">Orders</Link>
                                <button  onClick={logOutHandler}><FaSignOutAlt/></button>
                            </div>
                        </dialog>
                    </>
                ) : (
                    <Link to ="/login"><FaSignInAlt/></Link>
                )
            }
        </nav>
    )
}

export default Header