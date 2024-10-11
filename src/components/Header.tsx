import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface HeaderPropsType{
    user: User | null;

}

const Header = ( { user }: HeaderPropsType ) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
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
            <Link onClick={()=>{setIsOpen(false)}} to ="/cart"><FaShoppingBag/></Link>
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