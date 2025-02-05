const fs  = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel')
dotenv.config({path:'./config.env'})
const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    // console.log(con.connection);
    console.log("Database connected successfully");

}).catch(err=>{
    throw err; 
});

//read file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
//import data int datbase


const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log("Data successfully loaded");
    }catch(err){
        console.log(err);
    }
    process.exit();

}



//delete all data

const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log("All data wiped sucessfully");
       
    }catch(err){
        console.log(err);
    }
    process.exit();
}


if(process.argv[2]==="--import"){
    importData();
}else if(process.argv[2]==="--delete"){
    deleteData()
    
}