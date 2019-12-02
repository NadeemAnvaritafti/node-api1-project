// implement your API here

const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());


// GET request for all users
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        console.log('error on GET /api/users', error);
        res.status(500).json({ error: 'The users information could not be retrieved.' })
    })
})

// GET request for specific user 
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
        db.findById(id) 
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'The user with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be retrieved.' })
        })  
}) 

// POST request for adding a user
server.post('/api/users', (req, res) => {
    const usersData = req.body;
    if (!usersData.name || !usersData.bio) {
            res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
        } else {
            db.insert(usersData)    
            .then(user => {
                res.status(201).json(user);
            })
            .catch(error => {
                console.log('error on POST /api/users', error);
                res.status(500).json({ error: 'There was an error while saving the user to the database' })
            })
        }
})

// DELETE request for removing a user
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if (removed) {
            res.status(200).json({ message: 'user removed successfully', removed })   
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/users/:id', error);
        res.status(500).json({ error: 'The user could not be removed' })
    })
})

// PUT request for editing a user
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const usersData = req.body;
    if (!usersData.name || !usersData.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
    }
    db.findById(id) 
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'The user with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be retrieved.' })
        }) 
    if (usersData.name && usersData.bio && id) {
        db.update(id, usersData)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            console.log('error on PUT /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be modified.' })
        })
    }
})





const port = 4001;
server.listen(port, () => 
    console.log(`\n **API running on port ${port} **\n`)
);
