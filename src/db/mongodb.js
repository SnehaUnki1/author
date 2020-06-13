const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'authour'

const id = new ObjectID()

MongoClient.connect(connectionURL,{useNewUrlParser : true} , (error, client) =>{

    if(error){
        return console.log("Database connection failed")
    }
    const db = client.db(databaseName)
    console.log("Database connection successful")

    var myobj = [
        {auth_name: "Chetan Bhagath",date: new Date('1974-4-23'), year: 2004, award: 3, book:"Five Point Someone ", price : 200},
        {auth_name: "Amrita Pritam",date: new Date('1919-9-1'), year: 2008, award: 2, book:"Hell-Heaven", price : 150},
        {auth_name: "Jhumpa Lahiri",date: new Date('1967-7-10'), year: 2016, award: 4, book:"Black Rose", price : 130},
        {auth_name: "Khushwant Singh",date: new Date('1915-2-3'), year: 1950, award: 3, book:"The Mark of Vishnu and Other Storie", price : 180},
        {auth_name: "Khushwant Singh",date: new Date('1915-2-3'), year: 1953, award: 2, book:"The History of Sikhs", price : 100},
        {auth_name: "Chetan Bhagath",date: new Date('1974-4-22'), year: 2009, award: 5, book:"2 States", price : 300},
        {auth_name: "Chetan Bhagath",date: new Date('1974-4-22'), year: 2014, award: 3, book:"Half Girlfriend ", price : 180},
        {auth_name: "Amrita Pritam",date: new Date('1919-9-1'), year: 1947, award: 6, book:"Rasidi Ticket", price : 300},
        {auth_name: "Jhumpa Lahiri",date: new Date('1967-7-10'), year: 1999, award: 4, book:"A Temporary Matter1", price : 400},
        {auth_name: "Jhumpa Lahiri",date: new Date('1967-7-10'), year: 2008, award: 3, book:"Unaccustomed Earth", price : 200}];
    db.collection("authours").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log(myobj.length, " document inserted");
    //db.close();
  })

//   db.collection("authours").find({award:{$gt : 3}}).toArray(function(err, result) {  
//     if (err) throw err;  
//     console.log(result);  
//     });

});

