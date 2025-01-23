import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { CreateRegionFormData } from "../../../types/types";
import { useCreateRegionMutation } from "../../../redux/api/regionAPI";

const NewRegion = () => {
    const [ region, setRegion ] = useState<CreateRegionFormData>( {
        countryName: "",
        countryAbbreviation: ""
    } );

    const [ createRegion ] = useCreateRegionMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isLoading, setIsLoading ] = useState<boolean>( false );

    const { countryName, countryAbbreviation } = region;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setRegion( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const createRegionHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsLoading( true );

        try{
            if( !countryName || !countryAbbreviation ){
              return;
            }
        
            const res = await createRegion( {
              id: user?._id!,
              regionData: {
                countryName,
                countryAbbreviation
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
          <form onSubmit={createRegionHandler}>
            <h2>New Region</h2>
            <div>
              <label>Country Name</label>
              <input
                type="text"
                name="countryName"
                placeholder="Country Name"
                required
                value={countryName}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Country Abbreviation</label>
              <input
                type="text"
                name="countryAbbreviation"
                placeholder="Country Abbreviation"
                required
                value={countryAbbreviation}
                onChange={changeInputHandler}
              />
            </div>
            <button type="submit" disabled={isLoading} >Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewRegion;
