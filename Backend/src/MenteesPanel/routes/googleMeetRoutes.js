const express = require('express');
const router = express.Router();
const { authenticate } = require('../../shared/middlewares/auth');

// No specific menteeAuth is defined in this example, checking if it is available
// const { checkMenteeLoginStatus } = require('../middlewares/menteeAuth');

const {
  initializeGoogleClient,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeeting,
  getAuthUrl,
  getTokens,
} = require('../controllers/googleMeetController');

router.use(authenticate);

// Google Meet routes
router.post('/initialize', initializeGoogleClient);
router.post('/auth-url', getAuthUrl);
router.post('/tokens', getTokens);
router.post('/meetings', createMeeting);
router.get('/meetings/:eventId', getMeeting);
router.put('/meetings/:eventId', updateMeeting);
router.delete('/meetings/:eventId', deleteMeeting);

module.exports = router;
