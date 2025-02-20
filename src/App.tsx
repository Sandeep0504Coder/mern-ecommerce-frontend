import { Suspense, lazy, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Loader from './components/Loader'
import Header from './components/Header'
import { Toaster } from "react-hot-toast"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { userExist, userNotExist } from './redux/reducer/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './redux/api/userAPI'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RootState } from './redux/store'
import Footer from './components/Footer'

const Home = lazy( ( ) => import( "./pages/Home" ) )
const Cart = lazy( ( ) => import( "./pages/Cart" ) )
const Search = lazy( ( ) => import( "./pages/Search" ) )
const Login = lazy( ( ) => import( "./pages/Login" ) )
const Shipping = lazy( ( ) => import( './pages/Shipping' ) )
const Checkout = lazy( ( ) => import( './pages/Checkout' ) )
const Orders = lazy( ( ) => import( './pages/Orders' ) )
const MyAddresses = lazy( ( ) => import( './pages/MyAddresses' ) )
const NewAddress = lazy( ( ) => import( './pages/management/NewAddress' ) )
const AddressManagement = lazy( ( ) => import( './pages/management/AddressManagement' ) )
const OrderDetails = lazy( ( ) => import( './pages/OrderDetails' ) )
const Invoice = lazy( ( ) => import( './pages/Invoice' ) )
const ProductDetails = lazy( ( ) => import( './pages/ProductDetails' ) )
const PageNotFound = lazy( ( ) => import( './pages/PageNotFound' ) )
//Admin Routes importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));
const DeliveryRules = lazy(() => import("./pages/admin/DeliveryRules"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const HomePageManager = lazy(() => import("./pages/admin/HomePageManager"));
const Regions = lazy(() => import('./pages/admin/Regions'));
const Barcharts = lazy(() => import("./pages/admin/charts/BarChats"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const NewCoupon = lazy(() => import("./pages/admin/management/NewCoupon"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const NewDeliveryRule = lazy(() => import("./pages/admin/management/NewDeliveryRule"));
const NewRegion = lazy(() => import("./pages/admin/management/NewRegion"));
const NewState = lazy(() => import('./pages/admin/management/NewState'));
const RegionManagement = lazy(() => import("./pages/admin/management/RegionManagement"));
const HomePageManagement = lazy(() => import('./pages/admin/management/HomePageManagement'));
const StateManagement = lazy(() => import('./pages/admin/management/StateManagement'));
const DeliveryRuleManagement = lazy(() => import('./pages/admin/management/DeliveryRuleManagement'));
const SystemSettingManagement = lazy(() => import('./pages/admin/management/SystemSettingManagement'));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const ProductRecommendationManagement = lazy(
  () => import("./pages/admin/management/ProductRecommendationManagement")
);
const CouponManagement = lazy(
  () => import("./pages/admin/management/CouponManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  const dispatch = useDispatch( );

  useEffect( ( ) => {
  onAuthStateChanged( auth, async( user ) => {
    try{
      if( user ){
        const data = await getUser( user.uid );
        dispatch( userExist( data.user ) );
      } else {
        dispatch( userNotExist( ) );
      }
    } catch( e ){
      console.log( e );
    }
  } );
  }, [ ] );
  
  const { user, loading } = useSelector( ( state: RootState ) => ( state.userReducer ) )

  return loading ? <Loader/> : (
    <Router>
      {/* Header */}
      <Header user={user}/>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/productDetails/:id' element={<ProductDetails/>}/>
          {/*Not Logged In Route */}
          <Route path='/login' element={
            <ProtectedRoute isAuthenticated={ user ? false : true }>
              <Login/>
            </ProtectedRoute>
          }/>
          {/*Logged In User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={ user ? true : false }/>}>
            <Route path='/shipping' element={<Shipping/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/addresses' element={<MyAddresses/>}/>
            <Route path='/createAddress' element={<NewAddress/>}/>
            <Route path='/manageAddress/:id' element={<AddressManagement/>}/>
            <Route path='/orderDetails/:id' element={<OrderDetails/>}/>
            <Route path='/viewInvoice/:id' element={<Invoice/>}/>
            <Route path='/pay' element={<Checkout/>}/>
          </Route>
          
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={ user? true : false }
                adminOnly={ true }
                admin={ user?.role === "admin" ? true : false }
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="admin/coupon" element={<Coupons/>} />
            <Route path="admin/deliveryRule" element={<DeliveryRules/>} />
            <Route path="admin/systemSetting" element={<SystemSettings/>} />
            <Route path="admin/region" element={<Regions/>} />
            <Route path="admin/homePageContent" element={<HomePageManager/>} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Site Configuration */}
            <Route path="/admin/deliveryRule/new" element={<NewDeliveryRule />} />
            <Route path="/admin/deliveryRule/:id" element={<DeliveryRuleManagement />} />
            <Route path="admin/systemSetting/:id" element={<SystemSettingManagement/>} />
            <Route path="admin/region/new" element={<NewRegion/>} />
            <Route path="admin/region/addState/:id" element={<NewState/>} />
            <Route path="admin/region/manageState/regionId/:regionId/stateId/:stateId" element={<StateManagement/>} />
            <Route path="admin/region/:id" element={<RegionManagement/>} />
            <Route path="admin/homePageContent/:id" element={<HomePageManagement/>} />

            {/* Management */}
            <Route path="/admin/coupon/new" element={<NewCoupon />} />
            <Route path="admin/coupon/:id" element={<CouponManagement/>} />
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/product/recommendations/:id" element={<ProductRecommendationManagement />} />

            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
          </Route>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center"/>
    </Router>
  );
}

export default App
