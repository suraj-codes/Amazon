import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import Cookies from 'js-cookie'
function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [addr,setAddr] = useState({})
  const history = useHistory();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(async() => {
    if(!user){
      const token = Cookies.get("token")
      const ver = await axios.get("/ver",{params:{token}})
      if(typeof(ver.data)=="string"){
        console.log("NO");
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
    // generate the special stripe secret which allows us to charge a customer
    // const getClientSecret = async () => {
    //   const response = await axios.post(`/payments/create?total=${getBasketTotal(basket) * 100}`);
    //   setClientSecret(response.data.clientSecret);
    // };

    // getClientSecret();





    


  // Step 1: Get user coordinates
function getCoordintes() {
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude.toString();
		var lng = crd.longitude.toString();
		var coordinates = [lat, lng];
		getCity(coordinates);
		return;

	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
	var xhr = new XMLHttpRequest();
	var lat = coordinates[0];
	var lng = coordinates[1];

	// Paste your LocationIQ token below.
	xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.49fd5203799fe38a65295fec96174630&lat="+lat+"&lon="+lng+"&format=json", true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	xhr.addEventListener("readystatechange", processRequest, false);

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			var city = response.address.city;
			setAddr(response.address);
			return;
		}
	}
}

getCoordintes();
  }, [basket,user]);


  const handleSubmit = async (event) => {
    setProcessing(true);
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const amount = Math.floor(getBasketTotal(basket))
        const response = await axios.post(
          "https://surajcodesamazon.herokuapp.com//stripe/charge",
          {
            amount:amount*100,
            id,
          }
        );
        if (response.data.success) {
          const id=user.id
          alert("Order Placed!!")
          axios.post("/orders",{id,basket}).then((res)=>{console.log("SUCCESS");}).catch((e)=>{console.log(e)})
          history.replace("/orders")
          dispatch({
                    type: "EMPTY_BASKET",
                  });
        }
      } catch (error) {
        console.log(error);
      }
      //send token to backend here
    } else {
      console.log(error.message);
    }

console.log(Cookies.get("token"))

  //   // do all the fancy stripe stuff...
  //   event.preventDefault();
  //   setProcessing(true);

  //   const payload = await stripe
  //     .confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: elements.getElement(CardElement),
  //       },
  //     })
  //     .then((paymentIntent) => {
  //       // paymentIntent = payment confirmation
  //       console.log("👱", paymentIntent);
  //       // db.collection("users")
  //       //   .doc(user?._id)
  //       //   .collection("orders")
  //       //   .doc(paymentIntent.id)
  //       //   .set({
  //       //     basket: basket,
  //       //     amount: paymentIntent.amount,
  //       //     created: paymentIntent.created,
  //       //   });

  //       setSucceeded(true);
  //       setError(null);
  //       setProcessing(false);

  //       dispatch({
  //         type: "EMPTY_BASKET",
  //       });

  //       history.replace("/orders");
  //     });
   };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };


  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>

        {/* Payment section - delivery address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.name}</p>
            <p>{addr.state_district}, {addr.county}</p>
            <p>{addr.state}, {addr.country} - {addr.postcode}</p>
          </div>
        </div>

        {/* Payment section - Review Items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* Payment section - Payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe magic will go */}

            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button onClick={processing || disabled || succeeded}>
                <span> {processing?<p>processing....</p> :"Buy Now"}</span>
                  
                </button>
              </div>

              {/* Errors */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
