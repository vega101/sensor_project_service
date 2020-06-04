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
const airPressureMetricSchema = new Schema(metricModel);

const tempratureMetric = mongoose.model('tempratureMetrics', tempratureMetricSchema);
const airPressureMetric = mongoose.model('airPressureMetrics', tempratureMetricSchema);

exports.createMetric = (metricData) => {

    metricData.forEach(item => {
        var metric = null;

        if (Number(item.metricType) === 1){
            metric = new tempratureMetric(item);
            return metric.save();
        } else if (Number(item.metricType) === 2){
            metric = new airPressureMetric(item);
            return metric.save();
        }


    });


};