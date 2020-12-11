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

  if (props.userInfo.loggedIn) {
    // if logged in
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
        <Link
          href={{
            pathname: "/MyProfile",
            query: { username: localStorage.getItem("user")}
          }}>
          <a className={styles.header_element} >
            My Profile
          </a>
          </Link>
        <button
          className={styles.header_text}
          onClick={logOut}
        >
          Log out
        </button>
      </header>
    )
  }

  // if not logged in
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
