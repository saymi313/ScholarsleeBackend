// Google Meet API Service for Mentees
// Integrates with Google Meet API for real meeting creation from Mentee side

const readResponseBody = async (response, fallbackMessage) => {
  const raw = await response.text();

  if (!response.ok) {
    const message = raw?.trim() || fallbackMessage || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (parseError) {
    // Surface original body to help with debugging unexpected non-JSON responses
    throw new Error(raw || fallbackMessage || 'Unexpected response format from server.');
  }
};

class MenteeMeetingService {
  constructor() {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.baseURL = `${apiBase.replace(/\/$/, '')}/api/mentees/google-meet`;
    this.clientConfigured = false;
    this.calendarReady = false;
  }

  buildUrl(pathname = '') {
    return `${this.baseURL}${pathname}`;
  }

  // Initialize Google API client
  async initializeGoogleClient(credentials) {
    try {
      const response = await fetch(this.buildUrl('/initialize'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: credentials ? JSON.stringify({ credentials }) : JSON.stringify({})
      });

      const result = await readResponseBody(response, "We couldn't connect to Google Meet. Please try again.");

      if (result.success) {
        this.clientConfigured = true;
        this.calendarReady = Boolean(result.data?.calendarReady);
      }

      return result;
    } catch (error) {
      console.error('Error initializing Google client:', error);
      throw error;
    }
  }

  async ensureClientInitialized() {
    if (this.calendarReady) {
      return true;
    }

    const response = await this.initializeGoogleClient();

    if (!response.success) {
      throw new Error(response.message || "We couldn't connect to Google Meet. Please try again.");
    }

    if (!response.data?.calendarReady) {
      throw new Error('Please connect your Google Calendar first by clicking the "Connect Calendar" button on the Meetings page.');
    }

    this.calendarReady = true;
    return true;
  }

  // Get Google OAuth2 authorization URL
  async getAuthUrl() {
    try {
      const response = await fetch(this.buildUrl('/auth-url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return readResponseBody(response, "We couldn't connect to Google. Please try again.");
    } catch (error) {
      console.error('Error getting auth URL:', error);
      throw error;
    }
  }

  async beginOAuthFlow() {
    await this.initializeGoogleClient();

    const response = await this.getAuthUrl();

    if (!response.success) {
      throw new Error(response.message || "We couldn't connect to Google. Please try again.");
    }

    const authUrl = response.data?.authUrl;

    if (!authUrl) {
      throw new Error('Google authorization URL is missing.');
    }

    window.location.href = authUrl;
  }

  async processOAuthCallback(code) {
    if (!code) {
      throw new Error('Authorization code is required.');
    }

    await this.initializeGoogleClient();

    const response = await this.getTokens(code);

    if (!response.success) {
      throw new Error(response.message || "We couldn't complete Google sign-in. Please try again.");
    }

    this.clientConfigured = true;
    this.calendarReady = Boolean(response.data?.calendarReady);

    if (!this.calendarReady) {
      throw new Error('Authorization tokens retrieved, but calendar access is still unavailable.');
    }

    return response;
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    try {
      // Need to tell backend we are using a different redirect URI for mentee oauth flow
      const currentOrigin = window.location.origin;
      const redirectUri = `${currentOrigin}/mentees/google-meet/callback`;

      const response = await fetch(this.buildUrl('/tokens'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code, redirectUri })
      });

      return readResponseBody(response, "We couldn't complete Google sign-in. Please try again.");
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }

  // Generate real Google Meet meeting link
  async generateMeetingLink(meetingDetails) {
    try {
      console.log('Creating Google Meet meeting...', meetingDetails);

      await this.ensureClientInitialized();

      // Convert meeting details to API format
      const startTime = new Date(`${meetingDetails.date}T${meetingDetails.time}`);
      const endTime = new Date(startTime.getTime() + (parseInt(meetingDetails.duration) * 60000));

      // Validate times
      const now = new Date();
      if (startTime <= now) {
        throw new Error('Scheduled date must be in the future');
      }

      const apiData = {
        title: meetingDetails.topic,
        description: meetingDetails.description || '',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendees: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        mentorId: meetingDetails.mentorId,
        bookingId: meetingDetails.bookingId || null
      };

      const response = await fetch(this.buildUrl('/meetings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      });

      const result = await readResponseBody(response, "We couldn't create the meeting. Please try again.");

      if (result.success) {
        return {
          success: true,
          meetingLink: result.data.meetingLink,
          meetingId: result.data.meetingId,
          eventId: result.data.eventId,
          calendarCreated: true,
          meeting: result.data.meeting,
          message: 'Google Meet meeting created successfully'
        };
      } else {
        throw new Error(result.message || "We couldn't create the meeting. Please try again.");
      }

    } catch (error) {
      console.error('Error creating Google Meet meeting:', error);
      throw error;
    }
  }
}

const menteeMeetingService = new MenteeMeetingService();
export default menteeMeetingService;
