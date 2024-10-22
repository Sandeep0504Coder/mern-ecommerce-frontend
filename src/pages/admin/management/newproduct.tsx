import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useCreateProductMutation } from "../../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [ description, setDescription ] = useState<string>( "" );
  const [ createProduct ] = useCreateProductMutation();
  const navigate = useNavigate();
  const { user } = useSelector( ( state: RootState ) => state.userReducer );
  const [ isLoading, setIsLoading ] = useState<boolean>( false );
  const photos = useFileHandler( "multiple", 10, 5 ); 

  const createProductHandler = async( e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading( true );

    try{
      if( !name || !price || stock < 0 || !category ){
        return;
      }
  
      if( !photos.file || photos.file.length === 0 ) return;
  
      const formData = new FormData( );
  
      formData.set( "name", name );
      formData.set( "price", price.toString() );
      formData.set( "stock", stock.toString() );
      formData.set( "category", category );
      formData.set( "description", description );
  
      photos.file.forEach( ( file ) => {
        formData.append( "photos", file );
      } )
      
  
      const res = await createProduct( {
        id: user?._id!,
        formData
      } );
  
      responseToast( res, navigate,"/admin/product" );
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
          <form onSubmit={createProductHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                placeholder="Write product description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input type="file" accept="images/*" multiple required onChange={photos.changeHandler} />
            </div>
            {
              photos.error && <p>{photos.error}</p>
            }
            {
              photos.preview &&
              <div style={{display: "flex", gap: "1rem", overflowX: "auto"}}>
                {
                  photos.preview.map( ( img, i ) => (
                    <img style={{width: 100, height: 100, objectFit: "cover"}} key={i} src={img} alt="New Image"/>
                  ) )
                }
              </div>
            }
            <button type="submit" disabled={isLoading} >Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
