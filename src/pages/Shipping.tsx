import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { Navigate, useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import toast from "react-hot-toast";
import { modifySelectedShippingAddress, saveShippingInfo } from "../redux/reducer/cartReducer";
import { useCreatAddressMutation, useMyAddressesQuery, useUpdateAddressMutation } from "../redux/api/userAPI";
import { useAllRegionsQuery } from "../redux/api/regionAPI";
import { Skeleton } from "../components/Loader";
import { Address } from "../types/types";

const Shipping = () => {
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const { cartItems, selectedShippingAddressId, total } = useSelector( ( state:{ cartReducer: CartReducerInitialState } ) => state.cartReducer );

    const { data, isLoading, isError } = useMyAddressesQuery( user?._id! );
    const { data: allRegionsData, isLoading: allRegionRequestLoading , isError: allRegionRequestIsError } = useAllRegionsQuery( user?._id! );
    const [ updateAddress ] = useUpdateAddressMutation( );
    const  [ createAddress ] = useCreatAddressMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectDeliveryAddressRef = useRef<HTMLDialogElement>( null );

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
    });

    const [selectedAddress, setSelectedAddress] = useState<Address>({
        _id: "",
        name: "",
        primaryPhone: "",
        secondaryPhone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        user: "",
        isDefault: false,
    });
    const [ selectedCountryAbbr, setSelectedCountryAbbr ] = useState<string>( "" );
    const [ saveAs, setSaveAs ] = useState<string>( "addAddress" );
    const [ stateOptions, setStateOptions ] = useState<{stateName: string; stateAbbreviation: string}[]>( [] );

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
            if( saveAs == "updateAddress" ){
                await updateAddress( {
                    id: user?._id!,
                    addressId: selectedAddress._id,
                    addressData: {
                      name: shippingInfo.name,
                      primaryPhone: shippingInfo.primaryPhone,
                      secondaryPhone: shippingInfo.secondaryPhone,
                      address: shippingInfo.address,
                      address2: shippingInfo.address2,
                      city: shippingInfo.city,
                      state: shippingInfo.state,
                      country: shippingInfo.country,
                      pinCode: shippingInfo.pinCode,
                      isDefault: selectedAddress.isDefault
                    },
                } );
            } else if( saveAs == "addAddress" ){
                const res = await createAddress( {
                    id: user?._id!,
                    addressData: {
                      name: shippingInfo.name,
                      primaryPhone: shippingInfo.primaryPhone,
                      secondaryPhone: shippingInfo.secondaryPhone,
                      address: shippingInfo.address,
                      address2: shippingInfo.address2,
                      city: shippingInfo.city,
                      state: shippingInfo.state,
                      country: shippingInfo.country,
                      pinCode: shippingInfo.pinCode,
                      isDefault: selectedAddress.isDefault
                    },
                } );

                dispatch( modifySelectedShippingAddress( res.data?.addressId! ) );
            }

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

    const handleSelectedAddressChange = ( addressId: string ) => {
        dispatch( modifySelectedShippingAddress( addressId ) );

        let selectedAddress = data?.addresses.filter( ( address ) => address._id == addressId );

        if( selectedAddress ){
            setSelectedAddress( selectedAddress[0] );
            setShippingInfo( selectedAddress.map( ( { _id, user, isDefault, ...shippingAddress } ) => shippingAddress )[0] );
            setSelectedCountryAbbr( selectedAddress[0].country );
        }

        closeSelectAddressDialog();
    };

    const closeSelectAddressDialog = ( ) => {
        selectDeliveryAddressRef.current?.close( );
    }

    const showSelectAddressDialog = ( ) => {
        selectDeliveryAddressRef.current?.showModal( );
    }


    useEffect(() => {
        if( cartItems.length <= 0 ) return navigate( "/cart" );
    }, [cartItems])

    useEffect( function( ){
            var selectedAddress = data?.addresses.filter( ( address ) => selectedShippingAddressId.length > 0 ? address._id == selectedShippingAddressId : address.isDefault );

            if( selectedAddress && selectedAddress.length > 0 ){
                setShippingInfo( selectedAddress.map( ( { _id, user, isDefault, ...shippingAddress } ) => shippingAddress )[0] );
                setSelectedCountryAbbr( selectedAddress[0].country );
                setSelectedAddress( selectedAddress[0] );
                setSaveAs( "updateAddress" );
            }
    }, [ data ] );

    useEffect( () => {
        if( allRegionsData && allRegionsData.regions ){
          const stateOptionsByRegionAbbr = allRegionsData.regions.filter( (region) => region.countryAbbreviation == selectedCountryAbbr );
    
            if( stateOptionsByRegionAbbr && stateOptionsByRegionAbbr.length > 0 ){
                setStateOptions(stateOptionsByRegionAbbr[0].states );
            } else {
                setStateOptions( [] );
            }
        }
    }, [ selectedCountryAbbr, allRegionsData ] );

    if( isError || allRegionRequestIsError ) return <Navigate to={"/404"}/>;

    return (
        <>
            {isLoading || allRegionRequestLoading ? <Skeleton length={20}/> : <div className="shipping">
                <button className="back-btn" onClick={()=>{navigate("/cart")}}><BiArrowBack/></button>
                <form onSubmit={submitHandler}>
                    <h1>Shipping Address</h1>
                    {
                        user !== null && selectedAddress._id != "" && (
                            <div className="productDetailsElement">
                                <label className="deliveryLabel"><b>Deliver to: </b></label>
                                <div className="selected-delivery-address">
                                    <p style={{marginTop: 0, fontWeight:500}}>{`${selectedAddress.name}, ${selectedAddress.pinCode}`}</p>
                                    <p>{`${selectedAddress.address}, ${selectedAddress.address2} ${selectedAddress.address2.length ? "," : ""} ${selectedAddress.city}, ${selectedAddress.state}`}</p>
                                </div>
                                <button type="button" className="addressChangeBtn" onClick={showSelectAddressDialog}>Change</button>
                            </div>
                        )
                    }
                    <input required type="text" placeholder="Name" name="name" value={shippingInfo.name} onChange={changeHandler}/>
                    <input required type="number" placeholder="Phone Number" name="primaryPhone" value={shippingInfo.primaryPhone} onChange={changeHandler}/>
                    <input type="number" placeholder="Alternate Phone Number" name="secondaryPhone" value={shippingInfo.secondaryPhone || ""} onChange={changeHandler}/>
                    <input required type="number" placeholder="Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler}/>
                    <input type="text" placeholder="House No, Building Name" name="address2" value={shippingInfo.address2} onChange={changeHandler}/>
                    <input required type="text" placeholder="Road name, Area, Colony" name="address" value={shippingInfo.address} onChange={changeHandler}/>
                    <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler}/>
                    <select name="state" required value={shippingInfo.state} onChange={changeHandler}>
                    <option key={""} value="">Select State</option>
                    {stateOptions.map( ( state, index ) => (
                    <option key={index} value={state.stateAbbreviation}>{state.stateName}</option>
                    ) )}
                </select>
                    <select name="country" required value={shippingInfo.country} onChange={(e)=>{setSelectedCountryAbbr(e.target.value);changeHandler(e);}}>
                        <option key={""} value="">Select Country</option>
                        {allRegionsData?.regions.map( ( region ) => ( <option key={region._id} value={region.countryAbbreviation}>{region.countryName}</option> ) )}
                    </select>
                    {user !== null && selectedAddress._id != "" &&
                        <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", padding: "1rem", flexDirection: "column",
                            borderRadius: "0.5rem",  border: `2px solid ${saveAs == "updateAddress" ? "blue" : "black"}`,
                            color: saveAs == "updateAddress" ? "blue" : "black", }}>
                            <input
                                type="radio"
                                name="saveAs"
                                value="updateAddress"
                                checked={saveAs == "updateAddress"}
                                onChange={() => setSaveAs("updateAddress")}
                                style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                            />
                            <p style={{marginTop: 0, fontWeight:500}}>Update Existing Delivery Address</p>
                        </label>
                    }
                    <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", padding: "1rem", flexDirection: "column",
                        borderRadius: "0.5rem",  border: `2px solid ${saveAs == "addAddress" ? "blue" : "black"}`,
                        color:  saveAs == "addAddress" ? "blue" : "black" }}>
                        <input
                            type="radio"
                            name="saveAs"
                            value="addAddress"
                            checked={saveAs == "addAddress"}
                            onChange={() => setSaveAs("addAddress")}
                            style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                        />
                        <p style={{marginTop: 0, fontWeight:500}}>Save as New Delivery Address</p>
                    </label>
                    <button type="submit">Pay Now</button>
                </form>
            </div>}
            <dialog ref={selectDeliveryAddressRef} className="review-dialog">
                <button onClick={closeSelectAddressDialog}>X</button>
                <h2>Select Delivery Address</h2>
                { isLoading ? <></> : (
                    <div>
                        {data?.addresses.map(( { _id, name, pinCode, address, address2, city, state, isDefault } ) => {
                            let isSelected = selectedShippingAddressId.length > 0 ? selectedShippingAddressId === _id : isDefault;
                            
                            return (
                            <label key={_id} style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", padding: "1rem", flexDirection: "column",
                                margin: "1rem 0", borderRadius: "0.5rem",  border: `2px solid ${isSelected ? "blue" : "black"}`,
                                color: isSelected ? "blue" : "black", }}>
                                <input
                                    type="radio"
                                    name="shippingAddress"
                                    value={_id}
                                    checked={isSelected}
                                    onChange={() => handleSelectedAddressChange(_id)}
                                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                                />
                                <p style={{marginTop: 0, fontWeight:500}}>{`${name}, ${pinCode}`}</p>
                                <p>{`${address}, ${address2} ${address2.length ? "," : ""} ${city}, ${state}`}</p>
                            </label>
                        )})}
                    </div>
                ) }
            </dialog>
        </>
    )
}

export default Shipping