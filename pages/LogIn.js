import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function LogIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [ifError, setIfError] = useState(false);
  const router = useRouter();

  const onSubmit = async event => {
    /* This function validates the log-in credientials and update log-in status. */
    event.preventDefault();

    // here, instead of setting if_success always as true, call a backend API to get if entered credential is valid or not
    // Can you do this, Brendan?
    const if_success  = true;

    if (if_success) {
      // store the result to the local storage
      localStorage.setItem('loggedIn', if_success);
      localStorage.setItem('user', userName);
      // redirect to the search page
      router.push('/');
    }
    else {
      // display the error message
      setIfError(true);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Log in</title> {/* Need to decide the project name*/}
        <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
      </Head>

      <main className={styles.main_horizontal}>
        <div className={styles.half}>
          <h1 className={styles.title}>
            TutorMatch
          </h1>
          <p className={styles.description}>
            Start learning with your tutor!
          </p>
        </div>

        <div className={styles.half}>
          <form
            className={styles.log_in}
            onSubmit={onSubmit}
          >
            <input
              type="text"
              placeholder="User Name"
              className={styles.input_bar}
              onChange={(input) => setUserName(input.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input_bar}
              onChange={(input) => setPassword(input.target.value)}
            />
            <input
              type="submit"
              value="Log In"
              className={styles.submit_button}
            />
          <Link href="/SignUp">
              <a className={styles.header_element}>
                Or Sign Up!
              </a>
            </Link>
            {ifError &&
              (<span className={styles.error_message}>
                Log-in Crediential was incorrect.
               </span>)
            }
          </form>
        </div>
      </main>
    </div>
  )
}
