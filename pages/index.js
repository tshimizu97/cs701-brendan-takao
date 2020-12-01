import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cn from 'classnames'

export default function Home(props) {
  const initStates = {tutor: false, tutee: false, writing: false, math: false,
                  physics: false, chemistry: false, computer_science: false,
                  other_sciences: false, spanish: false, french: false,
                  mandarin_chinese: false, other_languages: false};
  const [state, setState] = useState(initStates);

  useEffect(()=>{
    // check if the user has logged in
    props.setUserInfo({...props.userInfo,
      loggedIn: localStorage.getItem("loggedIn")});
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>[Project Name]</title> {/* Need to decide the project name*/}
        <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          [Project Name] {/* Need to decide the project name*/}
        </h1>

        <p className={styles.description}>
          Get started by searching for registered tutors / tutees!
        </p>

        <div className={styles.search_box}>
          <div className={styles.search_element}>
            <h3>I'm looking for:</h3>
            <p>
              <button type='button'
               onClick={() => setState({...state, tutor: (state['tutor'] === false)})}
               className={cn({[styles.search_option]: state['tutor'] === false,
                              [styles.option_selected]: state['tutor'] === true})}>Tutor</button>
              <button type='button'
               onClick={() => setState({...state, tutee: (state['tutee'] === false)})}
               className={cn({[styles.search_option]: state['tutee'] === false,
                              [styles.option_selected]: state['tutee'] === true})}>Tutee</button>
            </p>
          </div>
          <div className={styles.search_element}>
            <h3>Subjects</h3>
            <p>
              <button type='button'
               onClick={() => setState({...state, writing: (state['writing'] === false)})}
               className={cn({[styles.search_option]: state['writing'] === false,
                              [styles.option_selected]: state['writing'] === true})}>Writing</button>
              <button type='button'
               onClick={() => setState({...state, math: (state['math'] === false)})}
               className={cn({[styles.search_option]: state['math'] === false,
                              [styles.option_selected]: state['math'] === true})}>Math</button>
              <button type='button'
               onClick={() => setState({...state, physics: (state['physics'] === false)})}
               className={cn({[styles.search_option]: state['physics'] === false,
                              [styles.option_selected]: state['physics'] === true})}>Physics</button>
              <button type='button'
               onClick={() => setState({...state, chemistry: (state['chemistry'] === false)})}
               className={cn({[styles.search_option]: state['chemistry'] === false,
                              [styles.option_selected]: state['chemistry'] === true})}>Chemistry</button>
              <button type='button'
               onClick={() => setState({...state, computer_science: (state['computer_science'] === false)})}
               className={cn({[styles.search_option]: state['computer_science'] === false,
                              [styles.option_selected]: state['computer_science'] === true})}>Computer Science</button>
              <button type='button'
               onClick={() => setState({...state, other_sciences: (state['other_sciences'] === false)})}
               className={cn({[styles.search_option]: state['other_sciences'] === false,
                              [styles.option_selected]: state['other_sciences'] === true})}>Other Sciences</button>
              <button type='button'
               onClick={() => setState({...state, spanish: (state['spanish'] === false)})}
               className={cn({[styles.search_option]: state['spanish'] === false,
                              [styles.option_selected]: state['spanish'] === true})}>Spanish</button>
              <button type='button'
               onClick={() => setState({...state, french: (state['french'] === false)})}
               className={cn({[styles.search_option]: state['french'] === false,
                              [styles.option_selected]: state['french'] === true})}>French</button>
              <button type='button'
               onClick={() => setState({...state, mandarin_chinese: (state['mandarin_chinese'] === false)})}
               className={cn({[styles.search_option]: state['mandarin_chinese'] === false,
                              [styles.option_selected]: state['mandarin_chinese'] === true})}>Mandarin Chinese</button>
              <button type='button'
               onClick={() => setState({...state, other_languages: (state['other_languages'] === false)})}
               className={cn({[styles.search_option]: state['other_languages'] === false,
                              [styles.option_selected]: state['other_languages'] === true})}>Other Languages</button>
            </p>
          </div>
          <button type='button' type='submit' className={styles.search_button}>Search</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/brendanphilbin/cs701-brendan-takao"
          target="_blank"
        >
          CS701 Project at Middlebury College by Brendan and Takao
        </a>
      </footer>
    </div>
  )
}
