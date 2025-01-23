import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { UpdateStateFormData } from "../../../types/types";
import { Skeleton } from "../../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { useManageStateMutation, useRegionDetailsQuery, useRemoveStateMutation } from "../../../redux/api/regionAPI";

const StateManagement = () => {
    const [ manageState ] = useManageStateMutation();
    const [ removeState ] = useRemoveStateMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>( false );
    const params = useParams<{regionId: string; stateId: string;}>();

    const { data, isLoading, isError } = useRegionDetailsQuery( { userId: user?._id!, regionId: params.regionId!} );

    const [ stateUpdate, setStateUpdate ] = useState<UpdateStateFormData>( {
        stateNameUpdate: "",
        stateAbbreviationUpdate: ""
    } );

    const { stateNameUpdate, stateAbbreviationUpdate } = stateUpdate;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setStateUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const updateStateHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsBtnLoading( true );

        try{
            const res = await manageState( {
              id: user?._id!,
              regionId: data?.region._id!,
              stateId: params.stateId!,
              stateData: {
                stateName: stateNameUpdate,
                stateAbbreviation: stateAbbreviationUpdate
              }
            } );
        
            responseToast( res, navigate, "/admin/region" );
        } catch( error ){
            console.log( error );
        } finally {
            setIsBtnLoading( false );
        }
    }

    const deleteStateHandler = async( ) => {
        const res = await removeState( {
          id: user?._id!,
          regionId: data?.region._id!,
          stateId: params.stateId!,
        } );
    
        responseToast( res, navigate, "/admin/region" );
      }

    useEffect( () => {
        const stateDetails = data?.region.states.filter( ( state ) => state._id.toString() == params.stateId );

        if( stateDetails ){
            setStateUpdate( {
                stateNameUpdate: stateDetails[0].stateName || "",
                stateAbbreviationUpdate: stateDetails[0].stateAbbreviation || "",
            } );
        }
      }, [ data ] );
    
      if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20}/> : <article>
          <button className="product-delete-btn" onClick={deleteStateHandler}>
            <FaTrash />
          </button>
          <form onSubmit={updateStateHandler}>
            <h2>Manage State</h2>
            <div>
              <label>State Name</label>
              <input
                type="text"
                name="stateNameUpdate"
                placeholder="State Name"
                required
                value={stateNameUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>State Abbreviation</label>
              <input
                type="text"
                placeholder="State Abbreviation"
                required
                name="stateAbbreviationUpdate"
                value={stateAbbreviationUpdate}
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

export default StateManagement;
