import React, { useState } from 'react'
import '../styles/globals.css'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  const initUserInfo = {
    user: "",
    loggedIn: false
  }
  const [userInfo, setUserInfo] = useState(initUserInfo);

  return (
    <>
      <Header userInfo = {userInfo} setUserInfo={setUserInfo} />
      <Component userInfo = {userInfo} setUserInfo={setUserInfo} />
    </>
  )
}

export default MyApp
