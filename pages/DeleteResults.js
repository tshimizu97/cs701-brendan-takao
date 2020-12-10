import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../keys.json');

export default function DeleteResults({ results }) {

    const success = JSON.parse(results);

    const displayHeader = (header) => {
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const DisplayProfileEditResults = (success) => {
        if(success.success) {
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
                            Profile deletion successful. 
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
                      Profile deletion was unsuccessful, please try again. 
                    </p>
                   </main>
               </div>
            )
        }
    }

    return (
        <DisplayProfileEditResults success={success} />
    )
}

export async function getServerSideProps(context) {

    const state = context.query;
    
    let authClient = await authorize();
    let profiles = await getData(authClient);

    let username = 'bphilbin@middlebury.edu';

    // Delete the profile 
    let results = await deleteProfile(authClient, profiles, username);

    // Return true or false to the page as props
    results = JSON.stringify(results);
    return { props: { results }}

    function getRowByUsername(profiles, username) {
        for(let i = 0; i < profiles.length; i++) {
            if(profiles[i][0] == username)
                return (i+2);
        }
        return 0;
    }

    // Deleted a profile according to the username provided
    async function deleteProfile(client, profiles, username) {

        let success = true;

        // let profiles = await getData(client);
        let row = getRowByUsername(profiles, username);
        let index = row - 2;
        /*
        for(i = 0; i < profiles.length; i++) {
            if(profiles[i][0] == username) {
                row = i+2;
                index = i;
            }
        }
        */

        profiles.splice(index, 1);
        profiles.push(['','','','','','','','','','','','','','','','']);

        if(row != 0) {
            let numProfiles = await getNumProfiles(authClient);
            let lastRow = parseFloat(numProfiles) + 1;
            let range;
            try {
                range = 'Profiles!A2:P' + lastRow;
            } catch(err) {
                console.error(err);
                success = false;
            }
            const deleteRequest = {
                spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
                range: range,
                valueInputOption: 'RAW',
                auth: authClient,
                resource: {
                    values: profiles
                }
            };

            try {
                const updateResponse = (await sheets.spreadsheets.values.update(deleteRequest)).data;
                // console.log(JSON.stringify(updateResponse, null, 2));
            } catch(err) {
                console.error(err);
                sucess = false;
            }

            const numProfRequest = {
                spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
                range: 'Profiles!Q1:Q1',
                valueInputOption: 'RAW',
                auth: authClient,
                resource: {
                    values: [[parseFloat(numProfiles) - 1]]
                }
            };

            try {
                const updateResponse = (await sheets.spreadsheets.values.update(numProfRequest)).data;
                // console.log(JSON.stringify(updateResponse, null, 2));
            } catch(err) {
                console.error(err);
                success = false;
            }
        } else {
            success = false;
        }
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
        return 'fail';
    }
}
