const mongoose = require('../../common/services/mongoose.service').mongoose;
const ObjectId = require('mongoose').Types.ObjectId; 
const MetricsModel = require('../../metrics/models/metrics.model');


const tempratureMetric = MetricsModel.tempratureMetric; 
const humidityMetric = MetricsModel.humidityMetric; 


exports.getCurrentObservations = async () => {
    
    let fromDate7Days = getFromDate7Days();
    let fromDate24Hours = getFromDate24Hours();

    //headlines
    let currentTemperature = await tempratureMetric.find().limit(1).sort({"dateCreated":-1});
    let currentHumidity = await humidityMetric.find().limit(1).sort({"dateCreated":-1});

    let highTemperature =  await tempratureMetric.find({"dateCreated" : { $gte : fromDate7Days }}).limit(1).sort({"value":-1});
    let lowTemperature =  await tempratureMetric.find({"dateCreated" : { $gte : fromDate7Days }}).limit(1).sort({"value":1});

    let highHumidity =  await humidityMetric.find({"dateCreated" : { $gte : fromDate7Days }}).limit(1).sort({"value":-1});
    let lowHumidity =  await humidityMetric.find({"dateCreated" : { $gte : fromDate7Days }}).limit(1).sort({"value":1});

    //charts
    let temperature24Results = await getTemperature24Results(fromDate24Hours);    
    let humidity24Results = await getHumidity24Results(fromDate24Hours);

    //high/low temp/humidity last 7 days, per day
    let highLowTemperature7Results = await getHighLowTemperature7Results(fromDate7Days)
    let highLowHumidity7Results = await getHighLowHumidity7Results(fromDate7Days)

    let resultsObj = {
        currentTemperature,
        currentHumidity,
        highTemperature,
        lowTemperature,
        highHumidity,
        lowHumidity,
        temperature24Results,
        humidity24Results,
        highLowTemperature7Results,
        highLowHumidity7Results
    }

    let result = JSON.stringify(resultsObj);

    return result;
};

async function getTemperature24Results(fromDate24Hours) {
    let temperatureData =  await tempratureMetric.find({"dateCreated" : { $gte : fromDate24Hours }});   
    let results = getDataGroupedByHour(temperatureData);
    return results;
}

async function getHumidity24Results(fromDate24Hours) {
     let temperatureData =  await humidityMetric.find({"dateCreated" : { $gte : fromDate24Hours }});
     let results = getDataGroupedByHour(temperatureData);
     return results;
 }

 async function getHighLowTemperature7Results(fromDate7Days) {
    let temperatureData =  await tempratureMetric.find({"dateCreated" : { $gte : fromDate7Days }});   
    let results = getHighLowDataGroupedByDay(temperatureData);
    return results;
}

async function getHighLowHumidity7Results(fromDate7Days) {
    let temperatureData =  await humidityMetric.find({"dateCreated" : { $gte : fromDate7Days }});   
    let results = getHighLowDataGroupedByDay(temperatureData);
    return results;
}

function getDataGroupedByHour(data) {
    let results = [];

    let grouped = groupBy(data, item => item.dateCreated.getFullYear() + "-" + item.dateCreated.getMonth() + "-" + item.dateCreated.getDate() + "-" + item.dateCreated.getHours());

    grouped.forEach(item => {
        item.sort((a, b) => b.dateCreated - a.dateCreated);
        results.push({date: item[0].dateCreated, value: item[0].value});
    })

    return results;
}

function getHighLowDataGroupedByDay(data) {
    let results = { high: [], low: [] };

    let grouped = groupBy(data, item => item.dateCreated.getFullYear() + "-" + item.dateCreated.getMonth() + "-" + item.dateCreated.getDate());

    grouped.forEach(item => {
        item.sort((a, b) => b.value - a.value);
        results.low.push({date: item[0].dateCreated, value: item[0].value});
        results.high.push({date: item[item.length - 1].dateCreated, value: item[0].value});
    })

    return results;
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

function getFromDate7Days() {
    var currentDate = new Date();
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
    var fromDate = currentDate.setDate(currentDate.getDate() - 6);
    fromDate = new Date(fromDate);
    fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0, 0);
    return fromDate;
}

function getFromDate24Hours() {
    var fromDate = new Date()
    fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0, 0);
    fromDate.addHours(-24);
    return fromDate;
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }

// exports.getCurrentObservations = () => {
//     return new Promise((resolve, reject) => {
//         let temperature = new tempratureMetric;
        
//         let o_id = new ObjectId("5f7f6c668139d23350c2a6b8");

//         let result = await temperature.findById(o_id);
//         result = result.toJSON();
//         return result;

//         // let  dbQuery = location.find({})
     

//         // dbQuery.exec(function (err, results) {
//         //     if (err) {
//         //         reject(err);
//         //     } else {
//         //         resolve(results);
//         //     }
//         // })

//     });
// };