import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { responseToast } from "../../utils/features";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import {  UpdateAddressFormData } from "../../types/types";
import { useAddressDetailsQuery, useDeleteAddressMutation, useUpdateAddressMutation } from "../../redux/api/userAPI";
import { Skeleton } from "../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { modifySelectedShippingAddress } from "../../redux/reducer/cartReducer";

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

const AddressManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );
  const { selectedShippingAddressId } = useSelector( ( state: RootState ) => state.cartReducer );
  const [ btnLoading, setBtnLoading ] = useState<boolean>( false );
  const  { data, isLoading, isError } = useAddressDetailsQuery( params.id! );
  const [ updateAddress ] = useUpdateAddressMutation( );
  const [ deleteAddress ] = useDeleteAddressMutation( );

  const [ deliveryAddressUpdate, setDeliveryAddressUpdate ] = useState<UpdateAddressFormData>( {
    nameUpdate: "",
    primaryPhoneUpdate: "",
    secondaryPhoneUpdate: "",
    addressUpdate: "",
    address2Update: "",
    cityUpdate: "",
    stateUpdate: "",
    countryUpdate: "",
    pinCodeUpdate: "",
    isDefaultUpdate: false
  } );

  const {
    nameUpdate,
    primaryPhoneUpdate,
    secondaryPhoneUpdate,
    addressUpdate,
    address2Update,
    cityUpdate,
    stateUpdate,
    countryUpdate,
    pinCodeUpdate,
    isDefaultUpdate
  } = deliveryAddressUpdate;

  const updateAddressHandler = async( e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading( true );

    try{
      const res = await updateAddress( {
        id: user?._id!,
        addressId: data?.address._id!,
        addressData: {
          name: nameUpdate,
          primaryPhone: primaryPhoneUpdate,
          secondaryPhone: secondaryPhoneUpdate,
          address: addressUpdate,
          address2: address2Update,
          city: cityUpdate,
          state: stateUpdate,
          country: countryUpdate,
          pinCode: pinCodeUpdate,
          isDefault: isDefaultUpdate
        },
      } );
  
      responseToast( res, navigate,"/addresses" );
    } catch( error ){
      console.log( error );
    } finally {
      setBtnLoading( false );
    }
  }

  const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
    const { name, type, value } = e.target;

    setDeliveryAddressUpdate( ( prevState ) => ( {
      ...prevState,
      [ name ]: type === "checkbox" ? ( e.target as HTMLInputElement ).checked : value,
    } ) );
  }

  const deleteAddressHandler = async( ) => {
    const res = await deleteAddress( {
      userId: user?._id!,
      addressId: data?.address._id!
    } );

    if( data?.address._id == selectedShippingAddressId ) dispatch( modifySelectedShippingAddress( "" ) );

    responseToast( res, navigate, "/addresses" );
  }

  useEffect( () => {
    if( data ){
      setDeliveryAddressUpdate( {
        nameUpdate: data.address.name || "",
        primaryPhoneUpdate: data.address.primaryPhone || "",
        secondaryPhoneUpdate: data.address.secondaryPhone || "",
        addressUpdate: data.address.address || "",
        address2Update: data.address.address2 || "",
        cityUpdate: data.address.city || "",
        stateUpdate: data.address.state || "",
        countryUpdate: data.address.country || "",
        pinCodeUpdate: data.address.pinCode || "",
        isDefaultUpdate:  data.address.isDefault || false
      } );
    }
  }, [ data ] );

  if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="create-address-container">
      <main className="address-management">
        {isLoading ? <Skeleton length={20}/> :
          <article>
            <button className="product-delete-btn" onClick={deleteAddressHandler}>
              <FaTrash />
            </button>
            <form onSubmit={updateAddressHandler}>
            <h2>Manage Address</h2>
            <div>
              <label>Name*</label>
              <input
                type="text"
                name="nameUpdate"
                placeholder="Name"
                required
                value={nameUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Phone Number*</label>
              <input
                type="number"
                name="primaryPhoneUpdate"
                placeholder="Phone Number"
                required
                value={primaryPhoneUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Alternate Phone Number</label>
              <input
                type="number"
                name="secondaryPhoneUpdate"
                placeholder="Alternate Phone Number"
                value= {secondaryPhoneUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Pincode*</label>
              <input
                type="number"
                name="pinCodeUpdate"
                placeholder="Pincode"
                required
                value={pinCodeUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>House No, Building Name</label>
              <textarea
                name="address2Update"
                placeholder="House No, Building Name"
                value={address2Update}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Road name, Area, Colony*</label>
              <textarea
                name="addressUpdate"
                placeholder="Road name, Area, Colony"
                required
                value={addressUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>City*</label>
              <input
                type="text"
                name="cityUpdate"
                placeholder="City"
                required
                value={cityUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>State*</label>
              <input
                type="text"
                name="stateUpdate"
                placeholder="State"
                required
                value={stateUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <select name="countryUpdate" required value={countryUpdate} onChange={changeInputHandler}>
                <option key={""} value="">Select Country</option>
                {countryOptions.map( ( countryOption ) => (
                  <option key={countryOption.id} value={countryOption.id}>{countryOption.country}</option>
                ) )}
              </select>
            </div>

            <div>
                <input
                    className="checkbox-input"
                    type="checkbox"
                    name="isDefaultUpdate"
                    checked={isDefaultUpdate}
                    onChange={changeInputHandler}
                />
                <span>Mark as Default Delivery Address</span>
            </div>
            <button type="submit" disabled={btnLoading} >Update</button>
          </form>
        </article>}
      </main>
    </div>
  );
};

export default AddressManagement;