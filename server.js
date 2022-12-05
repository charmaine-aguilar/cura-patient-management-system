// Tell the server to require and use Express to help us build our API
const express = require('express')
const app = express()

// Add body-parser so the server can read data from the POST forms
// this is deprecated
// const bodyParser = require('body-parser')

// Add mongodb and use the MongoClients class that allows the connection
//   to your mongoDB
const MongoClient = require('mongodb').MongoClient

// Lets server use the environment variables from .env
const dotenv = require("dotenv")
dotenv.config()

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
    })

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
        // HANDLERS
        // =============

        // GET: Main/Root route
        app.get('/', async (request, response) => {
            // When something is requested on the main route,
            //   we send them the index.html file back as response
            // This will be replaced by index.ejs down the line
            // response.sendFile(__dirname + '/index.html')

            // This LOC enables us to pull an array of objects from the 
            //   collection
            // In this case, we are getting all documents in the 'patients' 
            //   collection and putting them in an array
            // find() finds every object/document in the database
            // toArray() puts the documents into an Array
            // sort() sorts the array into an ascending order when sending the array to the html
            const patientDocuments = await db.collection(collectionName).find().toArray()
            response.render('index.ejs', { patients: patientDocuments })
                // results hold the array of objects retrieved from the collection in the database
                // .then(results => {
                //     // Render the index.ejs file
                //     // Put the results (array of objects retrieved) into an object called patients
                //     response.render('index.ejs', { patients: results })
                //     // console.log(results);
                // })
                // .catch(error => console.error(error))
        })

        // POST: from add patient form
        app.post('/addPatients', (request, response) => {
            // Since we used urlencoded() in body-parser, we can now
            //   view the values in the body object
            // console.log(request.body);

            // REQUEST: Ask the server to insert a document to the collection
            //   in the database
            // THEN, redirect to the main page again
            // NOTE: We don't send the browser anything back so we just
            //   redirect it back to the main page
            db.collection(collectionName).insertOne(request.body)
                .then(result => {
                    // console.log(result);
                    response.redirect('/') // redirect to main page // refresh
                })
                .catch(error => console.error(error))
        })

        // PUT: Update first and last name
        app.put('/updatePatient', (request, response) => {
            // console.log(request.body)
            db.collection(collectionName).findOneAndUpdate(
                // QUERY - Which do we want to change?
                // A firstName with 'Gem'
                {firstName: 'Gem'},
                // UPDATE - Set/Change new properties to what?
                {
                    $set: {
                        firstName: request.body.firstName,
                        lastName: request.body.lastName
                    }
                },
                // OPTIONS - If no firstName 'Gem' exists in the DB, create one
                {
                    upsert: true
                }
            )
            .then(result => {
                // console.log(result)
                response.json('Success')
            })
            .catch(error => console.error(error))
        })

        // DELETE: Delete a document(object) from the collection(list of objects)
        // app.delete('/deletePatient', (request, response) => {
        //     patientsCollection.deleteOne(
        //         // QUERY - What are we gonna delete?
        //         { 
        //             firstName: request.body.patientFirstName,
        //             lastName: request.body.patientLastName,
        //             dateOfbirth: request.body.patientDOB
        //         }
        //     )
        //     .then(result => {
        //         // Respond to the request when successful
        //         response.json(`SUCCESS: Deleted successfully`)
        //     })
        //     .catch(error => console.error(error))
        // })

        app.delete('/deletePatient', async (request, response) => {
            try{
                db.collection(collectionName).deleteOne(
                    // QUERY - What are we gonna delete?
                    { 
                        firstName: request.body.patientFirstName,
                        lastName: request.body.patientLastName,
                        dateOfbirth: request.body.patientDOB
                    }
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
