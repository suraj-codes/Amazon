import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import Orders from "./Orders";
import Register from "./Register";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51IW4FxL68S1WY1CJplCDs0lYegCwRTTTmVXHokAZqEWrcqU5rrj5d8QGxyIRRLeR3FzZ8e7xdH5wvrxRuGhwXf7300ezo8GxNM"
);

function App() {

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            
            <Register />
          </Route>
          <Route exact path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route exact path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route exact path="/">
            <Header />
            <Home />
          </Route>
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
