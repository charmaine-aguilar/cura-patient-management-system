// Tell the server to require and use Express to help us build our API
const express = require('express')
const app = express()

// Add body-parser so the server can read data from the POST forms
// this is deprecated
const bodyParser = require('body-parser')


// Lets server use the environment variables from .env
const dotenv = require("dotenv")
dotenv.config()

// Add mongodb and use the MongoClients class that allows the connection
//   to your mongoDB
const MongoClient = require('mongodb').MongoClient

// Require and use cors so we can access API via localhost
const cors = require('cors')

// Define the database, connect using the database connection string, name database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'cura-patients'
    collectionName = 'patients'

// Set the PORT number
const PORT = 8000

// =============
// DATABASE
// =============

// Connect to the database using the connection string you generated from mongoDB database you created
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to database');
        // Create new database and name it
        db = client.db(dbName)


        
// =============
// TEMPLATE ENGINE
// =============

// Must be put before any middleware and handlers
// Use EJS as a template engine to dynamically render elements in the HTML
//   to display to the users
app.set('view engine', 'ejs')

// NOTE: Create a views folder then make an index.ejs file inside.
//   This will replace the main index.html we first respond with


// =============
// MIDDLEWARES
// =============
app.use(express.urlencoded({ extended: true }))

// Lets our server accept JSON data
app.use(express.json())

// Lets Express handle the regular static files (css, js, images) for us
//   as long as they are in the public folder
app.use(express.static('public'))

//  Use cors so API can be tested on localhost
app.use(cors())



// =============
// HELPER FUNCTIONS
// =============

// Generate unique number ID for patients
let generateID = _ => {
    let minimum = 10000
    let maximum = 50000
    return (Math.floor(Math.random() * (maximum - minimum + 1)) + minimum).toString();
}

// =============
// HANDLERS
// =============

// GET: Main/Root route
app.get('/', async (request, response) => {
    try {
        const patientDocuments = await db.collection(collectionName).find().toArray()
        response.render('index', { patients: patientDocuments })
    } catch(error){
        console.log(error)
    }
})

// GET: Get a specific patient's document and render the 'patientInfo.ejs' page containing the specific information
app.get('/patient/patient_:patientID', async (request, response) => {
    // Working code
    try {
        let pID = request.params.patientID
        const patient = await db.collection(collectionName).findOne({patientID: pID})
        console.log(pID)
        response.render('patientInfo', { patient: patient })
        // response.redirect('/patient')
    } catch (error) {
        console.log(error)
    }
})

// PLEASE IGNORE FOR NOW
// app.post('/getPatient', async (request, response) => {
//     try {
//         // Find one document in the database
//         const patientInfo = await db.collection(collectionName).findOne({
//             patientID: request.body.patientID,
//             firstName: request.body.patientFirstName,
//             lastName: request.body.patientLastName,
//             dateOfbirth: request.body.patientDOB
//         })
//         console.log(patientInfo)
//             // Send HTML response as the whole HTML
//             response.redirect('/patient')
//     } catch(error){
//         console.log(error)
//     }
// })

// POST: Add a new patient to the table with a generated ID number                
app.post('/addPatients', (request, response) => {
    // Since we used urlencoded() in body-parser, we can now
    //   view the values in the body object
    // console.log(request.body);

    // REQUEST: Ask the server to insert a document to the collection
    //   in the database
    // THEN, redirect to the main page again
    // NOTE: We don't send the browser anything back so we just
    //   redirect it back to the main page
    // console.log(request);
    db.collection(collectionName).insertOne(
        // request.body
        {
            patientID: generateID(),
            firstName: request.body.firstName, 
            lastName: request.body.lastName, 
            dateOfbirth: request.body.dateOfbirth 
        }
    )
    .then(result => {
        // console.log(result);
        response.redirect('/') // redirect to main page // refresh
    })
    .catch(error => console.error(error))
})

app.delete('/deletePatient', async (request, response) => {
    try{
        db.collection(collectionName).deleteOne(
            {patientID: request.body.patientID}
            // QUERY - What are we gonna delete?
            // {
                // firstName: request.body.patientFirstName,
                // lastName: request.body.patientLastName,
                // dateOfbirth: request.body.patientDOB
            // }
        )
        response.json('SUCCESS: Delete success!')
    } catch(error){
        console.log(error)
    }
})

// LISTEN: on PORT route
app.listen(process.env.PORT || PORT, () => {
    console.log(`SERVER STATUS: RUNNING on PORT ${PORT}`)
})
    })


