const path = require('path');
var cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());  // Add this line for JSON support
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Adding booking appointment user data in database table named as users
app.post('/user/add-user', async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const emailId = req.body.emailId;
        const phone = req.body.phone;

        const data = await User.create({
            emailId: emailId,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        });
        res.status(201).json({ newUserDetails: data });
        console.log('added to server');
    } catch (err) {
        res.status(500).json({ error: err });
        console.error(err);
    }
});
// getting data from the users table
app.get('/user/get-user', async (req, res, next) => {
    const users = await User.findAll();
    res.status(200).json({ allUsers: users });
});

// deleting a user
app.delete('/user/delete-user/:userId', async (req, res, next) => {
    const userId = req.params.userId;

    try {
        // Delete the user from the database
        const result = await User.destroy({
            where: { id: userId }
        });

        res.status(200).json({ message: 'User deleted successfully', result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.use(errorController.get404);

sequelize.sync()
    .then(result => {
        app.listen(3000);
        console.log('Server is running on port 3000');
    })
    .catch(err => console.log(err));
