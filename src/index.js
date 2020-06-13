var express = require('express')
var app = express()
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'authorSDataBase'
const collectionName = 'authors'

const id = new ObjectID()

app.use(express.json())
const port = process.env.PORT || 8080;

var db;

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log("Database connection failed")
    }
    db = client.db(databaseName)

    // var myobj = [
    //     { auth_name: "Chetan Bhagath", date: new Date('1974-4-22'), year: 2004, award: 3, book: "Five Point Someone ", price: 200, bookSold: 150 },
    //     { auth_name: "Amrita Pritam", date: new Date('1919-9-1'), year: 2008, award: 2, book: "Hell-Heaven", price: 150, bookSold: 100 },
    //     { auth_name: "Jhumpa Lahiri", date: new Date('1967-7-10'), year: 2016, award: 4, book: "Black Rose", price: 130, bookSold: 180 },
    //     { auth_name: "Khushwant Singh", date: new Date('1915-2-3'), year: 1950, award: 3, book: "The Mark of Vishnu and Other Storie", price: 180, bookSold: 200 },
    //     { auth_name: "Khushwant Singh", date: new Date('1915-2-3'), year: 1953, award: 2, book: "The History of Sikhs", price: 100, bookSold: 200 },
    //     { auth_name: "Chetan Bhagath", date: new Date('1974-4-22'), year: 2009, award: 5, book: "2 States", price: 300, bookSold: 300 },
    //     { auth_name: "Chetan Bhagath", date: new Date('1974-4-22'), year: 2014, award: 3, book: "Half Girlfriend ", price: 180, bookSold: 400 },
    //     { auth_name: "Amrita Pritam", date: new Date('1919-9-1'), year: 1947, award: 6, book: "Rasidi Ticket", price: 300, bookSold: 250 },
    //     { auth_name: "Jhumpa Lahiri", date: new Date('1967-7-10'), year: 1999, award: 4, book: "A Temporary Matter1", price: 400, bookSold: 120 },
    //     { auth_name: "Jhumpa Lahiri", date: new Date('1967-7-10'), year: 2008, award: 3, book: "Unaccustomed Earth", price: 200, bookSold: 150 }];
    //     db.collection(collectionName).insertMany(myobj, function(err, res) {
    //     if (err) throw err;
    //     console.log(myobj.length, " document inserted");
    //     //db.close();
    //   })
});

app.post('/author', (req, res) => { 
    const date = new Date(req.body.date)
    req.body.date = date
    db.collection(collectionName).insert(req.body, (error, result) => {
        if(error) {
            return res.status(500).send(error)
        }
        res.send(result)
    });
})

app.get('/author/:award', (req, res) => {

    const award = req.params.award

    db.collection(collectionName).find({ award: { $gte: Number(award) } }).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
    });

})

app.get('/authors/:year', (req, res) => {
    
    const year = req.params.year
     db.collection(collectionName).find({year : { $gte : 2000}}).toArray(function(err, result) {
         if(err) throw err
         res.send(result)
     })
})

app.get('/authorProfit', (req, res) => {
    db.collection(collectionName).aggregate([
        {
            $group: {
                _id: "$auth_name",
                totalbook: { $sum: "$bookSold" },
                profit: {
                    $sum: {
                        $multiply: ["$bookSold", "$price"]
                    }
                }
            }
        }]).toArray(function (err, result) {
            if (err) throw err;
            res.send(result)
        })
})


app.get('/author/:date/:profit', (req, res) => {
    const date = req.params.date
    const profit = req.params.profit

    db.collection(collectionName).aggregate([

        {
            $match: { "date": { $gte: new Date(date) } }

        },

        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                bookSold: { $sum: "$bookSold" }

            }

        },
        {
            $match: {
                bookSold: { $gte: Number(profit) }
            }
        }
    ]).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
    })

})

app.listen(port, () => console.log(`Listening on port ${port}..`));