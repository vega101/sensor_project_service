const mongoose = require('../../common/services/mongoose.service').mongoose;
const validationHelpers = require('../../common/validation/validationHelpers');
const LocationModel = require('../../locations/models/locations.model');
const ObjectId = require('mongoose').Types.ObjectId;

const Schema = mongoose.Schema;

const stationModelSchema = ['locationId', 'stationName'];
const gridSchema = ['locationName', 'stationName', 'dateCreated'];

const stationModel = {
    stationName: String,
    dateCreated: Date,
    location: Object
}

const stationItemSchema = new Schema(stationModel);
const stationItem = mongoose.model('stations', stationItemSchema);

exports.createStation = async (stationData) => {
   
    validationHelpers.validateRequestData(stationData, stationModelSchema);

    let validData = stationData.filter(item => {
        return item.isValid;
    });

    if (validData.length){
        let locationId = validData[0].locationId;
        let location = await LocationModel.getLocationById(locationId); 

        validData = validData.map(item => {
            return {
                stationName: item.stationName,
                dateCreated: item.dateCreated,
                location: location
            }
        })
    
        const updateData = await updateDb(validData);
        return updateData;

    }
    
};

exports.list = (perPage, page, data) => {
    return new Promise((resolve, reject) => {
        let station = new stationItem;
        let filter = data.filters; //array
        let sort = data.sort; //object
        
        let  dbQuery = station.find({})

        if (validationHelpers.validateQueryObj(filter, gridSchema)) {
            dbQuery = station.find({
                $and: filter
            })
        }

        if (validationHelpers.validateSortObj(sort, gridSchema)) { 
            dbQuery.sort(sort)
        }

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

exports.getStationById = async (id) => {
    let o_id = new ObjectId(id);

    let result = await stationItem.findById(o_id);
    result = result.toJSON();
    return result;
}

async function updateDb(stationData){
    var responses = [];

    for (item of stationData) {               
        item.dateCreated = new Date();
        let station = new stationItem(item);
        var stationResponse = await station.save();
        responses.push({id: stationResponse._id.toString()});
    }

    return responses;
}