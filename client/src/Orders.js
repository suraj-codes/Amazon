import React, { useState, useEffect } from 'react';
import './Orders.css'
import { useStateValue } from "./StateProvider";
import Order from './Order'
import axios from 'axios';

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
      if(user){
        const id = user.id
        axios.get("/orders",{params:{id}}).then((res)=>{
            setOrders(res.data)
        }).catch((e)=>{
            console.log(e)
        })
      }else{
          alert("failed")
      }

  }, [user])

    return (
        <div className='orders'>
            <h1>Your Orders</h1>

            <div className='orders__order'>
                {orders?.map(order => (
                    <Order order={order} />
                ))}
            </div>
        </div>
    )
}

export default Orders
