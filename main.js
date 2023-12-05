var form = document.getElementById('addForm');
var itemList = document.getElementById('items');

// Adding a single event listener to handle form submission
form.addEventListener('submit', handleFormSubmission);

// delete event
itemList.addEventListener('click', removeItem);
itemList.addEventListener('click', editItem); // Adding event listener for edit

function removeItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are You Sure? You want to delete this item?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
        }
    }
}

function editItem(e) {
    if (e.target.classList.contains('editbutton')) {
        var li = e.target.parentElement;
        var userData = JSON.parse(localStorage.getItem(email));

        if (userData) {
            // Populating the form fields with existing data
            document.getElementById('item').value = userData.firstName;
            document.getElementById('description').value = userData.lastName;
            document.getElementById('email').value = userData.email;
            document.getElementById('phone').value = userData.phone;

            // Removing the existing user data from the local storage
            // localStorage.removeItem(email);

            // Removing the corresponding list item
            itemList.removeChild(li);
        }
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    var newItem = document.getElementById('item').value;
    var newdesc = document.getElementById('description').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    var li = document.createElement('li');
    li.className = 'list-group-item';

    var space = ' ';
    var bigSpace = ' - ';

    var fullName = 'FullName: ' + newItem;
    var emailText = 'Email: ' + email;
    var phoneText = 'Phone Number: ' + phone;

    li.appendChild(document.createTextNode(fullName));
    li.appendChild(document.createTextNode(space));
    li.appendChild(document.createTextNode(newdesc));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(emailText));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(phoneText));
    li.appendChild(document.createTextNode(space));

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm float-right delete';
    deleteBtn.appendChild(document.createTextNode('X'));
    var editBtn = document.createElement('button'); // Create an edit button
    editBtn.className = 'editbutton';
    editBtn.appendChild(document.createTextNode('Edit'));

    li.appendChild(deleteBtn);
    li.appendChild(editBtn); // Appending the edit button

    itemList.appendChild(li);

    var userDetails = {
        firstName: newItem,
        lastName: newdesc,
        emailId: email,
        phone: phone
    };
    console.log('userDetails:', userDetails);
    axios.post("http://localhost:3000/user/add-user", userDetails)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML +
                "<h3 style='color:red'> Something Went wrong!!!</h4>",
                console.log(err);
        });

    // Creating a new list item
    var li = document.createElement('li');
    li.className = 'list-group-item';

    // localStorage.setItem(email, JSON.stringify(userDetails));
    console.log('User details added to Our server!!', userDetails);
}

document.addEventListener('DOMContentLoaded', handlePageLoad);

function handlePageLoad() {
    // Making a GET request to retrieve data from the backend server
    axios.get("http://localhost:3000/user/get-user")
        .then((response) => {
            // Displaying the data on the screen and in the console
            showNewUserOnScreen(response.data.allUsers);
            console.log('handlepageload data', response.data.allUsers);
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);
        });
}

function showNewUserOnScreen(user) {
    const parentNode = document.getElementById('items');
    parentNode.innerHTML = '';

    for (var i = 0; i < user.length; i++) {
        console.log('showing the user details on page: ', user[i])
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = user[i].id;

        // Creating elements with appropriate classes
        const firstNameElement = document.createElement('span');
        firstNameElement.className = 'firstName';
        firstNameElement.innerText = `FirstName: ${user[i].firstName}`;

        const lastNameElement = document.createElement('span');
        lastNameElement.className = 'lastName';
        lastNameElement.innerText = `LastName: ${user[i].lastName}`;

        const emailIdElement = document.createElement('span');
        emailIdElement.className = 'emailId';
        emailIdElement.innerText = `Email: ${user[i].emailId}`;

        const phoneElement = document.createElement('span');
        phoneElement.className = 'phone';
        phoneElement.innerText = `Phone: ${user[i].phone}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm float-right delete';
        deleteBtn.appendChild(document.createTextNode('X'));
        // Using a closure to capture the current value of userId
        deleteBtn.onclick = (function (userId) {
            return function () {
                deleteUser(userId);
            };
        })(user[i].id);

        const editBtn = document.createElement('button');
        editBtn.className = 'editbutton';
        editBtn.appendChild(document.createTextNode('Edit'));
        // Using a closure to capture the current values of user[i]
        editBtn.onclick = (function (userId, firstName, lastName, phone, emailId) {
            return function () {
                editUserDetails(userId, firstName, lastName, phone, emailId);
            };
        })(user[i].id, user[i].firstName, user[i].lastName, user[i].phone, user[i].emailId);

        // Appending elements to the li
        li.appendChild(firstNameElement);
        li.appendChild(lastNameElement);
        li.appendChild(emailIdElement);
        li.appendChild(phoneElement);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);

        parentNode.appendChild(li);
    }
}

function editUserDetails(userId, firstName, lastName, phone, emailId){
    document.getElementById('email').value = emailId;
    document.getElementById('item').value = firstName;
    document.getElementById('description').value = lastName;
    document.getElementById('phone').value = phone;
    deleteUser(userId)
}

function deleteUser(userId) {
    axios.delete(`http://localhost:3000/user/delete-user/${userId}`)
        .then((response) => {
            removeUserFromScreen(userId);
        })
        .catch((err) => err);
}

function removeUserFromScreen(userId) {
    const parentNode = document.getElementById('items');
    const childNodeTobeDeleted = document.getElementById(userId);
    if (childNodeTobeDeleted) {
        parentNode.removeChild(childNodeTobeDeleted);
    }
}
