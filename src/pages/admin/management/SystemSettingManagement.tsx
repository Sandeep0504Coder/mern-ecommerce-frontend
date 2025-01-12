import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { UpdateSystemSettingFormData } from "../../../types/types";
import { Skeleton } from "../../../components/Loader";
import { useSystemSettingDetailsQuery, useUpdateSystemSettingMutation } from "../../../redux/api/systemSettingAPI";
import { responseToast } from "../../../utils/features";

const SystemSettingManagement = () => {
    const [ updateSystemSetting ] = useUpdateSystemSettingMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>( false );
    const params = useParams();

    const { data, isLoading, isError } = useSystemSettingDetailsQuery( { userId: user?._id!, systemSettingId: params.id!} );

    const [ systemSettingUpdate, setSystemSettingUpdate ] = useState<UpdateSystemSettingFormData>( {
        entityIdUpdate: "",
        settingValueUpdate: ""
    } );

    const { entityIdUpdate, settingValueUpdate } = systemSettingUpdate;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
      const { name, value } = e.target;
  
      setSystemSettingUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }

    const handleRadioInputClick = ( name: string, value: string ) => {
        setSystemSettingUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const updateSystemSettingHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsBtnLoading( true );

        try{
            const res = await updateSystemSetting( {
              userId: user?._id!,
              systemSettingId: data?.systemSetting._id!,
              updateSystemSettingData: {
                entityId: entityIdUpdate,
                settingValue: settingValueUpdate
              }
            } );
        
            responseToast( res, navigate, "/admin/systemSetting" );
        } catch( error ){
            console.log( error );
        } finally {
            setIsBtnLoading( false );
        }
    }

    useEffect( () => {
        if( data ){
          setSystemSettingUpdate( {
            entityIdUpdate: data.systemSetting.entityId,
            settingValueUpdate: data.systemSetting.settingValue
          } );
        }
      }, [ data ] );
    
      if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20}/> : <article>
          <form onSubmit={updateSystemSettingHandler}>
            <h2>Manage System Setting</h2>
            <div>
              <label>Setting Category</label>
              <input
                type="text"
                disabled
                placeholder="Setting Category"
                value={data?.systemSetting.settingCategory}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Setting Name</label>
              <input
                type="text"
                placeholder="Setting Name"
                disabled
                value={data?.systemSetting.settingName}
                onChange={changeInputHandler}
              />
            </div>
            { ( entityIdUpdate && entityIdUpdate.length > 0 ) && <div>
                <select name="entityIdUpdate" required value={entityIdUpdate} onChange={changeInputHandler}>
                    <option key={""} value="">Select Setting Value</option>
                    {data?.systemSetting.entityOptions?.map( ( entityOption ) => ( <option key={entityOption._id} value={entityOption._id}>{entityOption.ruleName}</option> ) )}
                </select>
            </div>}

            { ( entityIdUpdate && entityIdUpdate.length > 0 ) ? ( <div>
                <label>Enabled</label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                    <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ settingValueUpdate == "true" ? "blue" : "black"}`,color: settingValueUpdate == "true" ? "blue" : "black", }}>
                        <input
                            type="radio"
                            name="settingValueUpdate"
                            value="true"
                            checked={settingValueUpdate=="true"}
                            onChange={()=>{handleRadioInputClick( "settingValueUpdate", "true" )}}
                            style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                        />
                        True
                    </label>
                    <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ settingValueUpdate == "false" ? "blue" : "black"}`,color: settingValueUpdate == "false" ? "blue" : "black", }}>
                        <input
                            type="radio"
                            name="settingValueUpdate"
                            value="false"
                            checked={settingValueUpdate=="false"}
                            onChange={()=>{handleRadioInputClick( "settingValueUpdate", "false" )}}
                            style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                        />
                        False
                    </label>
                </div>
            </div> ) : (
                <div>
                    <label>Setting Value</label>
                    <input
                        type="text"
                        placeholder="Setting Value"
                        required
                        name="settingValueUpdate"
                        value={settingValueUpdate}
                        onChange={changeInputHandler}
                    />
              </div>
            )}
            <button type="submit" disabled={isBtnLoading} >Update</button>
          </form>
        </article> }
      </main>
    </div>
  );
};

export default SystemSettingManagement;
