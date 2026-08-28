const Cab = require("../models/Cab");
const User = require("../models/User");


exports.getCabs = async (req, res, next) => {
  try {

    const filter = {};

    if (req.query.available === "true") {
      filter.isAvailable = true;
    }

    const cabs = await Cab.find(filter)
      .populate("driver", "name phone email");

    res.json(cabs);

  } catch (error) {
    next(error);
  }
};


exports.getCab = async (req, res, next) => {
  try {

    const cab = await Cab.findById(req.params.id)
      .populate("driver", "name phone email");

    if (!cab) {
      return res.status(404).json({
        message: "Cab not found"
      });
    }

    res.json(cab);

  } catch (error) {
    next(error);
  }
};


exports.createCab = async (req, res, next) => {
  try {

    const cab = await Cab.create(req.body);

    res.status(201).json(cab);

  } catch (error) {
    next(error);
  }
};


exports.updateCab = async (req, res, next) => {
  try {

    const cab = await Cab.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!cab) {
      return res.status(404).json({
        message: "Cab not found"
      });
    }

    res.json(cab);

  } catch (error) {
    next(error);
  }
};


exports.deleteCab = async (req, res, next) => {
  try {

    const cab = await Cab.findByIdAndDelete(
      req.params.id
    );

    if (!cab) {
      return res.status(404).json({
        message: "Cab not found"
      });
    }

    res.json({
      message: "Cab deleted"
    });

  } catch (error) {
    next(error);
  }
};


// =================================
// ASSIGN DRIVER
// =================================

exports.assignDriver = async (req, res, next) => {

  try {

    const { driverId } = req.body;


    if (!driverId) {

      return res.status(400).json({
        message: "Driver is required"
      });

    }


    const cab = await Cab.findById(
      req.params.id
    );


    if (!cab) {

      return res.status(404).json({
        message: "Cab not found"
      });

    }


    const driver = await User.findById(
      driverId
    );


    if (!driver) {

      return res.status(404).json({
        message: "Driver not found"
      });

    }


    if (driver.role !== "driver") {

      return res.status(400).json({
        message: "Selected user is not a driver"
      });

    }


    cab.driver = driver._id;

    await cab.save();


    const updatedCab = await Cab.findById(
      cab._id
    ).populate(
      "driver",
      "name email phone"
    );


    res.json(updatedCab);

  } catch (error) {

    next(error);

  }

};