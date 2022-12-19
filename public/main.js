// ==========
// DOCUMENT VARIABLES
// ==========

// Grab all the trash icon button
const deleteButtons = document.querySelectorAll('.fa-trash-can')

// Grab all the update/edit icon button
const updateButtons = document.querySelectorAll('.fa-pen-to-square')




// ==========
// DELETE
// ==========

// Add event listener to every patient row info that has deleteButtons
Array.from(deleteButtons).forEach((element) => {
    element.addEventListener('click', deletePatient)
})

async function deletePatient() {

    // Grab the info from the table in the DOM
    const pID = this.parentNode.parentNode.querySelector('.patientID').textContent
    const fName = this.parentNode.parentNode.querySelector('.patientFirstName').textContent
    const lName = this.parentNode.parentNode.querySelector('.patientLastName').textContent
    const birthDate = this.parentNode.parentNode.querySelector('.patientDOB').innerText

    try{
        const response = await fetch('deletePatient', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    patientID: pID,
                    patientFirstName: fName,
                    patientLastName: lName,
                    patientDOB: birthDate
                }
            )
        })
        const data = await response.json()
        console.log(data)
        window.location.reload(true)
    } catch(error){
        console.log('Failed trying');
        console.log(error)
    }
}


// ==========
// POST - go to patient specific page
// ==========
// Why POST? Because we're creating a new resource, a new page. GET only retrieves information.

// Add event listener to every patient row info that has updateButtons
Array.from(updateButtons).forEach((element) => {
    element.addEventListener('click', getOnePatient)
})

function getOnePatient() {

    console.log('Update click')

    // Grab the ID of the selected patient
    const pID = this.parentNode.parentNode.querySelector('.patientID').textContent

    console.log(pID);

    // Grab  input boxes from DOM
    const fNameInputBox = this.parentNode.parentNode.querySelector('.patientFirstName')
    const lNameInputBox = this.parentNode.parentNode.querySelector('.patientLastName')
    const birthDateInputBox = this.parentNode.parentNode.querySelector('.patientDOB')

    // Trigger a GET request to render patientInfo.ejs
    fetch(`/patient/${pID}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        // Refresh the page to the new route
        window.location = `/patient/${pID}`
    })

    
}




// =================
// PATIENTINFO.EJS INTERACTIONS
// =================

// EDIT BUTTON
const enableEditButton = document.querySelector('#editPatient')

// SAVE CHANGES BUTTON
const saveChangesButton = document.querySelector('#saveChanges')

// Grab the input field elements
const patientIDInputField = document.querySelector('#patientID')
const firstNameInputField = document.querySelector('#patientFirstName')
const lastNameInputField = document.querySelector('#patientLastName')
const dobInputField = document.querySelector('#patientDOBName')


function enableEditPatient() {

    // MAIN GOAL:
    // When you click the edit button, the input fields are able to be written on again

    // STEPS:
    // -> Grab the input field elements except patient ID
    const inputFields = document.querySelectorAll('input')

    console.log(inputFields);

    // -> Loop from each node element and remove the 'disabled' attribute
    for (let index = 1; index < inputFields.length; index++) {
        let element = inputFields[index]
        element.removeAttribute('disabled')
        console.log(inputFields[index])
    }

    // -->  Set the placeholder values as the text content!
    // ---> To do this, grab the individual input fields' placeholder values
    const firstNamePlaceholder = firstNameInputField.getAttribute('placeholder')
    const lastNamePlaceholder = lastNameInputField.getAttribute('placeholder')

    // ---> Set the placeholder contents as the text contents of each field for better editing
    firstNameInputField.value = firstNamePlaceholder
    lastNameInputField.value = lastNamePlaceholder
    
    // Hide editing button
    enableEditButton.style.display = 'none'

    // Show the 'Save changes' button
    saveChangesButton.style.display = 'block'
}



// Add an event listener to the 'Edit' button
enableEditButton.addEventListener('click', enableEditPatient)


// ==========
// PUT
// ==========

// UPDATE: Request to update the field with new values
saveChangesButton.addEventListener('click', updatePatient)

async function updatePatient() {

    console.log('patientID:' + patientIDInputField.value)
    console.log('firstname:' + firstNameInputField.value)
    console.log('lastname:' + lastNameInputField.value)
    console.log('dob:' + dobInputField.value)
    
    // Entered/Edited value in input field is going to be set as the new value
    dobInputField.value = dobInputField.value

    // console.log(firstNameInputField.value + '' + lastNameInputField.value + '' + dobInputField.value);

    // Send a PUT request to the server to update the database and use the new fields
    try{
        const response = await fetch('editPatient', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    patientID: patientIDInputField.placeholder,
                    patientFirstName: firstNameInputField.value,
                    patientLastName: lastNameInputField.value,
                    patientDOB: dobInputField.value
                }
            )
        })
        const data = await response.json()
        // console.log(data)
        // When response is good/update is successful, reload to this route
        window.location = `/patient/${patientIDInputField.placeholder}`
        // window.location.reload(true)
    } catch(error){
        console.log(error)
    }
}


// =======
// Navigation
// =======

// go back to patient list when 'Home' is pressed


// document.querySelector('#backToPatientList').addEventListener('click', goBackToPatientList)

// async function goBackToPatientList() {
    
//     // .then(response => {
//     //     // Refresh the page to the new route
//     //     window.location = '/'
//     // })

//     try{
//         const response = await fetch('/', {
//             method: 'get',
//             headers: { 'Content-Type': 'application/json' }
//         })
//         const data = await response.json()
//         window.location = `/`
//     } catch(error){
//         console.log(error)
//     }
// }
