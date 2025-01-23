import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { ManageStateFormData } from "../../../types/types";
import { useManageStateMutation } from "../../../redux/api/regionAPI";

const NewState = () => {
    const params = useParams();
    const [ state, setState ] = useState<ManageStateFormData>( {
        stateName: "",
        stateAbbreviation: ""
    } );

    const [ manageState ] = useManageStateMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isLoading, setIsLoading ] = useState<boolean>( false );

    const { stateName, stateAbbreviation } = state;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setState( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const addStateHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsLoading( true );

        try{
            if( !stateName || !stateAbbreviation ){
              return;
            }
        
            const res = await manageState( {
              id: user?._id!,
              regionId: params.id!,
              stateId: "0",
              stateData: {
                stateName,
                stateAbbreviation
              },
            } );
        
            responseToast( res, navigate,"/admin/region" );
        } catch( error ){
            console.log( error );
        } finally {
            setIsLoading( false );
        }
    }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={addStateHandler}>
            <h2>New State</h2>
            <div>
              <label>State Name</label>
              <input
                type="text"
                name="stateName"
                placeholder="State Name"
                required
                value={stateName}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>State Abbreviation</label>
              <input
                type="text"
                name="stateAbbreviation"
                placeholder="State Abbreviation"
                required
                value={stateAbbreviation}
                onChange={changeInputHandler}
              />
            </div>
            <button type="submit" disabled={isLoading} >Add</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewState;
