/*
lineReader will extract the records from amazon-meta.txt one at a time as
file is too large to read all at once.  In order to add records to a database you need to add code below to insert records

This code depnds on "line-reader"

You need to install line-reader by using the following command:
npm install line-reader

*/
var mysql      = require('mysql'),
    co         = require('co'),
    wrapper    = require('co-mysql');
var query;
var jsonRecord;
var execute = true;
var query;
var totalRecords = 0;

var lineReader = require('line-reader');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'jiaxingh',
  password : '12345678',
  database : 'EDISS',
  port     : 3306
});

var sql = wrapper(connection);

var values = ""; //The records read from the file.
var numRecords = 0; //The current number of records read from the file.
var recordBlock = 100; //The number of records to write at once.

lineReader.eachLine('metadata.json', function(line, last) {
  execute = false;
  currentLine = line.toString().replace(/'/g, "\"", "g");
  //console.log(currentLine);
  try{
    jsonRecord = JSON.parse(currentLine);

    if (numRecords) {
      values += ', ';
    }

    values += `('${jsonRecord.title}', '${jsonRecord.categories[0]}', '${jsonRecord.description}', '${jsonRecord.asin}')`;
    
    numRecords++;

    if (numRecords == recordBlock) {
      query = `INSERT INTO PRODUCT (product.name, product.group, productDescription, asin) VALUES ${values};`; //Template, replaces ${values} with the value of values.
      //console.log(query);
      values = "";
      numRecords = 0;
      execute = true;
    }
  }catch(err) {
    execute = false;//there was a quote in the text and the parse failed ... skip insert
  }
  if(execute){
    co(function* () {
        var resp = yield sql.query(query);
        totalRecords += recordBlock;
        console.log(totalRecords + " records inserted.");
    });
  }//if(execute)
});//lineReader.eachLine
