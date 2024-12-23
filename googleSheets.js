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

// Google Sheets API ইন্সট্যান্স তৈরি
async function accessSpreadsheet(spreadsheetId, range) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId, // আপনার Google Sheet ID দিন
      range, // শীটের রেঞ্জ যেমন "Sheet1!A1:D10"
    });
    console.log('Data from Google Sheets:', response.data.values);
    return response.data.values;
  } catch (error) {
    console.error('Error accessing spreadsheet:', error);
    throw error;
  }
}

// Function call উদাহরণ
const SPREADSHEET_ID = '1S3aFYqxuIobNE32xVPgZkOQqEfFeKoRXqpI76ZbwDO4'; // আপনার Google Sheet ID
const RANGE = 'Sheet1!A1:D10'; // আপনার রেঞ্জ

accessSpreadsheet(SPREADSHEET_ID, RANGE);
