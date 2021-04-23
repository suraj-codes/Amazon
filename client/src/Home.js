import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import Product from "./Product";
import { useStateValue } from "./StateProvider";

function Home() {
  const [products,setProducts] = useState([])
  const [{ basket, user }, dispatch] = useStateValue();
  useEffect(async() => { 
    if(!user){
      const ver = await axios.get("/ver")
      if(typeof(ver.data)=="string"){
        
      }else{
        
          
        dispatch({
          type: "SET_USER",
          user: {
            id: ver.data._id,
            name: ver.data.name,
            email: ver.data.email,
          },
        });
        
      };
    }else{
    }
      axios.get("https://fakestoreapi.com/products").then((res)=>{
        setProducts(res.data)
      }).catch((e)=>{
        console.log(e);
      })
    
  },[user]);
  
  
   
  return (
    <div className="home">
      
      <div className="home__container">
        <img
          className="home__image"
          src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
          alt=""
        />

<div className="home__row">
           { products.map(product=>(
              <Product
              id={product.id}
              title={product.title}
              price={product.price}
              rating={5}
              image={product.image}
            />
           
            ))}
        </div> 
      </div>
    </div>
  );
}

export default Home;
