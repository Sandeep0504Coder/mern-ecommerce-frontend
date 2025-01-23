import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Filter, HomePageContentUpdateFormData } from "../../../types/types";
import { RootState } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";
import { useFileHandler } from "6pp";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useHomePageContentDetailsQuery, useUpdateHomePageContentMutation } from "../../../redux/api/homePageContentAPI";

const HomePageManagement = () => {
  const navigate = useNavigate();
  const [ updateHomePageContent ] = useUpdateHomePageContentMutation();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );

  const params = useParams();

  const { data, isLoading, isError } = useHomePageContentDetailsQuery( {userId: user?._id!, homePageContentId: params.id! } );

  const [ btnLoading, setBtnLoading ] = useState<boolean>( false );
  const [ homePageContentUpdate, setHomePageContentUpdate ] = useState<HomePageContentUpdateFormData>( {
    promotionalTextUpdate: "",
    productSectionsUpdate: [],
  } );

  const {promotionalTextUpdate, productSectionsUpdate } = homePageContentUpdate;

  const bannerssFile = useFileHandler( "multiple", 10, 5 );

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading( true );
    
    try{
      let formData = new FormData( );

      if(promotionalTextUpdate) formData.set( "promotionalText", promotionalTextUpdate );

      if( bannerssFile.file && bannerssFile.file.length > 0 ){
        bannerssFile.file.forEach( ( file )  => {
          formData.append( "banners", file );
        } )
      }

      // Serialize the variants array
      formData.set("productSections", JSON.stringify( productSectionsUpdate ) );

      const res = await updateHomePageContent( {
        userId: user?._id!,
        homePageContentId: data?.homePageContent._id!,
        formData
      } );

      responseToast( res, navigate, "/admin/homePageContent" );
    } catch( error ){
      console.log( error );
    } finally {
      setBtnLoading( false );
    }
  };

  const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    setHomePageContentUpdate( ( prevState ) => ( {
      ...prevState,
      [ e.target.name ]: e.target.value,
    } ) );
  }

  const handleProductSectionsFilterChange = (productSectionIndex: number, filterIndex: number, field: keyof Filter, value: string) => {
    const updatedProductSections = structuredClone( productSectionsUpdate );
    updatedProductSections[productSectionIndex].filters[filterIndex][field] = value;
    setHomePageContentUpdate( {...homePageContentUpdate, productSectionsUpdate: updatedProductSections } );
  };

  const removeProductSectionFilter = ( productSectionIndex: number, filterIndex: number ) => {
    const updatedProductSections = structuredClone( productSectionsUpdate );
    updatedProductSections[productSectionIndex].filters = updatedProductSections[productSectionIndex].filters.filter( ( filter, index ) => {
      console.log(filter);
      
      return index !== filterIndex;
    } );
    setHomePageContentUpdate( {...homePageContentUpdate, productSectionsUpdate: updatedProductSections } );
  };

  const handleProductSectionChange = (productSectionIndex: number, field: "sectionLabel" , value: string) => {
    const updatedProductSections = structuredClone( productSectionsUpdate );
    updatedProductSections[productSectionIndex][field] = value;
    setHomePageContentUpdate( {...homePageContentUpdate, productSectionsUpdate: updatedProductSections } );
  };

  const removeProductSection = ( productSectionIndex: number ) => {
    let updatedProductSections = structuredClone( productSectionsUpdate );
    updatedProductSections = updatedProductSections.filter( ( productSection, index ) => {
      console.log( productSection );

      return index !== productSectionIndex;
    } );
    setHomePageContentUpdate( {...homePageContentUpdate, productSectionsUpdate: updatedProductSections } );
  };

  const addFilterOption = (productSectionIndex: number) => {
    let updatedProductSections = structuredClone( productSectionsUpdate );
    updatedProductSections[ productSectionIndex ].filters.push( { key: "", value: "" } );
    setHomePageContentUpdate( {...homePageContentUpdate, productSectionsUpdate: updatedProductSections } );
  };

  const addProductSection = () => {
    setHomePageContentUpdate( { ...homePageContentUpdate, productSectionsUpdate: [...productSectionsUpdate, { filters: [{ key: "", value: "" }], sectionLabel: "" }] } );
  };


  useEffect(() => {
    if( data ){
        setHomePageContentUpdate( {
            productSectionsUpdate: data?.homePageContent.productSections,
            promotionalTextUpdate: data?.homePageContent.promotionalText!,
        } )
    }
  }, [ data ] );

  if( isError ) return <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20}/> : (
          <>
            <section>
              <strong>{`ID - ${data?.homePageContent._id}`}</strong>
              <img src={data?.homePageContent.banners?.[0].url} alt="Product" />
            </section>
            <article>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Promotional Text</label>
                  <input
                    type="text"
                    placeholder="Promotional Text"
                    value={promotionalTextUpdate}
                    name="promotionalTextUpdate"
                    onChange={changeInputHandler}
                  />
                </div>
                <h3>Product Sections</h3>
                {productSectionsUpdate.map( ( productSection, productSectionIndex ) => (
                  <div className="product-variant" key={productSectionIndex}>
                    { productSection.filters.map( ( filter, filterIndex ) => (
                      <div key={filterIndex}>
                        <div className="product-varient-config">
                          <label>Filter Key</label>
                          <input
                            type="text"
                            placeholder="Filter Key (e.g., category, price)"
                            value={filter.key}
                            onChange={( e ) => handleProductSectionsFilterChange( productSectionIndex, filterIndex, "key", e.target.value )}
                            required
                          />
                        </div>
                        <div className="product-varient-config">
                          <label>Filter Value</label>
                          <input
                              type="text"
                              placeholder="Filter Value (e.g., mobile, electronics appliances)"
                              value={filter.value}
                              onChange={( e ) => handleProductSectionsFilterChange( productSectionIndex, filterIndex, "value", e.target.value )}
                              required
                          />
                        </div>
                        <button className="remove-config" onClick={( ) => removeProductSectionFilter( productSectionIndex, filterIndex )}>
                          <IoIosRemoveCircleOutline />
                        </button>
                      </div>
                    ) ) }
                    <button type="button" onClick={() => addFilterOption(productSectionIndex)}>Add Filter Option</button>
                    <div style={{marginTop: "1.5rem"}}>
                      <div className="product-varient-config">
                        <label>Product Section Label</label>
                        <input type="text" placeholder="Product Section Label" value={productSection.sectionLabel} onChange={(e) => handleProductSectionChange(productSectionIndex, "sectionLabel", e.target.value)} required />
                      </div>
                      <button className="remove-variant" onClick={( ) => removeProductSection( productSectionIndex )}>
                        <IoIosRemoveCircleOutline />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addProductSection}>Add Product Section</button>
                <div>
                  <label>banners</label>
                  <input type="file" accept="images/*" multiple onChange={bannerssFile.changeHandler} />
                </div>
                {bannerssFile.error && <p>{bannerssFile.error}</p>}
                {
                  bannerssFile.preview &&
                    <div style={{display: "flex", gap: "1rem", overflowX: "auto"}}>
                      {bannerssFile.preview.map( ( img, i ) => ( <img style={{width: 100, height: 100, objectFit: "cover"}} key={i} src={img} alt="New Image"/> ) )}
                    </div>
                }
                <button disabled={btnLoading} type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default HomePageManagement;
