const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Credentials ফাইল পাথ
const credentialsPath = path.join(__dirname, 'credentials.json');

// Load credentials
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// OAuth2 client তৈরি
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets-এ ডেটা লেখার ফাংশন
async function writeToSpreadsheet(spreadsheetId, range, values) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    console.log('Data written successfully:', response.data);
  } catch (error) {
    console.error('Error writing to spreadsheet:', error);
    throw error;
  }
}

// Function call উদাহরণ
const SPREADSHEET_ID = '1S3aFYqxuIobNE32xVPgZkOQqEfFeKoRXqpI76ZbwDO4'; // আপনার Google Sheet ID দিন
const RANGE = 'Sheet1!A1:D10'; // যেখানে ডেটা রাখতে চান
const VALUES = [
  ['Patient ID', 'Name', 'Age', 'Gender'],
  ['12345', 'John Doe', '30', 'Male'],
];

writeToSpreadsheet(SPREADSHEET_ID, RANGE, VALUES);
