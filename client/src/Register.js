import React, { useState } from 'react'
import "./Register.css"
import {useHistory} from "react-router-dom";
import axios from "axios"
import { Link } from "react-router-dom";
const Register = () => {
    const history = useHistory()
    const [user,setUser]=useState({name:"",email:"",password:""})
    
    const register=(e)=>{
        e.preventDefault();
        if (user.name===""||user.email===""||user.password==="") {
            alert("please fill all fields")
        }else{
            axios.post('/register', {
                name: user.name,
                email: user.email,
                password: user.password
              }).then((res)=>{
                  if(res.status===200){
                      alert(res.data);
                      history.push("/login")
                  }
              }).catch((e)=>{
                  console.log("failed");
              });
        }
        
    }
    return (
        <div className="register">
            <Link to='/'>
                <img
                    className="register__logo"
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png' 
                />
            </Link>

            <div className='register__container'>
                <h1>Create Account</h1>

                <form>
                <h5>Name</h5>
                    <input required type='text' onChange={(e)=>{
                        setUser((prevState)=>({...prevState,name:e.target.value}))
                    }}/>
                    <h5>E-mail</h5>
                    <input required type='text' onChange={(e)=>{
                        setUser((prevState)=>({...prevState,email:e.target.value}))
                    }}/>

                    <h5>Password</h5>
                    <input required type='password' onChange={(e)=>{
                        setUser((prevState)=>({...prevState,password:e.target.value}))
                    }}/>

                    <button type='submit' onClick={register} className='register__signUpButton'>Sign Up</button>
                </form>

                <p>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>
                <Link to='/login'>
                    <button className='register__loginButton'>Login To your Amazon Account</button>
                </Link>
            </div>
        </div>
    )
}

export default Register
