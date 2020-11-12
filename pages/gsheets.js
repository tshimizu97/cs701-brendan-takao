const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('./keys.json');

main();

async function main() {
    let numProfiles = await getNumProfiles().then(function(result) { return result; });
    console.log(numProfiles);
    let profiles = await getData(numProfiles);
    // console.log(profiles);
    logProfiles(profiles);
}

async function getNumProfiles() {
    const authClient = await authorize();

    const request = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: 'Profiles!P1:P1',  
        auth: authClient,
    };

    try {
        return (await sheets.spreadsheets.values.get(request)).data.values[0][0];
    } catch (err) {
        console.error(err);
    }
}

async function getData(_numProfiles) {
    const authClient = await authorize();

    let lastRow = _numProfiles + 1;
    let range;
    try {
        range = 'Profiles!A2:N' + lastRow;
    } catch(err) {
        console.log(err);
    }

    const request = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: range,  
        auth: authClient,
    };

    try {
        return (await sheets.spreadsheets.values.get(request)).data.values;
    } catch (err) {
        console.error(err);
    }
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
        console.log('*');
        console.log(profiles[i]);
    }
}

function filter(profiles, numProfiles, filters) {
    for(i = 0; i < numProfiles; i++) {
        // TEST
    }
}
