const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const fetch = require("node-fetch");

const serviceAccount = require("./service-account.json"); // JSON file

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

async function savePatientData(patientData) {
  await jwtClient.authorize();
  const token = jwtClient.credentials.access_token;

  const response = await fetch("https://api.appsheet.com/api/v2/apps/<APP_ID>/tables/<TABLE_NAME>/Action", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  return response.json();
}

// Example call
savePatientData({
  PatientID: "12345",
  Name: "John Doe",
  Age: 30,
}).then(console.log);
