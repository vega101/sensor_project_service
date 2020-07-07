const mongoose = require('../../common/services/mongoose.service').mongoose;
const validationHelpers = require('../../common/validation/validationHelpers');
const ObjectId = require('mongoose').Types.ObjectId; 

const Schema = mongoose.Schema;

const locationModelSchema = ['locationName', 'gpsCoordinates'];
const gridSchema = ['locationName', 'gpsCoordinates', 'dateCreated'];

const locationModel = {
    locationName: String,
    gpsCoordinates: String,
    dateCreated: Date
}

const locationItemSchema = new Schema(locationModel);
const locationItem = mongoose.model('locations', locationItemSchema);


exports.createLocation = async (locationData) => {
   
    validationHelpers.validateRequestData(locationData, locationModelSchema);

    let validData = locationData.filter(item => {
        return item.isValid;
    });

    if (validData.length){
        
        validData = validData.map(item => {
            return {
                locationName: item.locationName,
                gpsCoordinates: item.gpsCoordinates,
                dateCreated: null,

            }
        })
    
        const updateData = await updateDb(validData);
        return updateData;

    }
    
};

exports.list = (perPage, page, data) => {
    return new Promise((resolve, reject) => {
        let location = new locationItem;
        let filter = data.filters; //array
        let sort = data.sort; //object
        
        let  dbQuery = location.find({})

        if (validationHelpers.validateQueryObj(filter, gridSchema)) {
            dbQuery = location.find({
                $and: filter
            })
        }

        if (validationHelpers.validateSortObj(sort, gridSchema)) { 
            dbQuery.sort(sort)
        }

        dbQuery.limit(perPage);
        dbQuery.skip(perPage * page);
        dbQuery.exec(function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })

    });
};

exports.getLocationById = async (id) => {
    let o_id = new ObjectId(id);

    let result = await locationItem.findById(o_id);
    result = result.toJSON();
    return result;
}

// exports.getLocationById = (id) => {
//     let o_id = new ObjectId(id);

//     return locationItem.findById(o_id)
//     .then((result) => {
//         result = result.toJSON();       
//         return result;
//     });
// }


async function updateDb(locationData){
    var responses = [];

    for (item of locationData) {           
        item.dateCreated = new Date();  
        let location = new locationItem(item);
        var locationResponse = await location.save();
        responses.push({id: locationResponse._id.toString()});
    }

    return responses;
}