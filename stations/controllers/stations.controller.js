const StationModel = require('../models/stations.model');

exports.insert = async (req, res) => {  
    const data = await StationModel.createStation(req.body)
    res.status(201).send(data) ;
};

exports.list = (req, res) => { 
    let pageSize = req.query.pageSize && req.query.pageSize <= 100 ? parseInt(req.query.pageSize) : 10;
    let page = 0;
    let data = req.body;

    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    StationModel.list(pageSize, page, data)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getStationById = async (req, res) => {
    let id = req.query.id ? req.query.id : null;
    if (id) {
        StationModel.getStationById(id)
        .then((result) => {
            res.status(200).send(result);
        })
    } else {
        res.status(200).send('');
    }
}


