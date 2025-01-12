import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { CreateDeliveryRuleFormData, UpdateDeliveryRuleFormData } from "../../../types/types";
import { useDeleteDeliveryRuleMutation, useDeliveryRuleDetailsQuery, useUpdateDeliveryRuleMutation } from "../../../redux/api/deliveryRuleAPI";
import { Skeleton } from "../../../components/Loader";
import { FaTrash } from "react-icons/fa";

const DeliveryRuleManagement = () => {
    const [ updateDeliveryRule ] = useUpdateDeliveryRuleMutation();
    const [ deleteDeliveryRule ] = useDeleteDeliveryRuleMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>( false );
    const params = useParams();

    const { data, isLoading, isError } = useDeliveryRuleDetailsQuery( { userId: user?._id!, deliveryRuleId: params.id!} );

    const [ deliveryRuleUpdate, setDeliveryRuleUpdate ] = useState<UpdateDeliveryRuleFormData>( {
        ruleNameUpdate: "",
        subtotalMinRangeUpdate: 0,
        subtotalMaxRangeUpdate: 0,
        amountUpdate: 0,
        percentageUpdate: 0,
        setDeliveryFeeToUpdate: "Greater",
    } );

    const { ruleNameUpdate, subtotalMinRangeUpdate, subtotalMaxRangeUpdate, amountUpdate, percentageUpdate, setDeliveryFeeToUpdate } = deliveryRuleUpdate;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setDeliveryRuleUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }

    const handleRadioInputClick = ( name: string, value: string ) => {
        setDeliveryRuleUpdate( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const updateDeliveryRuleHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsBtnLoading( true );

        try{
            let deliveryRuleData: CreateDeliveryRuleFormData = {
                ruleName: ruleNameUpdate,
                subtotalMinRange: subtotalMinRangeUpdate,
                amount: amountUpdate,
                percentage: percentageUpdate,
                setDeliveryFeeTo: setDeliveryFeeToUpdate
            };

            if( subtotalMaxRangeUpdate ) deliveryRuleData[ "subtotalMaxRange" ] = subtotalMaxRangeUpdate;

            const res = await updateDeliveryRule( {
              id: user?._id!,
              deliveryRuleId: data?.deliveryRule._id!,
              deliveryRuleData
            } );
        
            responseToast( res, navigate, "/admin/deliveryRule" );
        } catch( error ){
            console.log( error );
        } finally {
            setIsBtnLoading( false );
        }
    }

    const deleteDeliveryRuleHandler = async( ) => {
        const res = await deleteDeliveryRule( {
          userId: user?._id!,
          deliveryRuleId: data?.deliveryRule._id!
        } );
    
        responseToast( res, navigate, "/admin/deliveryRule" );
      }

    useEffect( () => {
        if( data ){
          setDeliveryRuleUpdate( {
            ruleNameUpdate: data.deliveryRule.ruleName || "",
            subtotalMinRangeUpdate: data.deliveryRule.subtotalMinRange || 0,
            subtotalMaxRangeUpdate: data.deliveryRule.subtotalMaxRange || 0,
            amountUpdate: data.deliveryRule.amount || 0,
            percentageUpdate: data.deliveryRule.percentage || 0,
            setDeliveryFeeToUpdate: data.deliveryRule.setDeliveryFeeTo || "",
          } );
        }
      }, [ data ] );
    
      if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20}/> : <article>
          <button className="product-delete-btn" onClick={deleteDeliveryRuleHandler}>
            <FaTrash />
          </button>
          <form onSubmit={updateDeliveryRuleHandler}>
            <h2>Manage Delivery Fee Rule</h2>
            <div>
              <label>Rule Name</label>
              <input
                type="text"
                name="ruleNameUpdate"
                placeholder="Rule Name"
                required
                value={ruleNameUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Min Range</label>
              <input
                type="number"
                placeholder="Min Range"
                required
                name="subtotalMinRangeUpdate"
                value={subtotalMinRangeUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Max Range</label>
              <input
                type="number"
                placeholder="Subtotal Max Range"
                name="subtotalMaxRangeUpdate"
                value={subtotalMaxRangeUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Amount</label>
              <input
                type="number"
                placeholder="amount"
                required
                name="amountUpdate"
                value={amountUpdate}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Percentage</label>
              <input
                type="number"
                placeholder="percentage"
                required
                name="percentageUpdate"
                value={percentageUpdate}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Set DeliveryFee To</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ setDeliveryFeeToUpdate == "Greater" ? "blue" : "black"}`,color: setDeliveryFeeToUpdate == "Greater" ? "blue" : "black", }}>
                  <input
                    type="radio"
                    name="setDeliveryFeeToUpdate"
                    value="Greater"
                    checked={ setDeliveryFeeToUpdate == "Greater" }
                    onChange={()=>{handleRadioInputClick( "setDeliveryFeeToUpdate", "Greater" )}}
                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                  />
                  Greater
                </label>
                <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ setDeliveryFeeToUpdate == "Leaser" ? "blue" : "black"}`,color: setDeliveryFeeToUpdate == "Leaser" ? "blue" : "black", }}>
                  <input
                    type="radio"
                    name="setDeliveryFeeToUpdate"
                    value="Leaser"
                    checked={ setDeliveryFeeToUpdate == "Leaser" }
                    onChange={()=>{handleRadioInputClick( "setDeliveryFeeToUpdate", "Leaser" )}}
                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                  />
                  Leaser
                </label>
              </div>
            </div>
            <button type="submit" disabled={isBtnLoading} >Update</button>
          </form>
        </article> }
      </main>
    </div>
  );
};

export default DeliveryRuleManagement;
