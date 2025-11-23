const mongoose = require('mongoose');

/**
 * Cough Recording Schema
 * Stores individual cough recording data
 */
const coughRecordingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  date: String,
  time: String,
  duration: Number,
  intensity: String,
  intensityScore: Number,
  pattern: String,
  patternConfidence: Number,
  phases: String,
  phaseDescription: String,
  quality: String,
  qualityDescription: String,
  frequency: Number,
  peakAmplitude: Number,
  averageAmplitude: Number,
  dynamicRange: Number,
  energyLevel: String,
  efficiency: String,
  observation: String,
  observationType: String,
  recommendations: [String],
  type: {
    type: String,
    default: 'cough'
  }
}, { _id: true });

/**
 * Risk Test Data Schema
 * Stores risk assessment results
 */
const riskTestDataSchema = new mongoose.Schema({
  score: Number,
  percentage: Number,
  riskLevel: String,
  questions: mongoose.Schema.Types.Mixed,
  answers: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

/**
 * Habits Data Schema
 * Stores daily lifestyle habits
 */
const habitsDataSchema = new mongoose.Schema({
  sleep: Number,
  exercise: Number,
  water: Number,
  stress: Number,
  smoking: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

/**
 * Health Data Schema
 * Main schema for storing all health-related data for a user
 */
const healthDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  coughHistory: {
    type: [coughRecordingSchema],
    default: []
  },
  riskTestData: {
    type: riskTestDataSchema,
    default: null
  },
  habitsData: {
    type: habitsDataSchema,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Update the updatedAt timestamp before saving
 */
healthDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Index for efficient queries by userId
 */
healthDataSchema.index({ userId: 1 });

/**
 * Method to add a cough recording
 * @param {object} recording - Recording data to add
 */
healthDataSchema.methods.addRecording = function(recording) {
  this.coughHistory.unshift(recording);
  return this.save();
};

/**
 * Method to remove a specific recording
 * @param {string} recordingId - ID of recording to remove
 */
healthDataSchema.methods.removeRecording = function(recordingId) {
  this.coughHistory = this.coughHistory.filter(
    rec => rec._id.toString() !== recordingId
  );
  return this.save();
};

/**
 * Method to update risk test data
 * @param {object} riskData - Risk assessment data
 */
healthDataSchema.methods.updateRiskData = function(riskData) {
  this.riskTestData = {
    ...riskData,
    timestamp: Date.now()
  };
  return this.save();
};

/**
 * Method to update habits data
 * @param {object} habitsData - Habits data
 */
healthDataSchema.methods.updateHabitsData = function(habitsData) {
  this.habitsData = {
    ...habitsData,
    timestamp: Date.now()
  };
  return this.save();
};

/**
 * Static method to find or create health data for user
 * @param {string} userId - User ID
 */
healthDataSchema.statics.findOrCreate = async function(userId) {
  let healthData = await this.findOne({ userId });

  if (!healthData) {
    healthData = await this.create({ userId });
  }

  return healthData;
};

module.exports = mongoose.model('HealthData', healthDataSchema);
