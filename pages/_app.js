import React, { useState, useEffect } from 'react'
import '../styles/globals.css'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    setLoggedIn(localStorage.getItem("loggedIn"))
    setUser(localStorage.getItem("user"));
  }, [])

  return (
    <>
      <Header/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
