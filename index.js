const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const port = 5001

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vl9uy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('clients'));
app.use(fileUpload());

client.connect(err => {
    const reg = client.db("libraryManagement").collection("reg");
    const bookList = client.db("libraryManagement").collection("bookList");
    const issueBook = client.db("libraryManagement").collection("issueBook");
    const issue = client.db("libraryManagement").collection("issue");

    console.log('DB Connected')
    console.log(err)

    // Students & Teachers REG
    app.post('/reg', (req, res) => {
        const Registration = req.body;
        // console.log(Registration)
        reg.insertOne(Registration)
            .then(result => {
                // console.log(Registration);
                res.send(result)
            })
    })
    app.get('/members', (req, res) => {
        reg.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    })


    // Add Book Details
    app.post('/addBook', (req, res) => {
        const BookDetails = req.body;
        // console.log(BookDetails)
        bookList.insertOne(BookDetails)
            .then(result => {
                // console.log(BookDetails);
                res.send(result)
            })
    })
    app.get('/books', (req, res) => {
        bookList.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    })


    // Issu Book
    app.post('/api/tregpost', (req, res) => {
        const GiveBook = req.body;
        console.log(GiveBook)
        issueBook.insertOne(GiveBook)
            .then(result => {
                console.log(GiveBook);
                res.send(result)
            })
    })
    app.get('/booksuuu', (req, res) => {
        issueBook.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    })




    app.post('/issues', function (req, res) {
        const issueL = req.body;
        console.log(issueL)
        issue.insertOne(issueL)
            .then(result => {
                console.log(issueL);
                res.send(result)
            })
    });

    app.get('/issue', (req, res) => {
        issue.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    });


    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
});
app.listen(process.env.PORT || port)