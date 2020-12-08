import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
//import { checkUsername, addProfile } from './api/gsheets'

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [ifError, setIfError] = useState(false);
  const router = useRouter();
  const initStates = {type: "tutor", writing: false, math: false,
                  physics: false, chemistry: false, computer_science: false,
                  other_sciences: false, spanish: false, french: false,
                  mandarin_chinese: false, other_languages: false};
  const [states, setStates] = useState(initStates);

  const onSubmit = async event => {
    /* This function validates if the username is unique, add a new profile,
       log the user into the system, and redirect to the main page.
     */
    event.preventDefault();

    // here, instead of setting if_unique_username always as true, call a backend API to check if userName is unique in the sysatem (boolean return value)
    const if_unique_username = true;
    // const if_unique_username = await checkUsername(userName);
    if (if_unique_username) {
      // call a function to make a new profile into Google sheets
      // await addProfile(userName, password, states);

      // log the user into the system
      localStorage.setItem('loggedIn', if_unique_username);
      localStorage.setItem('user', userName);

      // redirect to the search page
      router.push('/');
    }
    else {
      // display the error message
      setIfError(true);
    }
  }

  const onChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setStates({...states, [name]: value})
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sing Up</title> {/* Need to decide the project name*/}
        <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
      </Head>

      <main>
        <form
        className={styles.main_horizontal}
        onSubmit={onSubmit}
        >
          <div className={styles.half}>
            <input
              type="text"
              placeholder="First Name"
              className={styles.input_bar}
              onChange={(input) => setFirstName(input.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className={styles.input_bar}
              onChange={(input) => setLastName(input.target.value)}
            />
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
              value="Sign Up"
              className={styles.submit_button}
            />
          </div>
          <div className={styles.half}>
            <select
            name="type"
            value={states.tutor}
            onChange={onChange}
            >
              <option value={"tutor"}>Tutor</option>
              <option value={"tutee"}>Tutee</option>
            </select>
            <label>
              Writing
              <input
                type="checkbox"
                name="writing"
                className={styles.input_bar}
                checked={states.writing}
                onChange={onChange}
              />
            </label>
            <label>
              Math
              <input
                type="checkbox"
                name="math"
                className={styles.input_bar}
                checked={states.math}
                onChange={onChange}
              />
            </label>
            <label>
              Physics
              <input
                type="checkbox"
                name="physics"
                className={styles.input_bar}
                checked={states.physics}
                onChange={onChange}
              />
            </label>
            <label>
              Chemistry
              <input
                type="checkbox"
                name="chemistry"
                className={styles.input_bar}
                checked={states.chemistry}
                onChange={onChange}
              />
            </label>
            <label>
              Computer Science
              <input
                type="checkbox"
                name="computer_science"
                className={styles.input_bar}
                checked={states.computer_science}
                onChange={onChange}
              />
            </label>
            <label>
              Other Sciences
              <input
                type="checkbox"
                name="other_sciences"
                className={styles.input_bar}
                checked={states.other_sciences}
                onChange={onChange}
              />
            </label>
            <label>
              Spanish
              <input
                type="checkbox"
                name="spanish"
                className={styles.input_bar}
                checked={states.spanish}
                onChange={onChange}
              />
            </label>
            <label>
              French
              <input
                type="checkbox"
                name="french"
                className={styles.input_bar}
                checked={states.french}
                onChange={onChange}
              />
            </label>
            <label>
              Mandarin Chinese
              <input
                type="checkbox"
                name="mandarin_chinese"
                className={styles.input_bar}
                checked={states.mandarin_chinese}
                onChange={onChange}
              />
            </label>
            <label>
              Other Languages
              <input
                type="checkbox"
                name="other_languages"
                className={styles.input_bar}
                checked={states.other_languages}
                onChange={onChange}
              />
            </label>
          </div>
        </form>
      </main>
    </div>
  )
}
