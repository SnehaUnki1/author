var express = require('express')
var app = express()
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'authour'
const authourCollectionName = 'authors'
const booksCollectionName = 'books'

const id = new ObjectID()

app.use(express.json())
const port = process.env.PORT || 8080;

var db;

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log("Database connection failed")
    }
    db = client.db(databaseName)
});

app.post('/author', (req, res) => {
    const date = new Date(req.body.date)
    req.body.date = date
    db.collection(collectionName).insert(req.body, (error, result) => {
        if (error) {
            return res.status(500).send(error)
        }
        res.send(result)
    });
})

//Task:1-- Create GET api to fetch authors who have greater than or equal to n awards
app.get('/author/:award', (req, res) => {

    const award = req.params.award

    db.collection("authors").aggregate([
        {
            $project:{
                _id : "$_id",
                FirstName : "$name.first",
                LastName : "$name.last",
                NumOfAwards: {$size:{ "$ifNull": [ "$awards", [] ] }}
            }
        },
        { $match : { NumOfAwards : { $gte : Number(award)}}}]      
        
    ).toArray(function (err, result) {
        if (err) throw err;
        console.log(result)
        res.send(result)
    });

})

//Task:2--Create GET api to fetch authors who have won award where year >= y
app.get('/authors/:year', (req, res) => {

    const year = req.params.year

    db.collection("authors").aggregate([
       // {$unwind : "$awards"},
        {
            $project:{
                _id : "$_id",
                FirstName : "$name.first",
                LastName : "$name.last",
                year: "$awards.year"
            }
        },
        { $match : { year : { $gte : Number(year)}}}]      
        
    ).toArray(function (err, result) {
        if (err) throw err;
        console.log(result)
        res.send(result)
    });
    
})

//Task:3-- Create GET api to fetch total number of books sold and total profit by each author.

app.get('/authorProfit', (req, res) => {
    db.collection(booksCollectionName).aggregate([
        {
            $group: {
                _id: "$authorId",
                totalbooksold: { $sum: "$sold" },
                totalprofit: {
                    $sum: {
                        $multiply: ["$sold", "$price"]
                    }
                }
            }
        }]).toArray(function (err, result) {
            if (err) throw err;
            res.send(result)
        })
})

//Task:4-- Create GET api which accepts parameter birthDate and totalPrice, where birthDate is
//date string and totalPrice is number.

app.get('/author/:date/:price', (req, res) => {
    const date = req.params.date
    const price = req.params.price

    db.collection("authors").aggregate([
        {
                $match: { "birth": { $gte: new Date(date) } }
    
        },

        {
            $lookup:
              {
                localField: "_id",
                from: "books",
                foreignField: "authorId",
                as: "auothor_books"
              }
         },{
             $unwind : "$auothor_books"
         },
         {
             $group: {
                 _id : "$auothor_books.authorId",         
                  totalprice : {$sum : "$auothor_books.price"}
                
             }
         },
         {
             $match:{
                 totalprice : {$gte : Number(price)}
             }
         }
    ]).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
    })

})

app.listen(port, () => console.log(`Listening on port ${port}..`));