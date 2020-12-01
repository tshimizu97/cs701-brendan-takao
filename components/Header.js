import React, { useState, useEffect} from 'react'
import UserContext from '../pages/_app'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Header(props) {
  /* function to log out the user */
  const logOut = event => {
    props.setUserInfo({loggedIn: false});
    localStorage.clear();
  }

  useEffect(()=>{
    const storaged = {
      loggedIn: localStorage.getItem("loggedIn"),
      user: localStorage.getItem("user")
    }
    props.setUserInfo(storaged);
  }, [])

  if (props.userInfo.loggedIn) {
    return (
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.header_element}>
            <img
              src="/favicon.ico"
              alt="image"
            />
          </a>
        </Link>
        <button onClick={logOut}>
          Log out
        </button>
      </header>
    )
  }

  else {
    return (
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.header_element}>
            <img
              src="/favicon.ico"
              alt="image"
            />
          </a>
        </Link>
        <Link href="/LogIn">
          <a className={styles.header_element}>
            Log in
          </a>
        </Link>
      </header>
    )
  }
}
