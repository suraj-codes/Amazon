import React, { useState } from 'react';
import './Login.css'
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
    
  const [{ user }, dispatch] = useStateValue();
    const history = useHistory();
    const [users,setUser] = useState({email:"",password:""})
    const signIn = e => {
        e.preventDefault();
        axios.get("/users",{params:{email:users.email,password:users.password}}).then((res)=>{
            if(typeof(res.data)==="string"){
                alert(res.data)
            }else{
                Cookies.set("token",res.data.token)
                history.push("/")

                dispatch({
                    type: "SET_USER",
                    user: {
                      id: res.data.users._id,
                      name: res.data.users.name,
                      email: res.data.users.email,
                    },
                  });
            }
        }).catch((e)=>{
            console.log(e)
        })
    }

    return (
        <div className='login'>
            <Link to='/'>
                <img
                    className="login__logo"
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png' 
                />
            </Link>

            <div className='login__container'>
                <h1>Sign-in</h1>

                <form>
                    <h5>E-mail</h5>
                    <input type='text' onChange={(e)=>{
                        setUser((prevState)=>({...prevState,email:e.target.value}))
                    }}/>

                    <h5>Password</h5>
                    <input type='password' onChange={(e)=>{
                        setUser((prevState)=>({...prevState,password:e.target.value}))
                    }} />

                    <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button>
                </form>

                <p>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>
                <Link to='/register'>
                    <button className='login__registerButton'>Create your Amazon Account</button>
                </Link>
            </div>
        </div>
    )
}

export default Login
