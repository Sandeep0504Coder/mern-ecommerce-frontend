import {Link} from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useAllCategoriesQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/Loader"
import { CartItemType } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"
import { TbTruckDelivery } from "react-icons/tb"
import { LuShieldCheck } from "react-icons/lu"
import { FaHeadset } from "react-icons/fa"
import { Slider } from "6pp"
import { motion } from "framer-motion";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown } from "react-icons/fa6"
import { useHeroSectionDetailsQuery } from "../redux/api/homePageContentAPI"

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  const { data: categorieResponse, isLoading: categorieResponseLoading, isError: categorieResponseIsError } = useAllCategoriesQuery( "" );

  const addToCartHandler = ( cartItem: CartItemType ) => {
    if( cartItem.stock < 1 ) return toast.error( "Out of Stock." );

    dispatch( addToCart( {
      ...cartItem,
      updateItemIfFound: false,
    } ) );
  }
  
  const{ data, isLoading, isError } = useHeroSectionDetailsQuery( "" );

  if( isError ) toast.error( "Cannot fetch the products" );
  if( categorieResponseIsError ) toast.error( "Cannot fetch the categories" );

  return (
    <>
      <div className="home">
        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              { categorieResponseLoading ? <Skeleton className="categorySkeleton" width="10vw" length={10}/> : categorieResponse?.categories.map((category) => (
                <li key={category}>
                  <Link to={`/search?category=${category.toLowerCase()}`}>{category.toUpperCase( )}</Link>
                </li>
              ))}
            </ul>
          </aside>
          {isLoading ? <div style={{height: "135vh"}}><Skeleton className="bannerSkeleton" width="70vw" containerHeight="100%" height="100%" length={1}/></div> : <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={data?.homePageContent.banners.map( ( banner ) => banner.url ) || []}
          />}
        </div>
        { isLoading ?<><div className="productSkeleton" style={{paddingLeft:"2rem",paddingRight:"2rem"}}><Skeleton width="86.5vw" length={1}/></div><div className="productSkeleton" style={{height:"60vh", paddingLeft:"2rem",paddingRight:"2rem", width:"89vw"}}><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/></div><div className="productSkeleton" style={{paddingLeft:"2rem",paddingRight:"2rem"}}><Skeleton width="86.5vw" length={1}/></div><div className="productSkeleton" style={{height:"60vh", paddingLeft:"2rem",paddingRight:"2rem", width:"89vw"}}><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/><Skeleton width="80vw" containerHeight="100%" height="100%" length={1}/></div></> : data?.homePageContent.productSections.map(( productSection ) => (<>
          <h1>
          {productSection.sectionLabel}
          <Link to="/search" className="findmore">More</Link>
        </h1>
        <main>
          {productSection.products?.map( ( product ) => {
            return (
              <ProductCard
                key={product._id}
                productId={product._id}
                price={product.variants?.[0]?.price || product.price}
                name={product.name}
                stock={product.variants?.[0]?.stock || product.stock}
                photos={product.photos}
                variants={product.variants}
                handler={addToCartHandler}
              />
            )
          } )}
        </main>
        </>))}
      </div>
      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={ data?.homePageContent.promotionalVideo.url || videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {data?.homePageContent.promotionalTextLabel}
          </motion.h2>
          {data?.homePageContent.promotionalText.split( " " ).map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  )
}

export default Home