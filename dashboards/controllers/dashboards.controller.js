const DashboardModel = require('../models/dashboards.model');

exports.getCurrentObservations = async (req, res) => {   
    let result = await DashboardModel.getCurrentObservations();
    res.status(200).send(result);
};

exports.getTest = (req, res) => {   
    res.status(200).send("hello");
};