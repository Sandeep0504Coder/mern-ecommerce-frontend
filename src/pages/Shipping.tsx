import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer.types";
import { useSelector } from "react-redux";
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
    const { cartItems } = useSelector( ( state:{ cartReducer: CartReducerInitialState } ) => state.cartReducer );
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
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

    useEffect(() => {
        if( cartItems.length <= 0 ) return navigate( "/cart" );
    }, [cartItems])

    return (
        <div className="shipping">
            <button className="back-btn" onClick={()=>{navigate("/cart")}}><BiArrowBack/></button>
            <form>
                <h1>Shipping Address</h1>
                <input required type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={changeHandler}/>
                <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler}/>
                <input required type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler}/>
                <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                    <option value="">Select Country</option>
                    {countryOptions.map( ( countryOption ) => ( <option value={countryOption.id}>{countryOption.country}</option> ) )}
                </select>
                <input required type="number" placeholder="Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler}/>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping