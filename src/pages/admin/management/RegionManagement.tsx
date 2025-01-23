import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { UpdateRegionFormData } from "../../../types/types";
import { Skeleton } from "../../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { useDeleteRegionMutation, useRegionDetailsQuery, useUpdateRegionMutation } from "../../../redux/api/regionAPI";

const RegionManagement = () => {
    const [ updateRegion ] = useUpdateRegionMutation();
    const [ deleteRegion ] = useDeleteRegionMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>( false );
    const params = useParams();

    const { data, isLoading, isError } = useRegionDetailsQuery( { userId: user?._id!, regionId: params.id!} );

    const [ regionUpdate, setRegionUpdate ] = useState<UpdateRegionFormData>( {
        countryNameUpdate: "",
        countryAbbreviationUpdate: ""
    } );

    const { countryNameUpdate, countryAbbreviationUpdate } = regionUpdate;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setRegionUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const updateRegionHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsBtnLoading( true );

        try{
            const res = await updateRegion( {
              id: user?._id!,
              regionId: data?.region._id!,
              regionData: {
                countryName: countryNameUpdate,
                countryAbbreviation: countryAbbreviationUpdate
              }
            } );
        
            responseToast( res, navigate, "/admin/region" );
        } catch( error ){
            console.log( error );
        } finally {
            setIsBtnLoading( false );
        }
    }

    const deleteRegionHandler = async( ) => {
        const res = await deleteRegion( {
          userId: user?._id!,
          regionId: data?.region._id!
        } );
    
        responseToast( res, navigate, "/admin/region" );
      }

    useEffect( () => {
        if( data ){
            setRegionUpdate( {
                countryNameUpdate: data.region.countryName || "",
                countryAbbreviationUpdate: data.region.countryAbbreviation || "",
            } );
        }
      }, [ data ] );
    
      if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20}/> : <article>
          <button className="product-delete-btn" onClick={deleteRegionHandler}>
            <FaTrash />
          </button>
          <form onSubmit={updateRegionHandler}>
            <h2>Manage Region</h2>
            <div>
              <label>Country Name</label>
              <input
                type="text"
                name="countryNameUpdate"
                placeholder="Country Name"
                required
                value={countryNameUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Country Abbreviation</label>
              <input
                type="text"
                placeholder="Country Abbreviation"
                required
                name="countryAbbreviationUpdate"
                value={countryAbbreviationUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <button type="submit" disabled={isBtnLoading} >Update</button>
          </form>
        </article> }
      </main>
    </div>
  );
};

export default RegionManagement;
