import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { responseToast } from "../../utils/features";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import {  CreateAddressFormData } from "../../types/types";
import { useCreatAddressMutation, useMyAddressesQuery } from "../../redux/api/userAPI";
import { Skeleton } from "../../components/Loader";

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

const NewAddress = () => {
  const navigate = useNavigate();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );
  const [ isLoading, setIsLoading ] = useState<boolean>( false );
  const  [ createAddress ] = useCreatAddressMutation();

  const { data, isLoading: requestLoading , isError } = useMyAddressesQuery( user?._id! )

  const [ deliveryAddress, setDeliveryAddress ] = useState<CreateAddressFormData>( {
      name: "",
      primaryPhone: "",
      secondaryPhone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      isDefault: false,
  } );

  const { name, primaryPhone, secondaryPhone, address, address2, city, state, country, pinCode, isDefault } = deliveryAddress;

  const createAddressHandler = async( e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading( true );

    try{
      if( !name || !primaryPhone || !address || !city || !state || !country || !pinCode ){
        return;
      }

      const res = await createAddress( {
        id: user?._id!,
        addressData: {
          name,
          primaryPhone,
          secondaryPhone,
          address,
          address2,
          city,
          state,
          country,
          pinCode,
          isDefault
        },
      } );
  
      responseToast( res, navigate,"/addresses" );
    } catch( error ){
      console.log( error );
    } finally {
      setIsLoading( false );
    }
  }

  const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
    const { name, type, value } = e.target;

    setDeliveryAddress( ( prevState ) => ( {
      ...prevState,
      [ name ]: type === "checkbox" ? ( e.target as HTMLInputElement ).checked : value,
    } ) );
  }

  useEffect( () => {
      if( data && data.addresses.length == 0 ){
        setDeliveryAddress( { ...deliveryAddress, isDefault: true  } );
      }
    }, [ data ] );
  
    if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="create-address-container">
      <main className="address-management">
        {requestLoading ? <Skeleton length={20}/> : <article>
          <form onSubmit={createAddressHandler}>
            <h2>New Address</h2>
            <div>
              <label>Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={name}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Phone Number*</label>
              <input
                type="number"
                name="primaryPhone"
                placeholder="Phone Number"
                required
                value={primaryPhone}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Alternate Phone Number</label>
              <input
                type="number"
                name="secondaryPhone"
                placeholder="Alternate Phone Number"
                value={secondaryPhone}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Pincode*</label>
              <input
                type="number"
                name="pinCode"
                placeholder="Pincode"
                required
                value={pinCode}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>House No, Building Name</label>
              <textarea
                name="address2"
                placeholder="House No, Building Name"
                value={address2}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Road name, Area, Colony*</label>
              <textarea
                name="address"
                placeholder="Road name, Area, Colony"
                required
                value={address}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>City*</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={city}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>State*</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                required
                value={state}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <select name="country" required value={country} onChange={changeInputHandler}>
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
                    name="isDefault"
                    checked={isDefault}
                    disabled={data?.addresses.length == 0}
                    onChange={changeInputHandler}
                />
                <span>Mark as Default Delivery Address</span>
            </div>
            <button type="submit" disabled={isLoading} >Create</button>
          </form>
        </article> }
      </main>
    </div>
  );
};

export default NewAddress;
