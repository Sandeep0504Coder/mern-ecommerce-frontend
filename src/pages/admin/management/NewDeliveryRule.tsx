import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { CreateDeliveryRuleFormData } from "../../../types/types";
import { useCreateDeliveryRuleMutation } from "../../../redux/api/deliveryRuleAPI";

const NewDeliveryRule = () => {
    const [ deliveryRule, setDeliveryRule ] = useState<CreateDeliveryRuleFormData>( {
        ruleName: "",
        subtotalMinRange: 0,
        subtotalMaxRange: 0,
        amount: 0,
        percentage: 0,
        setDeliveryFeeTo: "Greater",
    } );

    const [ createDeliveryRule ] = useCreateDeliveryRuleMutation();
    const navigate = useNavigate();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ isLoading, setIsLoading ] = useState<boolean>( false );

    const { ruleName, subtotalMinRange, subtotalMaxRange, amount, percentage, setDeliveryFeeTo } = deliveryRule;

    const changeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
  
      setDeliveryRule( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }

    const handleRadioInputClick = ( name: string, value: string ) => {
      setDeliveryRule( ( prevState ) => ( {
        ...prevState,
        [ name ]: value,
      } ) );
    }
 
    const createDeliveryRuleHandler = async( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsLoading( true );

        try{
            if( !ruleName || !subtotalMinRange || !amount || !percentage || !setDeliveryFeeTo ){
              return;
            }
        
            const res = await createDeliveryRule( {
              id: user?._id!,
              deliveryRuleData: {
                ruleName,
                subtotalMinRange,
                subtotalMaxRange,
                amount,
                percentage,
                setDeliveryFeeTo
              },
            } );
        
            responseToast( res, navigate,"/admin/deliveryRule" );
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
          <form onSubmit={createDeliveryRuleHandler}>
            <h2>New Delivery Fee Rule</h2>
            <div>
              <label>Rule Name</label>
              <input
                type="text"
                name="ruleName"
                placeholder="Rule Name"
                required
                value={ruleName}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Min Range</label>
              <input
                type="number"
                placeholder="Min Range"
                required
                name="subtotalMinRange"
                value={subtotalMinRange}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Max Range</label>
              <input
                type="number"
                placeholder="Subtotal Max Range"
                name="subtotalMaxRange"
                value={subtotalMaxRange}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Amount</label>
              <input
                type="number"
                placeholder="amount"
                required
                name="amount"
                value={amount}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <label>Percentage</label>
              <input
                type="number"
                placeholder="percentage"
                required
                name="percentage"
                value={percentage}
                onChange={changeInputHandler}
              />
            </div>
            <div>
              <label>Set DeliveryFee To</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ setDeliveryFeeTo == "Greater" ? "blue" : "black"}`,color: setDeliveryFeeTo == "Greater" ? "blue" : "black", }}>
                  <input
                    type="radio"
                    name="setDeliveryFeeTo"
                    value="Greater"
                    checked={ setDeliveryFeeTo == "Greater" }
                    onChange={()=>{handleRadioInputClick( "setDeliveryFeeTo", "Greater" )}}
                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                  />
                  Greater
                </label>
                <label style={{ display: "flex", gap: "0.5rem", borderWidth: "2px", borderColor: "black", borderStyle: "solid", justifyContent: "center", cursor: "pointer", width: "4rem", height: "2rem", borderRadius: "0.5rem",  border: `2px solid ${ setDeliveryFeeTo == "Leaser" ? "blue" : "black"}`,color: setDeliveryFeeTo == "Leaser" ? "blue" : "black", }}>
                  <input
                    type="radio"
                    name="setDeliveryFeeTo"
                    value="Leaser"
                    checked={ setDeliveryFeeTo == "Leaser" }
                    onChange={()=>{handleRadioInputClick( "setDeliveryFeeTo", "Leaser" )}}
                    style={{ position: "absolute", clip: "rect(0, 0, 0, 0)"}}
                  />
                  Leaser
                </label>
              </div>
            </div>
            <button type="submit" disabled={isLoading} >Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewDeliveryRule;
