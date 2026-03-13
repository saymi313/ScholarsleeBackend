const GoogleMeetService = require('../../shared/services/googleMeetService');
const { sendSuccessResponse, sendErrorResponse } = require('../../shared/utils/helpers/responseHelpers');
const {
  getGoogleOAuthCredentials,
  persistTokens,
  resetCachedCredentials,
} = require('../../shared/utils/helpers/googleMeetCredentialStore');
const Meeting = require('../../shared/models/Meeting');
const Notification = require('../../shared/models/Notification');
const Booking = require('../../shared/models/Booking');
const { emitToUser } = require('../../shared/config/socket');
const mongoose = require('mongoose');

const googleMeetService = new GoogleMeetService();

const ensureGoogleClientInitialized = async (userId) => {
  const credentials = await getGoogleOAuthCredentials(userId);

  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error('Google OAuth client credentials are not configured.');
  }

  const result = googleMeetService.initializeClient(credentials);

  if (!result.success) {
    throw new Error(result.error || 'Failed to initialize Google OAuth client');
  }

  return {
    ...credentials,
    calendarReady: result.calendarReady,
  };
};

const initializeGoogleClient = async (req, res) => {
  try {
    const providedCredentials = req.body?.credentials;
    let credentialsToUse = providedCredentials;

    if (!credentialsToUse || !credentialsToUse.clientId || !credentialsToUse.clientSecret) {
      credentialsToUse = await getGoogleOAuthCredentials(req.user.id);
    }

    if (!credentialsToUse.clientId || !credentialsToUse.clientSecret) {
      return sendErrorResponse(res, 'Google API credentials are required. Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.', 400);
    }

    const result = googleMeetService.initializeClient(credentialsToUse);

    if (result.success) {
      return sendSuccessResponse(res, 'Google API client initialized successfully', {
        calendarReady: result.calendarReady,
      });
    }

    return sendErrorResponse(res, result.error, 500);
  } catch (error) {
    console.error('Error initializing Google client:', error);
    return sendErrorResponse(res, 'Failed to initialize Google client', 500);
  }
};

const createMeeting = async (req, res) => {
  try {
    let credentials;
    try {
      credentials = await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    if (!credentials.calendarReady) {
      return sendErrorResponse(res, 'Google Calendar access is not authorized yet. Complete the OAuth consent flow first.', 428);
    }

    const {
      title,
      description,
      startTime,
      endTime,
      attendees = [],
      timezone = 'UTC',
      mentorId,
      bookingId
    } = req.body;

    if (!title || !startTime || !endTime) {
      return sendErrorResponse(res, 'Title, start time, and end time are required', 400);
    }
    if (!mentorId) {
      return sendErrorResponse(res, 'Mentor ID is required', 400);
    }
    if (!bookingId) {
      return sendErrorResponse(res, 'Booking ID is required', 400);
    }

    // Verify booking exists, belongs to mentee, and is confirmed
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      menteeId: req.user.id, 
      mentorId 
    });
    
    if (!booking) {
      return sendErrorResponse(res, 'Valid booking not found for this mentor', 404);
    }
    
    // Additional check: booking must be confirmed
    if (booking.status !== 'confirmed') {
      return sendErrorResponse(res, `Cannot create meeting. Booking status is "${booking.status}", but must be "confirmed". Please ensure the booking is confirmed before scheduling a meeting.`, 400);
    }
    
    // Check if meeting already exists for this booking
    const existingMeeting = await Meeting.findOne({ bookingId });
    if (existingMeeting) {
      return sendErrorResponse(res, 'A meeting has already been scheduled for this booking', 409);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return sendErrorResponse(res, 'Invalid date format', 400);
    }
    if (start >= end) {
      return sendErrorResponse(res, 'End time must be after start time', 400);
    }

    const meetingDetails = {
      title,
      description,
      startTime,
      endTime,
      attendees,
      timezone
    };

    const result = await googleMeetService.createMeeting(meetingDetails);

    if (result.success) {
      const menteeId = req.user.id;
      const duration = Math.round((end - start) / (1000 * 60));
      const googleEventId = result.eventId;
      const googleCalendarLink = result.calendarEvent?.htmlLink || null;

      const meeting = new Meeting({
        bookingId: booking._id,
        menteeId,
        mentorId,
        title,
        description: description || '',
        meetingLink: result.meetingLink,
        meetingId: result.meetingId,
        googleEventId,
        googleCalendarLink,
        scheduledDate: start,
        duration,
        status: 'scheduled',
        meetingType: 'google-meet',
        participants: [
          { userId: menteeId, role: 'mentee' },
          { userId: mentorId, role: 'mentor' }
        ]
      });

      await meeting.save();
      booking.meetingLink = result.meetingLink;
      booking.meetingId = result.meetingId;
      await booking.save();

      // Notify Mentor
      try {
        const scheduledDate = new Date(start);
        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });

        const notification = await Notification.createNotification({
          userId: mentorId,
          type: 'meeting_scheduled',
          title: 'Meeting Scheduled by Mentee',
          message: `Your mentee has scheduled a meeting: "${title}" on ${formattedDate}.`,
          data: {
            meetingId: meeting._id,
            bookingId: booking._id,
            meetingLink: result.meetingLink,
            scheduledDate: start,
            duration: duration
          },
          priority: 'high',
          actionUrl: '/mentor/meetings',
          actionText: 'View Meeting'
        });

        emitToUser(mentorId.toString(), 'notification:new', {
          notification: notification.toJSON()
        });
        
        // Also send email
        try {
           const emailService = require('../../shared/services/emailService');
           const populatedBooking = await Booking.findById(booking._id).populate('menteeId', 'profile').populate('mentorId', 'profile email');
           if (populatedBooking && populatedBooking.mentorId && populatedBooking.mentorId.email) {
             const menteeName = `${populatedBooking.menteeId.profile.firstName} ${populatedBooking.menteeId.profile.lastName}`;
             const mentorName = `${populatedBooking.mentorId.profile.firstName} ${populatedBooking.mentorId.profile.lastName}`;
             await emailService.sendMeetingScheduledEmail(
               populatedBooking.mentorId.email,
               mentorName,
               menteeName, // sender basically
               meeting.title,
               formattedDate,
               result.meetingLink,
               meeting.duration
             );
           }
        } catch(emErr) {
            console.warn('Could not send email to mentor:', emErr.message);
        }

      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      return sendSuccessResponse(res, 'Google Meet meeting created successfully', {
        meetingLink: result.meetingLink,
        meetingId: result.meetingId,
        eventId: result.eventId,
        calendarEvent: result.calendarEvent,
        meeting: meeting
      });
    } else {
      return sendErrorResponse(res, result.error, 500);
    }
  } catch (error) {
    console.error('Error creating Google Meet meeting:', error);
    return sendErrorResponse(res, 'Failed to create Google Meet meeting', 500);
  }
};

const updateMeeting = async (req, res) => {
  try {
    let credentials;
    try {
      credentials = await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    if (!credentials.calendarReady) {
      return sendErrorResponse(res, 'Google Calendar access is not authorized yet. Complete the OAuth consent flow first.', 428);
    }

    const { eventId } = req.params;
    const { title, description, startTime, endTime, attendees = [] } = req.body;

    if (!eventId) return sendErrorResponse(res, 'Event ID is required', 400);

    const meetingDetails = { title, description, startTime, endTime, attendees };
    const result = await googleMeetService.updateMeeting(eventId, meetingDetails);

    if (result.success) {
      return sendSuccessResponse(res, 'Google Meet meeting updated successfully', {
        meetingLink: result.meetingLink,
        meetingId: result.meetingId,
        eventId: result.eventId
      });
    } else {
      return sendErrorResponse(res, result.error, 500);
    }
  } catch (error) {
    return sendErrorResponse(res, 'Failed to update Google Meet meeting', 500);
  }
};

const deleteMeeting = async (req, res) => {
  try {
    let credentials;
    try {
      credentials = await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    if (!credentials.calendarReady) {
      return sendErrorResponse(res, 'Google Calendar access is not authorized yet. Complete the OAuth consent flow first.', 428);
    }

    const { eventId } = req.params;
    if (!eventId) return sendErrorResponse(res, 'Event ID is required', 400);

    const result = await googleMeetService.deleteMeeting(eventId);

    if (result.success) {
      return sendSuccessResponse(res, 'Google Meet meeting deleted successfully');
    } else {
      return sendErrorResponse(res, result.error, 500);
    }
  } catch (error) {
    return sendErrorResponse(res, 'Failed to delete Google Meet meeting', 500);
  }
};

const getMeeting = async (req, res) => {
  try {
    let credentials;
    try {
      credentials = await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    if (!credentials.calendarReady) {
      return sendErrorResponse(res, 'Google Calendar access is not authorized yet. Complete the OAuth consent flow first.', 428);
    }

    const { eventId } = req.params;
    if (!eventId) return sendErrorResponse(res, 'Event ID is required', 400);

    const result = await googleMeetService.getMeeting(eventId);

    if (result.success) {
      return sendSuccessResponse(res, 'Meeting details retrieved successfully', {
        meeting: result.meeting,
        meetingLink: result.meetingLink
      });
    } else {
      return sendErrorResponse(res, result.error, 500);
    }
  } catch (error) {
    return sendErrorResponse(res, 'Failed to get meeting details', 500);
  }
};

const getAuthUrl = async (req, res) => {
  try {
    try {
      await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    // Override redirect URI for mentee flow
    const menteeRedirectUri = process.env.GOOGLE_MENTEE_REDIRECT_URI || 'http://localhost:3000/mentees/google-meet/callback';
    googleMeetService.oauth2Client.redirectUri = menteeRedirectUri;

    const result = googleMeetService.getAuthUrl();

    if (!result.success) {
      return sendErrorResponse(res, result.error, 500);
    }

    return sendSuccessResponse(res, 'Authorization URL generated successfully', {
      authUrl: result.authUrl
    });
  } catch (error) {
    return sendErrorResponse(res, 'Failed to generate authorization URL', 500);
  }
};

const getTokens = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    
    if (!code) {
      return sendErrorResponse(res, 'Authorization code is required', 400);
    }

    let baseCredentials;
    try {
      baseCredentials = await ensureGoogleClientInitialized(req.user.id);
    } catch (initError) {
      return sendErrorResponse(res, initError.message, 500);
    }

    // Override redirect Uri specifically for mentees in the GoogleMeetService 
    // This allows the mentee oauth flow to work properly 
    if (redirectUri) {
       googleMeetService.oauth2Client.redirectUri = redirectUri;
    }

    const result = await googleMeetService.getTokens(code);

    if (!result.success) {
      return sendErrorResponse(res, result.error, 500);
    }

    const tokens = result.tokens || {};

    await persistTokens(tokens, req.user.id);
    resetCachedCredentials();

    const initResult = googleMeetService.initializeClient({
      ...baseCredentials,
      accessToken: tokens.access_token || tokens.accessToken,
      refreshToken: tokens.refresh_token || tokens.refreshToken,
    });

    return sendSuccessResponse(res, 'Tokens retrieved successfully', {
      tokens,
      calendarReady: initResult.success && initResult.calendarReady,
    });
  } catch (error) {
    return sendErrorResponse(res, 'Failed to get tokens', 500);
  }
};

module.exports = {
  initializeGoogleClient,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeeting,
  getAuthUrl,
  getTokens,
};
