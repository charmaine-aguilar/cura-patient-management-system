// ==========
// UPDATE
// ==========
// const updateButton = document.querySelector('#updateButton')

// updateButton.addEventListener('click', () => {
//     Trigger a PUT request via Fetch API
//     PUT: Update the first and last name when update button is clicked
//     fetch('/updatePatient', {
//         method: 'put',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             // This is what we will replace the chosen document with
//             firstName: 'Cabbage',
//             lastName: 'Lemon'
//         })
//     })
//     .then(res => {
//         if (res.ok) return res.json()
//     })
//     .then( response => {
//         // Refresh the page
//         window.location.reload(true)
//     })
// })



// ==========
// DELETE
// ==========

const messageDiv = document.querySelector('#message')

// Grab the trash icon button
const deleteButtons = document.querySelectorAll('.fa-trash-can')
console.log(deleteButtons);

// Add event listener to every patient row info that has deleteButtons
Array.from(deleteButtons).forEach((element) => {
    element.addEventListener('click', deletePatient)
})

    

    // Trigger a DELETE request via FETCH API
    // fetch('/deletePatient', {
    //     method: 'delete',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         // Delete the one with the firstName of Cabbage
    //         firstName: fName,
    //         lastName: lName,
    //         dateOfbirth: birthDate
    //     })
    // })
    // .then(res => {
    //     if (res.ok) return res.json()
    // })
    // .then(response => {
    //     // If there are no more patients to delete,
    //     //   change the text content of div
    //     //   else if patient still exists, reload page
    //     if (response === 'Patient does not exist.') {
    //         messageDiv.innerHTML = 'No such patient exists.'
    //     } else {
    //         window.location.reload(true)
    //     }
    // })
    // .catch(console.error)

async function deletePatient() {

    // Grab the info from the table in the DOM
    const fName = this.parentNode.parentNode.querySelector('.patientFirstName').textContent
    const lName = this.parentNode.parentNode.querySelector('.patientLastName').textContent
    const birthDate = this.parentNode.parentNode.querySelector('.patientDOB').innerText
    console.log(`${fName} ${lName} ${birthDate}`);

    console.log('Trying');
    try{
        const response = await fetch('deletePatient', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientFirstName: fName,
                patientLastName: lName,
                patientDOB: birthDate
            })
        })
        const data = await response.json()
        console.log(data)
        window.location.reload(true)
    } catch(error){
        console.log('Failed trying');
        console.log(error)
    }
}

