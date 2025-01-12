import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { Navigate, useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { useMyAddressesQuery } from "../redux/api/userAPI";
import { Skeleton } from "../components/Loader";
const countryOptions = [
    {
        id: "ind",
        country: "India"
    },
    {
        id: "usa",
        country: "United States Of America"
    },
    {
        id: "aus",
        country: "Australia"
    }
]

const Shipping = () => {
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const { cartItems, selectedShippingAddressId, total } = useSelector( ( state:{ cartReducer: CartReducerInitialState } ) => state.cartReducer );

    const { data, isLoading, isError } = useMyAddressesQuery( user?._id! );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        primaryPhone: "",
        secondaryPhone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    })

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo( (prev) => {
            return {...prev,
                [e.target.name]: e.target.value
            }
        } )
    };

    const submitHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault( );

        dispatch( saveShippingInfo( shippingInfo ) );

        try{
            const { data } = await axios.post( `${server}/api/v1/payment/create`,
                {
                    amount: total
                }, {
                    headers: {
                    "Content-Type": "application/json",
                    },
                } 
            );

            navigate( "/pay", {
                state: data.clientSecret,
            } );
        } catch( error ){
            console.log( error );
            toast.error( "Something went wrong" );
        }
    }

    useEffect(() => {
        if( cartItems.length <= 0 ) return navigate( "/cart" );
    }, [cartItems])

    useEffect( function( ){
            var selectedAddress = data?.addresses.filter( ( address ) => selectedShippingAddressId.length > 0 ? address._id == selectedShippingAddressId : address.isDefault );

            if( selectedAddress && selectedAddress.length > 0 ){
                setShippingInfo( selectedAddress.map( ( { _id, user, isDefault, ...shippingAddress } ) => shippingAddress )[0] );
            }
    }, [ data ] );

    if( isError ) return <Navigate to={"/404"}/>;

    return (
        isLoading ? <Skeleton length={20}/> : <div className="shipping">
            <button className="back-btn" onClick={()=>{navigate("/cart")}}><BiArrowBack/></button>
            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                <input required type="text" placeholder="Name" name="name" value={shippingInfo.name} onChange={changeHandler}/>
                <input required type="number" placeholder="Phone Number" name="primaryPhone" value={shippingInfo.primaryPhone} onChange={changeHandler}/>
                <input type="number" placeholder="Alternate Phone Number" name="secondaryPhone" value={shippingInfo.secondaryPhone || ""} onChange={changeHandler}/>
                <input required type="number" placeholder="Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler}/>
                <input type="text" placeholder="House No, Building Name" name="address2" value={shippingInfo.address2} onChange={changeHandler}/>
                <input required type="text" placeholder="Road name, Area, Colony" name="address" value={shippingInfo.address} onChange={changeHandler}/>
                <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler}/>
                <input required type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler}/>
                <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                    <option key={""} value="">Select Country</option>
                    {countryOptions.map( ( countryOption ) => ( <option key={countryOption.id} value={countryOption.id}>{countryOption.country}</option> ) )}
                </select>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping