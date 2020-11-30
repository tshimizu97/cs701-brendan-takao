import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Header() {
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  /* function to log out the user */
  const logOut = event => {
    event.preventDefault();
    setUser();
    setLoggedIn(false);
    localStorage.clear();
  }

  useEffect(()=>{
    setLoggedIn(localStorage.getItem("loggedIn"))
    setUser(localStorage.getItem("user"));
  }, [])

  if (loggedIn) {
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
          Click me!
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
