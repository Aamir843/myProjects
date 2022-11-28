const sql  = require('mssql/msnodesqlv8');
var config = {
    server : "IN-PG02NMCK\\SQLEXPRESS",
    driver : 'msnodesqlv8',
    database : "ResultManagement",
    options: {
        trustedConnection : true

    }
};

sql.connect(config, function (err) {
    if (err) {
        console.log(err);

    }
    console.log("connected");
    var request = new sql.Request();
    // request.query('select * from Results' , function(err , recordSet){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         console.log(recordSet)
    //     }
    // });
});

// con.connect((err) => {
//     if(err) throw err;
//     console.log("created successfuly")
// })



module.exports.config = config;
module.exports.request = this.request;
