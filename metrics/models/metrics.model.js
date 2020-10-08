const mongoose = require('../../common/services/mongoose.service').mongoose;
const enums = require('../../common/enums/enums');
const validationHelpers = require('../../common/validation/validationHelpers');
const StationModel = require('../../stations/models/stations.model');

const Schema = mongoose.Schema;

const metricModelSchema = ['stationId', 'value', 'metricType', 'date'];
const gridSchema = ['locationName', 'stationName', 'metricType', 'dateCreated', 'value'];

const metricModel = {
    station: Object,
    dateCreated: Date,
    metricDate: Date,
    value: Number,
    metricType: Number
}

const tempratureMetricSchema = new Schema(metricModel);
const pressureMetricSchema = new Schema(metricModel);
const humidityMetricSchema = new Schema(metricModel);
const lightMetricSchema = new Schema(metricModel);

const tempratureMetric = mongoose.model('tempratureMetrics', tempratureMetricSchema);
const pressureMetric = mongoose.model('pressureMetrics', pressureMetricSchema);
const humidityMetric = mongoose.model('humidityMetrics', humidityMetricSchema);
const lightMetric = mongoose.model('lightMetrics', lightMetricSchema);

exports.createMetric = async (metricData) => {
   
    validationHelpers.validateRequestData(metricData, metricModelSchema);

    let validData = metricData.filter(item => {
        return item.isValid;
    });

    if (validData.length){
        let stationId = validData[0].stationId;
        let station = await StationModel.getStationById(stationId); //to do - get this from stations.model

        validData = validData.map(item => {
            return {
                station: station,
                //metricDate: new Date(item.date * 1000),
                metricDate: new Date(item.date.year, item.date.month, item.date.day, item.date.hours, item.date.minutes, item.date.seconds, 0),
                value: item.value,
                metricType: item.metricType
            }
        })
    
        const updateData = await updateDb(validData);
        return updateData;

    }
    
};

exports.list = (perPage, page, metricType, data) => {
    return new Promise((resolve, reject) => {
        let metric;
        let filter = data.filters; //array
        let sort = data.sort; //object

        switch (metricType){
            case enums.metricTypes.temprature:
                metric = tempratureMetric;
                break;
            case enums.metricTypes.pressure:
                metric = pressureMetric;
                break;
            case enums.metricTypes.humidity:
                metric = humidityMetric;
                break;
            case enums.metricTypes.light:
                metric = lightMetric;
                break;
            default:
                metric = tempratureMetric;
                break;

        }
        
        let  dbQuery = metric.find({})

        if (validationHelpers.validateQueryObj(filter, gridSchema)) {
            dbQuery = metric.find({
                $and: filter
            })
        }

        if (validationHelpers.validateSortObj(sort, gridSchema)) { 
            dbQuery.sort(sort)
        }

        // metric.find({
        //     $and: [{value: 25.1}, {location: 'Living Room'}]
        // })

        dbQuery.limit(perPage);
        dbQuery.skip(perPage * page);
        dbQuery.exec(function (err, users) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        })

    });
};



async function updateDb(metricData){
    var responses = [];

    for (item of metricData) {       
        var metric = null;

        item.dateCreated = new Date();

        if (Number(item.metricType) === enums.metricTypes.temprature){
            metric = new tempratureMetric(item);            
        } else if (Number(item.metricType) === enums.metricTypes.pressure){
            metric = new pressureMetric(item);           
        } else if (Number(item.metricType) === enums.metricTypes.humidity){
            metric = new humidityMetric(item);           
        } else if (Number(item.metricType) === enums.metricTypes.light){
            metric = new lightMetric(item);           
        }

        var metricResponse = await metric.save();
        responses.push({id: metricResponse._id});
    }

    return responses;
}