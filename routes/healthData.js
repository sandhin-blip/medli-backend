const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  addRecording,
  getRecordings,
  deleteRecording,
  saveRiskAssessment,
  getRiskAssessment,
  saveHabits,
  getHabits,
  exportData,
  getDashboard
} = require('../controllers/healthDataController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Validation middleware
 */
const validateRecording = [
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('timestamp')
    .optional()
    .isNumeric()
    .withMessage('Timestamp must be a number')
];

const validateRiskAssessment = [
  body('riskLevel')
    .notEmpty()
    .withMessage('Risk level is required')
    .trim(),
  body('percentage')
    .notEmpty()
    .withMessage('Percentage is required')
    .isNumeric()
    .withMessage('Percentage must be a number')
    .custom((value) => value >= 0 && value <= 100)
    .withMessage('Percentage must be between 0 and 100')
];

const validateHabits = [
  body('sleep')
    .optional()
    .isNumeric()
    .withMessage('Sleep hours must be a number'),
  body('exercise')
    .optional()
    .isNumeric()
    .withMessage('Exercise minutes must be a number'),
  body('water')
    .optional()
    .isNumeric()
    .withMessage('Water intake must be a number'),
  body('stress')
    .optional()
    .isNumeric()
    .withMessage('Stress level must be a number'),
  body('smoking')
    .optional()
    .isBoolean()
    .withMessage('Smoking status must be boolean')
];

const validateRecordingId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid recording ID')
];

/**
 * Validation result handler
 */
const { validationResult } = require('express-validator');
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }
  next();
};

// All routes are protected (require authentication)

// Dashboard - Get summary of all health data
router.get('/dashboard', protect, getDashboard);

// Recording routes
router.post(
  '/recording',
  protect,
  validateRecording,
  handleValidationErrors,
  addRecording
);

router.get('/recordings', protect, getRecordings);

router.delete(
  '/recording/:id',
  protect,
  validateRecordingId,
  handleValidationErrors,
  deleteRecording
);

// Risk assessment routes
router.post(
  '/risk-assessment',
  protect,
  validateRiskAssessment,
  handleValidationErrors,
  saveRiskAssessment
);

router.get('/risk-assessment', protect, getRiskAssessment);

// Habits routes
router.post(
  '/habits',
  protect,
  validateHabits,
  handleValidationErrors,
  saveHabits
);

router.get('/habits', protect, getHabits);

// Export all data
router.get('/export', protect, exportData);

module.exports = router;
