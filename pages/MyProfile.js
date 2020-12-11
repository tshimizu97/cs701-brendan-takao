import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cn from 'classnames'
import Link from 'next/link'
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../keys.json');

export default function Profile(props) {
  /* This needs to be returned from the getServerSideProps() */
  const initStates = {type: "tutor", writing: false, math: false,
                  physics: false, chemistry: false, computer_science: false,
                  other_sciences: false, spanish: false, french: false,
                  mandarin_chinese: false, other_languages: false};
  const [state, setState] = useState(initStates);
  const [ifSearched, setIfSearched] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const router = useRouter();

  useEffect(()=>{
    // get user's data
    const profile = JSON.parse(props.profile);

    setState(profile);
  }, [])

  const onSubmit = async event => {
    // here, instead of always setting arbtrary search_results, call a backend API to get search results given "state" (2D array return value)
    // A VERY IMPORTANT THING -- please include the column name of the dataset; otherwise, front-end can't understand what values are!
    localStorage.setItem('states', state);

    router.push({
      pathname: '/ProfileResults',
      query: state
    });
  }

  const onDelete = async event => {
        localStorage.setItem('states', state);

        router.push({
            pathname: '/DeleteResults',
            query: state
        });
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
        <link rel="icon" href="/favicon.ico"/> {/* Need to change the icon*/}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          TutorMatch {/* Need to decide the project name*/}
        </h1>

        <p className={styles.description}>
          Edit Your Profile
        </p>

        <div className={styles.search_box}>
          <div className={styles.search_element}>
            <h3>Profile Type</h3>
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
            Update Profile
          </button>
        <button
            type='button'
            type='submit'
            className={styles.search_button}
            onClick={onDelete}
        >
           Delete Profile
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

export async function getServerSideProps(context) {
    const username = context.query.username;

    // Pull the profile we are trying to edit
    // "username" contains the username we are logged into
    let authClient = await authorize();
    let profiles = await getData(authClient);

    let profile;
    for (let i = 0; i < profiles.length; i++) {
        if (profiles[i][0] == username) {
            profile = profiles[i];
            break;
        }
    }

    const subjects = profile.slice(6)
    const state_values = [profile[2], ...subjects]

    const state_header = ["type", "writing", "math", "physics", "chemistry",
      "computer_science", "other_sciences", "spanish", "french",
      "mandarin_chinese", "other_languages"]

    profile = {};
    state_header.map((e, i) => {
      if (state_values[i] == '1') {
        profile[e] = true
      }
      else if (state_values[i] == '0') {
        profile[e] = false
      }
      else {
        profile[e] = state_values[i]
      }
    })

    console.log(profile)

    // Return that profile to the page as props
    profile = JSON.stringify(profile);
    return { props: { profile } };

    /* Auxiliary Functions */

    // Returns the number of profiles present in the database
    async function getNumProfiles(client) {

        // Google Sheets API request for cell containing number of profiles
        const request = {
            spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
            range: 'Profiles!Q1:Q1',
            auth: client,
        };

        // Fetch the desired cell and return its value as a number
        try {
            return (await sheets.spreadsheets.values.get(request)).data.values[0][0];
        } catch (err) {
            console.error(err);
        }
    }

    // Returns a 2D array containing all profiles present in the database
    async function getData(client) {

        // Fetch the number of profiles present in the database and compute the last filled row number
        let numProfiles = await getNumProfiles(client).then(function(result) { return result; });
        let lastRow = parseFloat(numProfiles) + 1;

        // Define the range of the sheet to be fetched
        let range;
        try {
            range = 'Profiles!A2:P' + lastRow;
        } catch(err) {
            console.error(err);
        }

        // Google Sheets API request to fetch cells containing profile information
        const request = {
            spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
            range: range,
            auth: client,
        };

        // Fetch the desired cells and return them as a 2D array
        try {
            return (await sheets.spreadsheets.values.get(request)).data.values;
        } catch (err) {
            console.error(err);
        }
    }

    // Returns an authorization client for Google Sheets API
    async function authorize() {
        let authClient = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        if(authClient == null) {
            throw Error('Authentication failed');
        }
        return authClient;
    }
}
