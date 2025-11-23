const HealthData = require('../models/HealthData');

/**
 * @desc    Add a cough recording
 * @route   POST /api/health/recording
 * @access  Private
 */
const addRecording = async (req, res) => {
  try {
    const recordingData = req.body;

    // Validate required fields
    if (!recordingData.duration) {
      return res.status(400).json({
        success: false,
        error: 'Recording duration is required'
      });
    }

    // Find or create health data for user
    let healthData = await HealthData.findOrCreate(req.user._id);

    // Add recording with timestamp
    const recording = {
      ...recordingData,
      timestamp: recordingData.timestamp || Date.now()
    };

    await healthData.addRecording(recording);

    res.status(201).json({
      success: true,
      message: 'Recording added successfully',
      recording
    });
  } catch (error) {
    console.error('Add recording error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding recording'
    });
  }
};

/**
 * @desc    Get all recordings for user
 * @route   GET /api/health/recordings
 * @access  Private
 */
const getRecordings = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData) {
      return res.status(200).json({
        success: true,
        recordings: []
      });
    }

    res.status(200).json({
      success: true,
      recordings: healthData.coughHistory,
      count: healthData.coughHistory.length
    });
  } catch (error) {
    console.error('Get recordings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching recordings'
    });
  }
};

/**
 * @desc    Delete a specific recording
 * @route   DELETE /api/health/recording/:id
 * @access  Private
 */
const deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;

    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData) {
      return res.status(404).json({
        success: false,
        error: 'No health data found'
      });
    }

    // Check if recording exists
    const recordingExists = healthData.coughHistory.some(
      rec => rec._id.toString() === id
    );

    if (!recordingExists) {
      return res.status(404).json({
        success: false,
        error: 'Recording not found'
      });
    }

    await healthData.removeRecording(id);

    res.status(200).json({
      success: true,
      message: 'Recording deleted successfully'
    });
  } catch (error) {
    console.error('Delete recording error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting recording'
    });
  }
};

/**
 * @desc    Save risk assessment data
 * @route   POST /api/health/risk-assessment
 * @access  Private
 */
const saveRiskAssessment = async (req, res) => {
  try {
    const { questions, answers, riskLevel, percentage, score } = req.body;

    // Validate required fields
    if (!riskLevel || percentage === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Risk level and percentage are required'
      });
    }

    // Find or create health data for user
    let healthData = await HealthData.findOrCreate(req.user._id);

    const riskData = {
      questions,
      answers,
      riskLevel,
      percentage,
      score,
      timestamp: Date.now()
    };

    await healthData.updateRiskData(riskData);

    res.status(200).json({
      success: true,
      message: 'Risk assessment saved successfully',
      riskData
    });
  } catch (error) {
    console.error('Save risk assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error saving risk assessment'
    });
  }
};

/**
 * @desc    Get risk assessment data
 * @route   GET /api/health/risk-assessment
 * @access  Private
 */
const getRiskAssessment = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData || !healthData.riskTestData) {
      return res.status(200).json({
        success: true,
        riskAssessment: null
      });
    }

    res.status(200).json({
      success: true,
      riskAssessment: healthData.riskTestData
    });
  } catch (error) {
    console.error('Get risk assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching risk assessment'
    });
  }
};

/**
 * @desc    Save habits data
 * @route   POST /api/health/habits
 * @access  Private
 */
const saveHabits = async (req, res) => {
  try {
    const { sleep, exercise, water, stress, smoking } = req.body;

    // Find or create health data for user
    let healthData = await HealthData.findOrCreate(req.user._id);

    const habitsData = {
      sleep,
      exercise,
      water,
      stress,
      smoking,
      timestamp: Date.now()
    };

    await healthData.updateHabitsData(habitsData);

    res.status(200).json({
      success: true,
      message: 'Habits saved successfully',
      habits: habitsData
    });
  } catch (error) {
    console.error('Save habits error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error saving habits'
    });
  }
};

/**
 * @desc    Get habits data
 * @route   GET /api/health/habits
 * @access  Private
 */
const getHabits = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData || !healthData.habitsData) {
      return res.status(200).json({
        success: true,
        habits: null
      });
    }

    res.status(200).json({
      success: true,
      habits: healthData.habitsData
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching habits'
    });
  }
};

/**
 * @desc    Export all user health data
 * @route   GET /api/health/export
 * @access  Private
 */
const exportData = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData) {
      return res.status(200).json({
        success: true,
        data: {
          recordings: [],
          riskAssessment: null,
          habits: null,
          exportDate: new Date().toISOString()
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        recordings: healthData.coughHistory,
        riskAssessment: healthData.riskTestData,
        habits: healthData.habitsData,
        exportDate: new Date().toISOString(),
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error exporting data'
    });
  }
};

/**
 * @desc    Get health data dashboard/summary
 * @route   GET /api/health/dashboard
 * @access  Private
 */
const getDashboard = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData) {
      return res.status(200).json({
        success: true,
        dashboard: {
          totalRecordings: 0,
          recentRecordings: [],
          riskAssessment: null,
          habits: null
        }
      });
    }

    // Get recent recordings (last 10)
    const recentRecordings = healthData.coughHistory.slice(0, 10);

    // Calculate statistics
    const totalRecordings = healthData.coughHistory.length;
    const recordingsThisWeek = healthData.coughHistory.filter(
      rec => Date.now() - rec.timestamp < 7 * 24 * 60 * 60 * 1000
    ).length;

    res.status(200).json({
      success: true,
      dashboard: {
        totalRecordings,
        recordingsThisWeek,
        recentRecordings,
        riskAssessment: healthData.riskTestData,
        habits: healthData.habitsData,
        lastUpdated: healthData.updatedAt
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching dashboard'
    });
  }
};

module.exports = {
  addRecording,
  getRecordings,
  deleteRecording,
  saveRiskAssessment,
  getRiskAssessment,
  saveHabits,
  getHabits,
  exportData,
  getDashboard
};
