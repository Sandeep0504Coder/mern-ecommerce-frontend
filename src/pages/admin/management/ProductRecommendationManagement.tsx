import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAllProductsQuery, useManageRecommendationsMutation, useProductDetailsQuery } from "../../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const ProductRecommendationManagement = () => {
    const navigate = useNavigate();
    const [ manageRecommendations ] = useManageRecommendationsMutation();
    const { user } = useSelector( ( state: RootState ) => state.userReducer );
    const [ btnLoading, setBtnLoading ] = useState<boolean>( false );
    const params = useParams();

    const { data: allProductData, isLoading, isError } = useAllProductsQuery( user?._id! );

    const { data: productData, isLoading: productResonseIsLoading, isError: productResponseIsError } = useProductDetailsQuery( params.id! );

    const [selectedRecommendations, setSelectedRecommendations] = useState( new Set( ) );

    useEffect( ( ) => {
      const suggestedProductIds = new Set( productData?.product.suggestedItems.map( item => item.productId._id ) );
      setSelectedRecommendations( suggestedProductIds ); 
    }, [ productData ] );

    const handleCheckboxChange = ( productId: string ) => {
        const updatedSelections = new Set( selectedRecommendations );

        if( updatedSelections.has( productId ) ){
            updatedSelections.delete( productId );
        } else {
            updatedSelections.add( productId );
        }

        setSelectedRecommendations( updatedSelections );
    };

    const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try{
        const selectedRecommendationsArray = Array.from( selectedRecommendations );
        const suggestedProductIds = selectedRecommendationsArray.join( "," );
  
        const res = await manageRecommendations( {
          userId: user?._id!,
          productId: productData?.product._id!,
          suggestedProductIds
        } );
  
        responseToast( res, navigate, "/admin/product" );
      } catch( error ){
        console.log( error );
      } finally {
        setBtnLoading( false );
      }
    };

  if( isError || productResponseIsError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading || productResonseIsLoading ? <Skeleton length={20}/> : (
          <>
            <article>
              <h2>Manage Suggested Items</h2>
              <form onSubmit={submitHandler}>
                <p>Select Suggested Items:</p>
                <div style={{display:"flex",justifyContent:"space-between",flexDirection:"column"}}>
                { allProductData?.products.filter( ( product ) => product._id !== params.id ).map( ( product ) => (
                  <div key={product._id}>
                    <label>
                        <input
                          type="checkbox"
                          checked={selectedRecommendations.has(product._id)}
                          onChange={() => handleCheckboxChange(product._id)}
                        />
                      {product.name}
                    </label>
                  </div>
                ) ) }
                </div>
                <button disabled={btnLoading} type="submit">Save Suggestions</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductRecommendationManagement;
