const mongoose = require('../../common/services/mongoose.service').mongoose;
const enums = require('../../common/enums/enums');
const Schema = mongoose.Schema;

//might want to crate separate schemas for temprature, pressure & other readings

const metricModel = {
    stationId: Number,
    location:  String,
    date: Number,
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
   
    const updateData = await updateDb(metricData);
    return updateData;

};

exports.list = (perPage, page, metricType, data) => {
    return new Promise((resolve, reject) => {
        let metric;
        let filter = data.filters;
        let sort = data.sort;

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
        
        if (validateQueryObj(filter, 'filter')) {

        }

        if (validateQueryObj(sort, 'sort')) {

        }

        metric.find({
            $and: [{value: 25.1}, {location: 'Living Room'}]
        })
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, users) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        })

    });
};

function validateQueryObj(filters, type) {
     
    if (Array.isArray(filters) && filters.length) {
        
        let isValid = true;
        for (f of filters){
            let isValidItem = validateQueryItem(f, type);
            if (!isValidItem){
                isValid = false;
                break;
            }
        }

        return isValid;

    } else {
        return false;
    }

    function validateQueryItem(fi, type){
        var isValid = false;
        if (Object.keys(fi).length === 1) {
            let prop = Object.keys(fi)[0];
            if (metricModel.hasOwnProperty(prop)) {
                if (type === 'sort') {
                    if (fi[prop] === 1 || fi[prop] === -1) {
                        isValid = true;
                    }
                } else {
                    isValid = true;
                }
                
            }
        } 
        return isValid;
    }
}

async function updateDb(metricData){
    var responses = [];

    for (item of metricData) {       
        var metric = null;

        item.date = new Date(Number(item.date) * 1000);

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