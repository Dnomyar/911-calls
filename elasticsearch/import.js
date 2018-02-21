var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});


esClient.indices.create({ index: 'calls' }, (err, resp) => {
  if (err) {
    console.log(err.message);
  } else {
    esClient.indices.putMapping({
      index: 'calls',
      type: 'call',
      body: {
        call: {
          properties: {
            timeStamp : {
              type: 'date',
              format: 'yyyy-MM-dd HH:mm:ss'
            },
            location: {
              type: 'geo_point'
            }
          }
        }
      }
    }, (err, resp) => {
      if (err) {
        console.log(err.message);
      }
    });
  }
});

let calls = [];

fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      const titleExploded = data.title.split(':')
      calls.push({
        lat: data.lat,
        lng: data.lng,
        desc: data.desc,
        zip: data.zip,
        title_cat: titleExploded[0].trim(),
        title_descr: titleExploded[1].trim(),
        timeStamp: data.timeStamp,
        twp: data.twp,
        addr: data.addr,
        e: data.e
      });
    })
    .on('end', () => {
      esClient.bulk(createBulkInsertQuery(calls), (err, resp) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(`${resp.items.length} calls inserted`);
        }
        esClient.close();
      });
    });



// Merci a Clément pour la fonction
// Fonction utilitaire permettant de formatter les données pour l'insertion "bulk" dans elastic
function createBulkInsertQuery(calls) {
  const body = calls.reduce((acc, call) => {
    const { lat,lng,desc,zip,title_cat,title_descr,timeStamp,twp,addr,e } = call;
    acc.push({ index: { _index: 'calls', _type: 'call'} });
    acc.push({ 
      location: {
        lat: lat,
        lon: lng
      },
      desc,
      zip,
      title_cat,
      title_descr,
      timeStamp,
      twp,
      addr,
      e });
    return acc;
  }, []);

  return { body };
}