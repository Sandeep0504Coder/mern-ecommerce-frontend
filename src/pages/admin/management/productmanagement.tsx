import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Configuration, ProductUpdateFormData } from "../../../types/types";
import { RootState } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";
import { useFileHandler } from "6pp";
import { IoIosRemoveCircleOutline } from "react-icons/io";

const Productmanagement = () => {
  const navigate = useNavigate();
  const [ updateProduct ] = useUpdateProductMutation();
  const [ deleteProduct ] = useDeleteProductMutation();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );

  const params = useParams();

  const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

  const { price, photos, name, stock, category, description, variants } = data?.product || {
    price: 0,
    photos: [],
    name: "",
    stock: 0,
    category: "",
    description: "",
    variants: []
  };

  const [ btnLoading, setBtnLoading ] = useState<boolean>( false );
  const [ productUpdate, setProductUpdate ] = useState<ProductUpdateFormData>( {
    priceUpdate: price,
    stockUpdate: stock,
    nameUpdate: name,
    categoryUpdate: category,
    descriptionUpdate: description,
    variantsUpdate: variants
  } );

  const {priceUpdate, stockUpdate, nameUpdate, categoryUpdate, descriptionUpdate, variantsUpdate } = productUpdate;

  const photosFile = useFileHandler( "multiple", 10, 5 );

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading( true );
    
    try{
      const formData = new FormData( );

      if(priceUpdate) formData.set( "price", priceUpdate.toString( ) );
      if(nameUpdate) formData.set( "name", nameUpdate );
      if(categoryUpdate) formData.set( "category", categoryUpdate );
      if( descriptionUpdate ) formData.set( "description", descriptionUpdate );
      if(stockUpdate !== undefined) formData.set( "stock", stockUpdate.toString( ) );

      if( photosFile.file && photosFile.file.length > 0 ){
        photosFile.file.forEach( ( file )  => {
          formData.append( "photos", file );
        } )
      }

      // Serialize the variants array
      formData.set("variants", JSON.stringify( variantsUpdate ) );

      const res = await updateProduct( {
        id: user?._id!,
        productId: data?.product._id!,
        formData
      } );

      responseToast( res, navigate, "/admin/product" );
    } catch( error ){
      console.log( error );
    } finally {
      setBtnLoading( false );
    }
  };

  const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    setProductUpdate( ( prevState ) => ( {
      ...prevState,
      [ e.target.name ]: e.target.value,
    } ) );
  }

  const handleVariantConfigChange = (variantIndex: number, configIndex: number, field: keyof Configuration, value: string) => {
    const updatedVariants = structuredClone( variantsUpdate );
    updatedVariants[variantIndex].configuration[configIndex][field] = value;
    setProductUpdate( {...productUpdate, variantsUpdate: updatedVariants } );
  };

  const removeVariantConfig = ( variantIndex: number, configIndex: number ) => {
    const updatedVariants = structuredClone( variantsUpdate );
    updatedVariants[variantIndex].configuration = updatedVariants[variantIndex].configuration.filter( ( config, index ) => index !== configIndex );
    setProductUpdate( {...productUpdate, variantsUpdate: updatedVariants } );
  };

  const handleVariantChange = (variantIndex: number, field: "stock" | "price", value: number) => {
    const updatedVariants = structuredClone( variantsUpdate );
    updatedVariants[variantIndex][field] = value;
    setProductUpdate( {...productUpdate, variantsUpdate: updatedVariants } );
  };

  const removeVariant = ( variantIndex: number ) => {
    let updatedVariants = structuredClone( variantsUpdate );
    updatedVariants = updatedVariants.filter( ( variant, index ) => index !== variantIndex );
    setProductUpdate( {...productUpdate, variantsUpdate: updatedVariants } );
  };

  const addConfigOption = (variantIndex: number) => {
    let updatedVariants = structuredClone( variantsUpdate );
    updatedVariants[ variantIndex ].configuration.push( { key: "", value: "" } );
    setProductUpdate( {...productUpdate, variantsUpdate: updatedVariants } );
  };

  const addVariant = () => {
    setProductUpdate( { ...productUpdate, variantsUpdate: [...variantsUpdate, { configuration: [{ key: "", value: "" }], price: 0, stock: 0 }] } );
  };

  const deleteProductHandler = async( ) => {
    const res = await deleteProduct( {
      userId: user?._id!,
      productId: data?.product._id!
    } );

    responseToast( res, navigate, "/admin/product" );
  }

  useEffect(() => {
    if( data ){
      setProductUpdate( {
        priceUpdate: data?.product.price!,
        stockUpdate: data?.product.stock!,
        nameUpdate: data?.product.name!,
        categoryUpdate: data?.product.category!,
        descriptionUpdate: data?.product.description!,
        variantsUpdate: data?.product.variants
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
              <strong>{`ID - ${data?.product._id}`}</strong>
              <img src={photos?.[0]?.url} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>${price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteProductHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    name="nameUpdate"
                    onChange={changeInputHandler}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    name="priceUpdate"
                    onChange={changeInputHandler}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    name="stockUpdate"
                    onChange={changeInputHandler}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    name="categoryUpdate"
                    onChange={changeInputHandler}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    placeholder="Write product description here"
                    value={descriptionUpdate}
                    name="descriptionUpdate"
                    onChange={changeInputHandler}
                  />
                </div>
                <h3>Variants</h3>
                {variantsUpdate.map( ( variant, variantIndex ) => (
                  <div className="product-variant" key={variantIndex}>
                    { variant.configuration.map( ( config, configIndex ) => (
                      <div key={configIndex}>
                        <div className="product-varient-config">
                          <label>Config Key</label>
                          <input
                            type="text"
                            placeholder="Config Key (e.g., RAM)"
                            value={config.key}
                            onChange={( e ) => handleVariantConfigChange( variantIndex, configIndex, "key", e.target.value )}
                            required
                          />
                        </div>
                        <div className="product-varient-config">
                          <label>Config Value</label>
                          <input
                              type="text"
                              placeholder="Config Value (e.g., 4GB)"
                              value={config.value}
                              onChange={( e ) => handleVariantConfigChange( variantIndex, configIndex, "value", e.target.value )}
                              required
                          />
                        </div>
                        <button className="remove-config" onClick={( ) => removeVariantConfig( variantIndex, configIndex )}>
                          <IoIosRemoveCircleOutline />
                        </button>
                      </div>
                    ) ) }
                    <button type="button" onClick={() => addConfigOption(variantIndex)}>Add Configuration Option</button>
                    <div style={{marginTop: "1.5rem"}}>
                      <div className="product-varient-config">
                        <label>Price</label>
                        <input type="number" placeholder="Price" value={variant.price} onChange={(e) => handleVariantChange(variantIndex, "price", Number(e.target.value))} required />
                      </div>
                      <div className="product-varient-config">
                        <label>Stock</label>
                        <input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(variantIndex, "stock", Number(e.target.value))} required />
                      </div>
                      <button className="remove-variant" onClick={( ) => removeVariant( variantIndex )}>
                        <IoIosRemoveCircleOutline />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addVariant}>Add Variant</button>
                <div>
                  <label>Photos</label>
                  <input type="file" accept="images/*" multiple onChange={photosFile.changeHandler} />
                </div>
                {photosFile.error && <p>{photosFile.error}</p>}
                {
                  photosFile.preview &&
                    <div style={{display: "flex", gap: "1rem", overflowX: "auto"}}>
                      {photosFile.preview.map( ( img, i ) => ( <img style={{width: 100, height: 100, objectFit: "cover"}} key={i} src={img} alt="New Image"/> ) )}
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

export default Productmanagement;
