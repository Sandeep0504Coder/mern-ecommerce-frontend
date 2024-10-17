import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ProductUpdateFormData } from "../../../types/types";
import { RootState, server } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const navigate = useNavigate();
  const [ updateProduct ] = useUpdateProductMutation();
  const [ deleteProduct ] = useDeleteProductMutation();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );

  const params = useParams();

  const { data, isLoading, isError } = useProductDetailsQuery( params.id! );

  const { price, photo, name, stock, category, description } = data?.product || {
    price: 0,
    photo: "",
    name: "",
    stock: 0,
    category: "",
    description: ""
  };

  const [ productUpdate, setProductUpdate ] = useState<ProductUpdateFormData>( {
    priceUpdate: price,
    stockUpdate: stock,
    nameUpdate: name,
    categoryUpdate: category,
    descriptionUpdate: description,
    photoUpdate: photo,
    photoFile: undefined
  } );

  const {priceUpdate, stockUpdate, nameUpdate, categoryUpdate, descriptionUpdate, photoUpdate, photoFile } = productUpdate;

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProductUpdate( ( prevState ) => ( {
            ...prevState,
            photoUpdate: reader.result as string,
            photoFile: file,
          } ) );
        }
      };
    }
  };

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData( );

    if(priceUpdate) formData.set( "price", priceUpdate.toString( ) );
    if(photoFile) formData.set( "photo", photoFile as File );
    if(nameUpdate) formData.set( "name", nameUpdate );
    if(categoryUpdate) formData.set( "category", categoryUpdate );
    if( descriptionUpdate ) formData.set( "description", descriptionUpdate );
    if(stockUpdate !== undefined) formData.set( "stock", stockUpdate.toString( ) );

    const res = await updateProduct( {
      id: user?._id!,
      productId: data?.product._id!,
      formData
    } );

    responseToast( res, navigate, "/admin/product" );
  };

  const changeInputHandler = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    setProductUpdate( ( prevState ) => ( {
      ...prevState,
      [ e.target.name ]: e.target.value,
    } ) );
  }

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
        photoUpdate: "",
        photoFile: undefined,
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
              <img src={`${server}/${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
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
                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
