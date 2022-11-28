var express = require('express');

const app = express();
const port = 3307

app.set("view engine" , "hbs");
app.set("views" , "./views")
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json());

var path  =  require('path');
var sql = require('mssql');
const async = require('hbs/lib/async');
var mysql =  require('./connection').config;




app.get("/" , (req,res) => {
    res.render("index.hbs")
} );



app.get("/addstudent" , (req,res) => {
    res.render("addstudent.hbs")
    
} );

app.get("/editstudent/:RollNumber" , async (req,res) => {
    const roll = req.params.RollNumber;

    const result = await sql.query`select * from Results where RollNumber=${roll}`;

    const name = result.recordset[0].Name;
    const birth = result.recordset[0].DateOfBirth;
    const score = result.recordset[0].Score;

    res.render("editstudent.hbs" , { Roll: roll , NName:name,BBirth:birth,SScore:score });
    
    
} );



app.get("/delete/:RollNumber" , async (req,res)=>{
    const roll = req.params.RollNumber;
    //const { Name , RollNo , DateOfBirth , Score  } = req.query;
    const result = await sql.query`delete from Results where RollNumber=${roll} `;
    res.redirect("/teacher");
    //console.log(result);
} );


app.get("/student" , (req,res) => {
    res.render("student.hbs")
} );

app.get("/teacher" , (req,res) => {
    res.render("teacher.hbs")
} );


app.get("/result" , (req,res) =>{
    res.render("result.hbs")
});


app.get("/addedresult" , async (req,res)=> {
    const { Name , RollNo , DateOfBirth , Score  } = req.query


    try{
        const result = await sql.query`insert into results(Name , RollNumber , DateOfBirth , Score) values(${Name} , ${RollNo} , ${DateOfBirth} , ${Score});`
        if(result.rowsAffected[0] == 1 ){
            res.render("addstudent" , {mssg : true});
            
           
        }
        
    }
    catch(err){
        res.render("addstudent" , {invalid:true});
    }


});




app.get("/teacher" , async (req,res)=> {

    const result = await sql.query`select * from results` ;

    res.render("teacher" , {dataa : result.recordset  , len:result.recordset.length });

});


app.get("/updateResult" , async ( req,res)=>{

    const { Name , RollNo , DateOfBirth , Score  } = req.query
    try{

        const update = await sql.query`update Results set Name=${Name} , DateOfBirth=${DateOfBirth} ,Score=${Score} where RollNumber=${RollNo} `;
        if(update.rowsAffected[0] == 1 ){
            res.redirect("/teacher");               
        }
        else{
            console.log("error");
        }

    }

    catch(err){
        res.render("editstudent" , {failed:true});
        console.log(err);
    }
});



app.get("/search" , async (req,res)=>{

    const { RollNo , DateOfBirth   } = req.query;

    try{

        const search = await sql.query`select * from Results where RollNumber=${RollNo} and DateOfBirth=${DateOfBirth}`;
        if(search.recordset[0]){
            res.render("result" , {data : search.recordset});

        }
        else{
            
            res.render("student" , {notfound:true} );
        }
        

    }
    catch(err){
        res.render("student" , {notfound:true});
        console.log(err);

    }

});



    
    
    
    







app.listen(port , (err) => {
    if(err){
        throw err
    }
    else{
        console.log("server is running")
    }

});


