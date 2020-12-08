const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../../keys.json');

main();

async function search(state) {

    // Parse the "state" object into an array for searching
    let searchState = [];
    searchState.push('');
    searchState.push('');
    searchState.push(state.type);
    searchState.push(state.firstname);
    searchState.push(state.lastname);
    searchState.push('');
    searchState.push(boolAsInt(state.writing));    
    searchState.push(boolAsInt(state.math));
    searchState.push(boolAsInt(state.physics));
    searchState.push(boolAsInt(state.chemistry));
    searchState.push(boolAsInt(state.computer_science));
    searchState.push(boolAsInt(state.other_sciences));
    searchState.push(boolAsInt(state.spanish));
    searchState.push(boolAsInt(state.french));
    searchState.push(boolAsInt(state.mandarin_chinese));
    searchState.push(boolAsInt(state.other_languages));

    // Authorize API access and fetch all profiles
    let authClient = await authorize();
    let profiles = await getData(authClient);

    // Filter out profiles that are not of the proper type (tutor/tutee)
    for(i = 0; i < profiles.length; i++) {
        if(profiles[i][2] != searchState[2]) {
            profiles.splice(i, 1);
            i--;
        }
    }

    let results = [];

    // Select profiles that have matching subjects 
    for(i = 5; i < 15; i++) {
        for(j = 0; j < profiles.length; j++) {
            if(searchState[i] == '1' && profiles[j][i] == '1') 
                results.push(profiles[j]);
        }
    }

    // Return the final set of matching profiles as a 2D array
    return results;
    
}

// If "bool" is true, return '1'. If not, return '0';
function boolAsInt(bool) {
    if(bool)
        return '1';
    return '0';
}

async function main() {
    // let testProfile = [['tutee', 'Maria', 'Santiago', '14', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', 'abcdefgh']];
    // await addProfile(testProfile);
    // deleteProfile('abcdefgh');
    let testState = {type: "tutee", writing: false, math: true,
                  physics: false, chemistry: false, computer_science: false,
                  other_sciences: false, spanish: false, french: false,
                  mandarin_chinese: false, other_languages: false};
    let results = await search(testState);
    logProfiles(results);

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

// Adds a profile to the database
async function addProfile(profile) {

    // Create an authorization client for API access
    const authClient = await authorize();

    // Fetch the number of profiles present in the database and compute the last filled row number
    let numProfiles = await getNumProfiles(authClient);
    let lastRow = parseFloat(numProfiles) + 1;

    // Define the range of the sheet to be appended to
    let range;
    try {
        range = 'Profiles!A' + lastRow + ':P' + lastRow;
    } catch(err) {
        console.error(err);
    }

    // Google Sheets API request to append to the desired cells with the new profile
    const appendRequest = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: range,
        valueInputOption: 'RAW',
        auth: authClient,
        resource: {
            values: profile
        }
    };
    
    // Catch any errors resulting from this append request
    try {
        const appendResponse = (await sheets.spreadsheets.values.append(appendRequest)).data;
        // console.log(JSON.stringify(appendResponse, null, 2));
    } catch(err) {
        console.error(err);
    }

    // Google Sheets API request to update the number of profiles present in the database
    const updateRequest = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: 'Profiles!Q1:Q1',
        valueInputOption: 'RAW',
        auth: authClient,
        resource: {
            values: [[parseFloat(numProfiles) + 1]]
        }
    };

    // Catch any errors resulting from this update request
    try {
        const updateResponse = (await sheets.spreadsheets.values.update(updateRequest)).data;
        // console.log(JSON.stringify(updateResponse, null, 2));
    } catch(err) {
        console.error(err);
    }
}

// Deleted a profile according to the username provided
async function deleteProfile(username) {
    const authClient = await authorize();
    let profiles = await getData(authClient);
    let row = 0;
    let index = 0;
    for(i = 0; i < profiles.length; i++) {
        if(profiles[i][0] == username) {
            row = i+2;
            index = i;
        }
    }

    profiles.splice(index, 1);
    profiles.push(['','','','','','','','','','','','','','','']);

    if(row != 0) {
        let numProfiles = await getNumProfiles(authClient);
        let lastRow = parseFloat(numProfiles) + 1;
        let range;
        try {
            range = 'Profiles!A2:P' + lastRow;
        } catch(err) {
            console.error(err);
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
        }
    }

    profiles = await getData(authClient);
    console.log('After deletion');
    logProfiles(profiles);

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

function logProfiles(profiles) {
    for(i = 0; i < profiles.length; i++) {
        console.log(profiles[i].toString());
    }
}
