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
    .then( response => {
        // Refresh the page to the new route
        window.location = `/patient/${pID}`
    })

    
}




// =================
// PATIENTINFO.EJS INTERACTIONS
// =================

const enableEditButton = document.querySelector('#editPatient')

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
    // ---> Let's grab the input field elements first
    const firstNameInputField = document.querySelector('#patientFirstName')
    const lastNameInputField = document.querySelector('#patientLastName')
    const dobInputField = document.querySelector('#patientDOBName')

    // ---> To do this, grab the individual input fields' placeholder values
    const firstNamePlaceholder = firstNameInputField.getAttribute('placeholder')
    const lastNamePlaceholder = lastNameInputField.getAttribute('placeholder')
    const dobPlaceholder = dobInputField.getAttribute('placeholder')

    // ---> Set the placeholder contents as the text contents of each field for better editing
    firstNameInputField.value = firstNamePlaceholder
    lastNameInputField.value = lastNamePlaceholder
    // dobPlaceholder.valueAsDate = dobPlaceholder


    // Hide editing button
    enableEditButton.style.display = 'none'
}

enableEditButton.addEventListener('click', enableEditPatient)
