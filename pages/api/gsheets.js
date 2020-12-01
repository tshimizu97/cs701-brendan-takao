const {google} = require('googleapis');
const sheets = google.sheets('v4');
const keys = require('../../keys.json');

main();

async function main() {
    let testProfile = [['tutee', 'Maria', 'Santiago', '14', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', 'abcdefgh']];
    await addProfile(testProfile);
    deleteProfile('abcdefgh');
}

async function getNumProfiles(client) {
    const request = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: 'Profiles!P1:P1',
        auth: client,
    };

    try {
        return (await sheets.spreadsheets.values.get(request)).data.values[0][0];
    } catch (err) {
        console.error(err);
    }
}

export async function getData(client) {
    // const authClient = await authorize();

    let numProfiles = await getNumProfiles(client).then(function(result) { return result; });
    let lastRow = parseFloat(numProfiles) + 1;

    let range;
    try {
        range = 'Profiles!A2:O' + lastRow;
    } catch(err) {
        console.error(err);
    }

    const request = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: range,
        auth: client,
    };

    try {
        return (await sheets.spreadsheets.values.get(request)).data.values;
    } catch (err) {
        console.error(err);
    }
}

async function addProfile(profile) {
    const authClient = await authorize();

    let numProfiles = await getNumProfiles(authClient);

    let lastRow = parseFloat(numProfiles) + 1;
    let range;
    try {
        range = 'Profiles!A' + lastRow + ':O' + lastRow;
    } catch(err) {
        console.error(err);
    }

    const appendRequest = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: range,
        valueInputOption: 'RAW',
        auth: authClient,
        resource: {
            values: profile
        }
    };

    try {
        const appendResponse = (await sheets.spreadsheets.values.append(appendRequest)).data;
        // console.log(JSON.stringify(appendResponse, null, 2));
    } catch(err) {
        console.error(err);
    }

    const updateRequest = {
        spreadsheetId: '1MiEC9k_ZmwmBcEamwls7ES5ESL_0fGI7mcgnSU8sDs4',
        range: 'Profiles!P1:P1',
        valueInputOption: 'RAW',
        auth: authClient,
        resource: {
            values: [[parseFloat(numProfiles) + 1]]
        }
    };

    try {
        const updateResponse = (await sheets.spreadsheets.values.update(updateRequest)).data;
        // console.log(JSON.stringify(updateResponse, null, 2));
    } catch(err) {
        console.error(err);
    }
}

async function deleteProfile(id) {
    const authClient = await authorize();
    let profiles = await getData(authClient);
    console.log('Before deletion');
    logProfiles(profiles);
    let row = 0;
    let index = 0;
    for(i = 0; i < profiles.length; i++) {
        if(profiles[i][14] == id) {
            row = i+2;
            index = i;
        }
    }
    console.log('row = ' + row);

    profiles.splice(index, 1);
    profiles.push(['','','','','','','','','','','','','','','']);

    if(row != 0) {
        let numProfiles = await getNumProfiles(authClient);
        let lastRow = parseFloat(numProfiles) + 1;
        let range;
        try {
            range = 'Profiles!A2:O' + lastRow;
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
            range: 'Profiles!P1:P1',
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

export async function authorize() {
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

function getRandomId() {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let length = characters.length;
    for(i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * length));
    }
    return result;
}
