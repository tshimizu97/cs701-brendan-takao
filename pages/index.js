import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cn from 'classnames'
import Link from 'next/link'
//import { search } from './api/gsheets'

export default function Home(props) {
  const initStates = {type: "tutor", writing: false, math: false,
                  physics: false, chemistry: false, computer_science: false,
                  other_sciences: false, spanish: false, french: false,
                  mandarin_chinese: false, other_languages: false};
  const [state, setState] = useState(initStates);
  const [ifSearched, setIfSearched] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const router = useRouter();

  //useEffect(()=>{
    // check if the user has logged in
  //  props.setUserInfo({...props.userInfo,
  //    user: localStorage.getItem("user"),
  //    loggedIn: localStorage.getItem("loggedIn")});
  //}, [])

  const onSubmit = async event => {
    // here, instead of always setting arbtrary search_results, call a backend API to get search results given "state" (2D array return value)
    // A VERY IMPORTANT THING -- please include the column name of the dataset; otherwise, front-end can't understand what values are!
    localStorage.setItem('states', state);

    router.push({
      pathname: '/SearchResults',
      query: state
    });

    // code below is not going to be run
    //const search_results = [
    //  ["type", "firstname", "lastname", "age", "writing", "math",
    //          "physics", "chemistry", "computer_science", "other_sciences",
    //          "spanish", "french", "madarin_chinese", "other_languages", "id"],
    //  ['abcdefgh', 'tutee', 'Maria', 'Santiago', '14', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0']
    //];
    // const search_results = await search(state);

    // display the search results
    //setIfSearched(true);
    //setSearchResults(search_results);
  }

  const getData = () => {
    const header = searchResults[0];
    const data = searchResults.slice(1);

    return data.map((row) => {
      const name = row.slice(2, 4).join(" ");
      const age = row[4];
      const subjects = header.filter((key, index) => row[index] == "1").join(" ");
      return [name, age, subjects];
    })
  }

  const displayHeader = (header) => {
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  const displayData = (data) => {
    console.log(data);
    return data.map((key, index) => {
      const [name, age, subjects] = key;
      return (
        <tr key={index}>
          <td>{name}</td>
          <td>{age}</td>
          <td>{subjects}</td>
        </tr>
      )
    })
  }

  const DisplaySearchResults = () => {
    return (
      <div>
        <table>
          <tbody>
            <tr>{displayHeader(["name", "age", "subjects"])}</tr>
            {displayData(getData())}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TutorMatch</title>
        <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          TutorMatch {/* Need to decide the project name*/}
        </h1>

        <p className={styles.description}>
          Get started by searching for registered tutors / tutees!
        </p>

        <div className={styles.search_box}>
          <div className={styles.search_element}>
            <h3>I'm looking for:</h3>
            <p>
              <button type='button'
               onClick={() => setState({...state, type: "tutor"})}
               className={cn({[styles.search_option]: state['type'] === "tutee",
                              [styles.option_selected]: state['type'] === "tutor"})}>Tutor</button>
              <button type='button'
               onClick={() => setState({...state, type: "tutee"})}
               className={cn({[styles.search_option]: state['type'] === "tutor",
                              [styles.option_selected]: state['type'] === "tutee"})}>Tutee</button>
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
          <button
            type='button'
            type='submit'
            className={styles.search_button}
            onClick={onSubmit}
          >
            Search
          </button>
        </div>
        {ifSearched &&
          (//<span className={styles.error_message}>
          //  Here is the search result.
          // </span>
           <DisplaySearchResults />
          )
        }
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
