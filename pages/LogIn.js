import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function LogIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>Log in</title> {/* Need to decide the project name*/}
        <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
      </Head>

      <main className={styles.main_horizontal}>
        <div className={styles.half}>
          <h1 className={styles.title}>
            [Project Name]
          </h1>
          <p className={styles.description}>
            Start learning with your tutor!
          </p>
        </div>

        <div className={styles.half}>
          <form
            className={styles.log_in}
          >
            <input
              type="text"
              placeholder="User Name"
              className={styles.input_bar}
              onChange={(input) => setUserName(input.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              className={styles.input_bar}
              onChange={(input) => setPassword(input.target.value)}
            />
            <input
              type="submit"
              value="Log In"
              className={styles.submit_button}
            />
          </form>
        </div>
      </main>
    </div>
  )
}
