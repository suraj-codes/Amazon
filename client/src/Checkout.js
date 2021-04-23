import React, { useEffect } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";

import { Link,useHistory } from "react-router-dom";
import axios from "axios";
function Checkout() {
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
    }
    
  }, [user])
  return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />

        <div>
          <h3>Hello, {user?user.name:"Guest"}</h3>
          <h2 className="checkout__title">Your shopping Basket</h2>
        <div className="checkout__items">
          {basket.length==0?<h2>Your Cart is Empty, Please add products to cart. <Link to="/"> ADD NOW</Link></h2>:
          basket.map(item => (
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))
}
</div>
        </div>
      </div>

      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  );
}

export default Checkout;
