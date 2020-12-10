import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../keys.json');

export default function ProfileResults({ results }) {
    // const searchResults = JSON.parse(results);
    const success = JSON.parse(results);

    const displayHeader = (header) => {
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
    }

    const DisplayProfileEditResults = (success) => {
    if(success) {
        return (
            <div>
                <Head>
                    <title>TutorMatch</title>
                    <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                         TutorMatch {/* Need to decide the project name*/}
                    </h1>

                    <p className={styles.description}>
                        Profile edit successful. 
                    </p>
               </main>
           </div>
        )
   }
   else {
       return (
           <div>
             <Head>
                <title>TutorMatch</title>
                <link rel="icon" href="/favicon.ico"/> {/* Need to chnge the icon*/}
              </Head>

              <main className={styles.main}>
                <h1 className={styles.title}>
                  TutorMatch {/* Need to decide the project name*/}
                </h1>

                <p className={styles.description}>
                  Profile edit was unsuccessful, please try again. 
                </p>
               </main>
           </div>
        )
    }
    }

    return (
     <DisplayProfileEditResults success />
    )
    }

export async function getServerSideProps(context) {
    const state = context.query;
    // Need to have "state" be the new profile with edits made
    //

    // Parse new profile into correct row format
    // Want variable "profile" to be this array of length 16


    // TEST
    let profile = [['pphilbin@middlebury.edu','abcde','tutor','Patrick','Philbin','19','0','1','1','0','1','0','1','0','1','0']];

    // Push the new profile to the database
    let results = await editProfile(profile);

    // Return true or false to the page as props
    console.log('results:');
    console.log(results);
    results = JSON.stringify(results);
    return { props: { results }}

    // Edits the profile information contained in the database
    // INPUT: "profile" is an array of length 16 containing all data to be written to the database [username ... other_languages]
    // -- Username and password remain unchanged
    async function editProfile(profile) {

        // Boolean to track success
        let success = true;

        // Authorize the Google Sheets API
        let authClient = await authorize();

        // Determine in which row the profile resides
        let profiles = await getData(authClient);
        let row = parseFloat(determineRow(profiles, profile));

        // Slice off the username and password, as they won't be edited
        profile[0] = profile[0].slice(2,16);
        
        // Modify the data within that row
        let range;
        try {
            range = 'Profiles!C' + row + ':P' + row;
        } catch(err) {
            console.error(err);
            success = false;
        }

        const editRequest = {
            spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
            range: range,
            valueInputOption: 'RAW',
            auth: authClient,
            resource: {
                values: profile
            }
        };

        try {
            const updateResponse = (await sheets.spreadsheets.values.update(editRequest)).data;
        } catch(err) {
            console.error(err);
            success = false;
        }

        /*
        let test1 = { success };
        console.log('Test1:');
        console.log(test1);
        let test2 = JSON.stringify(test1);
        console.log('Test2:');
        console.log(test2);
        let test3 = JSON.parse({test2});
        console.log('Test3:');
        console.log(test3);
        */

        return success;
    }

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

    // Determines which Google Sheets row contains the specified profile
    function determineRow(profiles, profile) {
        for(var i = 0; i < profiles.length; i++) {
            if(profiles[i][0] == profile[0][0])
                return (i+2);
        }
        return 'test';
    }

}
