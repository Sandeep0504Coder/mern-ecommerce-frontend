import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { resetCart } from "../redux/reducer/cartReducer";
interface HeaderPropsType{
    user: User | null;

}

const Header = ( { user }: HeaderPropsType ) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { cartItems } = useSelector( ( state: RootState ) => ( state.cartReducer ) );
    const dispatch = useDispatch();
    const logOutHandler = async() =>{
        try{
            await signOut( auth );
            toast.success( "Sign out Successfully" );
            dispatch(resetCart());
            setIsOpen( false );
        } catch( e ){
            toast.error( "Sign Out Fail" );
        }
        
    };

    return (
        <nav className="header">
            <img style={{position: "absolute", left: "0.5rem", top: "1.5rem", width: "2rem", height: "2rem", borderRadius: "50%"}} src="https://res.cloudinary.com/dh9jmcvdt/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1737739879/logo2_w1unsy.jpg"/>
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