// Google Meet API Service
// Integrates with Google Meet API for real meeting creation

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

class MeetingService {
  constructor() {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.baseURL = `${apiBase.replace(/\/$/, '')}/api/mentors/google-meet`;
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
      throw new Error('Please connect your Google Calendar first by clicking the "Connect Google Calendar" button on the Meetings page.');
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
      const response = await fetch(this.buildUrl('/tokens'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
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

      const apiData = {
        title: meetingDetails.topic,
        description: meetingDetails.description || '',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendees: [], // Add mentee email if available
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        menteeId: meetingDetails.menteeId, // Required: mentee ID
        bookingId: meetingDetails.bookingId || null // Optional: booking ID
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
          meeting: result.data.meeting, // Database meeting record
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

  // Get meetings by date range for calendar
  async getMeetingsByDateRange(startDate, endDate) {
    try {
      const response = await fetch(this.buildUrl(`/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await readResponseBody(response, "We couldn't load your meetings. Please refresh the page.");

      if (result.success) {
        return {
          success: true,
          meetings: result.data.meetings || [],
          meetingsByDate: result.data.meetingsByDate || {}
        };
      } else {
        throw new Error(result.message || "We couldn't load your meetings. Please refresh the page.");
      }
    } catch (error) {
      console.error('Error fetching meetings by date range:', error);
      throw error;
    }
  }

  // Get meetings for a specific date
  async getMeetingsByDate(date) {
    try {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      const response = await fetch(this.buildUrl(`/date/${dateStr}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await readResponseBody(response, "We couldn't load your meetings. Please refresh the page.");

      if (result.success) {
        return {
          success: true,
          meetings: result.data.meetings || []
        };
      } else {
        throw new Error(result.message || "We couldn't load your meetings. Please refresh the page.");
      }
    } catch (error) {
      console.error('Error fetching meetings by date:', error);
      throw error;
    }
  }

  // Delete a meeting
  async deleteMeeting(meetingId) {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/mentors/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await readResponseBody(response, "We couldn't cancel this meeting. Please try again.");

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Meeting deleted successfully'
        };
      } else {
        throw new Error(result.message || "We couldn't cancel this meeting. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  // Simple validation
  validateMeetingDetails(details) {
    const errors = []

    if (!details.menteeId) {
      errors.push('Mentee selection is required')
    }

    if (!details.topic || details.topic.trim() === '') {
      errors.push('Topic is required')
    }

    if (!details.date) {
      errors.push('Date is required')
    }

    if (!details.time) {
      errors.push('Time is required')
    }

    return errors
  }
}

// Export singleton instance
const meetingService = new MeetingService()
export default meetingService
