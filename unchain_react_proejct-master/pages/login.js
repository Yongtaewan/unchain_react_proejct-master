//import React from 'react'
import React, { useState } from 'react'
//import Axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../pages/_actions/user_action';
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Link from 'next/link'
import { useRouter } from 'next/router'

function login(props) {
  
  const dispatch = useDispatch();
  const router = useRouter();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
      event.preventDefault();
      console.log(Email)
      console.log(Password)
      let body = {
          email: Email,
          password: Password
      }

  dispatch(loginUser(body))
        .then(response => {
          if (response.payload.loginSuccess) {
            router.push('/')
            } else {
                router.push('/') //alert('login failed')
              }
          })
  


  }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <h1>Unchain login</h1>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default  login