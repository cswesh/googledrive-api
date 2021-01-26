const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const path = require('path');
const fs = require('fs');
const { file } = require('googleapis/build/src/apis/file');
const dotenv = require('dotenv')
dotenv.config({path:'.env'})

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const drive = google.drive({
    version:'v3',
    auth:oAuth2Client
})

const filePath = path.join(__dirname,'about.jpeg')

async function uploadFile(){
    try {
        const res = await drive.files.create({
            requestBody:{
                name:'melatest.jpeg',
                mimeType:'image/jpeg'
            },
            media:{
                mimeType:'image/jpeg',
                body: fs.createReadStream(filePath)
            }
        })
        console.log(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

//uploadFile();

async function deleteFile(){
    try {
        const res = await drive.files.delete({
            fileId:'1dZB6yMi7dNzgfAJ4T3BaVIySFgFEyiD5'
        });
        console.log(res.data,res.status)
    } catch (error) {
        console.log(error.message);
    }
}
//deleteFile();

async function generatePublicURL(){
    try {
        console.log(process.env.CLIENT_ID)
        const fileId = '17fKD4oJRstZTg99NppX_VsUpoC4-Kl58';
        await drive.permissions.create({
            fileId:fileId,
            requestBody:{
                role:'reader',
                type:'anyone'
            }
        })
        const res = await drive.files.get({
            fileId:fileId,
            fields:'webViewLink, webContentLink',
        });
        console.log(res.data); 
    } catch (error) {
     console.log(error.message);   
    }
}
generatePublicURL();

/* NOTES:
Get client id and secret from https://console.cloud.google.com/apis/credentials/oauthclient
redirect uri = https://developers.google.com/oauthplayground
refresh token by providing id and secret in oauthplayground for Drive API, provide access to user account and generate the token in exchange
*/