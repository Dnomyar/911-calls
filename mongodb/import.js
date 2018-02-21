var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';

var insertCalls = function(db, callback) {
    var collection = db.collection('calls');

    var calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', rawCall => {
            var call = {
                'location': {
                    type: 'Point',
                    coordinates: [parseFloat(rawCall.lng.trim()), parseFloat(rawCall.lat.trim())]
                },
                'desc': rawCall.desc.trim(),
                'zip': rawCall.zip.trim(),
                'title': rawCall.title.trim(),
                'category': rawCall.title.split(':')[0].trim(), // get cat. from title 
                'timeStamp': new Date(rawCall.timeStamp.trim()),
                'twp': rawCall.twp.trim(),
                'addr': rawCall.addr.trim(),
                'e': rawCall.e.trim()
            }; 
            calls.push(call);
        })
        .on('end', () => {
          collection.insertMany(calls, (err, result) => {
            callback(result)
          });
        });
}

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
