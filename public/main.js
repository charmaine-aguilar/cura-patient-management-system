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

    // Grab the info from the table in the DOM
    // const pID = this.parentNode.parentNode.querySelector('.patientID').textContent
    // const fName = this.parentNode.parentNode.querySelector('.patientFirstName').textContent
    // const lName = this.parentNode.parentNode.querySelector('.patientLastName').textContent
    // const birthDate = this.parentNode.parentNode.querySelector('.patientDOB').innerText

    // Trigger a GET request to render patientInfo.ejs
    fetch('/patient', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
    .then( response => {
        // Refresh the page
        // console.log(response);
        window.location.reload()
    })
    .then( response => {
        // Refresh the page
        console.log(response);
    })
}
