import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cn from 'classnames'
import Link from 'next/link'
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../keys.json');

export default function LogInResults(props) {
  const router = useRouter();

  useEffect(()=>{
    // check if the user has logged in
    props.setUserInfo({...props.userInfo,
      user: props.user_input.userName,
      loggedIn: props.if_success});
  }, [])

  if (props.if_success) {
    // store the result to the local storage
    return (<>Log-in Sucess! Go back to the search page!</>)
  }
  else {
    // display the error message
    //setIfError(true);
    return (<>Log-in failure. Go back to the log-in page.</>)
  }
}

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

export async function getServerSideProps(context) {
  const user_input = context.query;
  const info = [user_input.userName, user_input.password];

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

  // Validates a provided username and password combination, returning profile row in sheets if valid, -1 otherwise
  // INPUT: "info" is an array [username, password]
  async function validateUser(info) {
      let authClient = await authorize();
      let userPassArray = await getUserPass(authClient);
      for(let i = 0; i < userPassArray.length; i++) {
          if(info[0] == userPassArray[i][0] && info[1] == userPassArray[i][1])
              return (i+2);
      }
      return -1;
  }

  // Returns a 2D array containing all username/password combinations present in the database
  async function getUserPass(client) {

      // Fetch the number of profiles present in the database and compute the last filled row number
      let numProfiles = await getNumProfiles(client).then(function(result) { return result; });
      let lastRow = parseFloat(numProfiles) + 1;

      // Define the range of the sheet to be fetched
      let range;
      try {
          range = 'Profiles!A2:B' + lastRow;
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

  let if_success = true;
  // main code
  const val_ret = await validateUser(info);
  if (val_ret == -1) {
    if_success = false;
  }

  return { props: { if_success,  user_input }};
}
