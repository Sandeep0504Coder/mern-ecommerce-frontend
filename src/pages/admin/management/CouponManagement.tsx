import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useCouponDetailsQuery, useDeleteCouponMutation, useUpdateCouponMutation } from "../../../redux/api/couponAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";
import { FaTrash } from "react-icons/fa";

const CouponManagement = () => {
    const params = useParams( );
    
    const { user } = useSelector( ( state: RootState ) => state.userReducer );

    const { data, isLoading, isError } = useCouponDetailsQuery( { couponId: params.id!, userId: user?._id! } );

    const [ deleteCoupon ] = useDeleteCouponMutation( );

    const { code: couponCode , amount } = data?.coupon || {
        code: "",
        amount: 0
    };

    const [ btnLoading, setBtnLoading ] = useState<boolean>( false );

    const [discountAmount, setDiscountAmount] = useState<number>( amount );

    const [ updateCoupon ] = useUpdateCouponMutation();

    const navigate = useNavigate();

    const updateCouponHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault( );
        setBtnLoading( true );

        try{
            const formData = new FormData( );

            if(discountAmount) formData.set( "amount", discountAmount.toString() );
    
            const res = await updateCoupon( {
            userId: user?._id!,
            couponId: params.id!,
            formData
            } );
    
            responseToast( res, navigate, "/admin/coupon" );
        } catch( error ){
            console.log( error );
        } finally {
            setBtnLoading( false );
        }
        
    }

    const deleteCouponHandler = async( ) => {
        const res = await deleteCoupon( {
          userId: user?._id!,
          couponId: data?.coupon._id!
        } );
    
        responseToast( res, navigate, "/admin/coupon" );
    }

    useEffect(() => {
        if( data ){
          setDiscountAmount( amount );
        }
      }, [ data ] );

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="coupon-management">
                {isLoading ? <Skeleton length={10}/> : <>
                    <article>
                        <button className="coupon-delete-btn" onClick={deleteCouponHandler}>
                            <FaTrash />
                        </button>
                        <form className="create-coupon-form" onSubmit={updateCouponHandler}>
                            <h1>Manage Coupon</h1>
                            <div>
                                <label>Coupon Code</label>
                                <input
                                    type="text"
                                    placeholder="Coupon code"
                                    value={couponCode}
                                    disabled
                                    required
                                />
                            </div>
                            <div>
                                <label>Amount</label>
                                <input
                                    type="number"
                                    placeholder="Discount amount"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                                    required
                                />  
                            </div>
                            
                            <button disabled={btnLoading} type="submit">Update</button>
                        </form>
                    </article>
                </>}
            </main>
        </div>
    );
};

export default CouponManagement;
