import React, { useState } from 'react'
import '../styles/globals.css'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  const initUserInfo = {
    user: "",
    loggedIn: false
  }
  const [userInfo, setUserInfo] = useState(initUserInfo);

  pageProps = {...pageProps, userInfo, setUserInfo}

  return (
    <>
      <Header {...pageProps} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
