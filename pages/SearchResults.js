import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../keys.json');

export default function SearchResults({ results }) {
  const searchResults = JSON.parse(results);

  const formatData = () => {
    // if getData returns header as well, change below definition as below
    // const header = searchResults[0];
    // const data = searchResults.slice(1);
    const header = ["username", "password", "type", "firstname", "lastname",
      "age", "writing", "math", "physics", "chemistry", "computer_science",
      "other_sciences", "spanish", "french", "mandarin_chinese",
      "other_languages"]
    const data = searchResults;

    return data.map((row) => {
      const name = row.slice(3, 5).join(" ");
      const age = row[5];
      const subjects = header.filter((key, index) => row[index] == "1").join(", ");
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
            {displayData(formatData())}
          </tbody>
        </table>
      </div>
    )
  }


  return (
     <DisplaySearchResults />
    )
}

export async function getServerSideProps(context) {
  const state = context.query;

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

  // If "bool" is true, return '1'. If not, return '0';
  function asInt(string) {
      if(string == 'true')
          return '1';
      return '0';
  }

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

  // Parse the "state" object into an array for searching
  let searchState = [];
  searchState.push('');
  searchState.push('');
  searchState.push(state.type);
  searchState.push(state.firstname);
  searchState.push(state.lastname);
  searchState.push('');
  searchState.push(asInt(state.writing));
  searchState.push(asInt(state.math));
  searchState.push(asInt(state.physics));
  searchState.push(asInt(state.chemistry));
  searchState.push(asInt(state.computer_science));
  searchState.push(asInt(state.other_sciences));
  searchState.push(asInt(state.spanish));
  searchState.push(asInt(state.french));
  searchState.push(asInt(state.mandarin_chinese));
  searchState.push(asInt(state.other_languages));

  // Authorize API access and fetch all profiles
  let authClient = await authorize();
  let profiles = await getData(authClient);

  // Filter out profiles that are not of the proper type (tutor/tutee)
  for(let i = 0; i < profiles.length; i++) {
      if(profiles[i][2] != searchState[2]) {
          profiles.splice(i, 1);
          i--;
      }
  }

  let results = [];

  // Select profiles that have matching subjects
  for(let i = 5; i < 15; i++) {
      for(let j = 0; j < profiles.length; j++) {
          if(searchState[i] == '1' && profiles[j][i] == '1') {
              results.push(profiles[j]);
              profiles.splice(j, 1);
              j--;
          }
      }
  }

  // change format to send results to the client
  results = JSON.stringify(results)

  // Return the final set of matching profiles
  return { props: { results }}
}
