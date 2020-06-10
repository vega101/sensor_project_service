const mongoose = require('../../common/services/mongoose.service').mongoose;
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

const tempratureMetric = mongoose.model('tempratureMetrics', tempratureMetricSchema);
const pressureMetric = mongoose.model('pressureMetrics', pressureMetricSchema);
const humidityMetric = mongoose.model('humidityMetrics', humidityMetricSchema);

exports.createMetric = async (metricData) => {
   
    const updateData = await updateDb(metricData);
    return updateData;

};

async function updateDb(metricData){
    var responses = [];

    for (var i = 0; i < metricData.length; i++) {
        var item = metricData[i];
        var metric = null;

        if (Number(item.metricType) === 1){
            metric = new tempratureMetric(item);            
        } else if (Number(item.metricType) === 2){
            metric = new pressureMetric(item);           
        }else if (Number(item.metricType) === 3){
            metric = new humidityMetric(item);           
        }

        var metricResponse = await metric.save();
        responses.push({id: metricResponse._id});
    }

    return responses;
}