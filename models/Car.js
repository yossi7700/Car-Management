const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  carType: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['Approved', 'Pending', 'Denied'],
    default: 'Pending',
  },
  permission: {
    type: Boolean,
    default: false,
  },
  entryLogs: {
    type: [Date],
    default: [],
  },
  exitLogs: {
    type: [Date],
    default: [],
  },
});

module.exports = mongoose.model('Car', carSchema);