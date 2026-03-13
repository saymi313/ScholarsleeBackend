const fs = require('fs');
const path = require('path');
const User = require('../../../shared/models/User');

// Path to Google credentials file (if it exists)
const CREDENTIAL_FILENAME = path.join(__dirname, '../../../../google-credentials.json');

// Base Google Client ID and Secret come from env
const getBaseConfig = () => {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || null,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
  };
};

let cachedCredentials = null;

const readCredentialFile = () => {
  console.log('Reading credential file from:', CREDENTIAL_FILENAME);
  // If no file path is set, skip file reading
  if (!CREDENTIAL_FILENAME || !fs.existsSync(CREDENTIAL_FILENAME)) {
    console.log('Credential file not found or path not set.');
    return null;
  }

  try {
    const raw = fs.readFileSync(CREDENTIAL_FILENAME, 'utf-8');
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    console.log('Successfully read credential file.');
    return parsed;
  } catch (error) {
    console.error('Failed to read Google Meet credential file:', error);
    return null;
  }
};

const extractClientConfig = (source, userTokens = null) => {
  const candidate = source ? (source.web || source.installed || source) : {};

  // Get redirect URIs from file or env
  const redirectUris = candidate.redirect_uris || candidate.redirectUris || [];
  const javascriptOrigins = candidate.javascript_origins || candidate.javascriptOrigins || [];

  // Parse javascript origins from env if available
  const envJavascriptOrigins = process.env.GOOGLE_JAVASCRIPT_ORIGINS
    ? process.env.GOOGLE_JAVASCRIPT_ORIGINS.split(',').map(origin => origin.trim())
    : [];

  const allJavascriptOrigins = [...envJavascriptOrigins, ...javascriptOrigins];
  
  // Use env or fallback for Redirect URI
  // Note: we can't fully infer mentee vs mentor here easily without context,
  // but OAuth2Client just needs a valid registered one when getting tokens.
  const fallbackRedirect = process.env.GOOGLE_FALLBACK_REDIRECT_URI || 'http://localhost:3000/mentor/google-meet/callback';
  const finalRedirectUri = process.env.GOOGLE_REDIRECT_URI || redirectUris[0] || fallbackRedirect;

  // Use user-specific tokens if provided, fallback to env/file 
  const accessToken = userTokens?.accessToken || process.env.GOOGLE_ACCESS_TOKEN || candidate.access_token || candidate.accessToken || null;
  const refreshToken = userTokens?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN || candidate.refresh_token || candidate.refreshToken || null;
  const scope = userTokens?.scope || process.env.GOOGLE_SCOPE || candidate.scope || 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
  const tokenType = userTokens?.tokenType || process.env.GOOGLE_TOKEN_TYPE || candidate.token_type || 'Bearer';
  const expiryDate = userTokens?.expiryDate || (process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY) : (candidate.expiry_date || null));

  return {
    clientId: process.env.GOOGLE_CLIENT_ID || candidate.client_id || null,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || candidate.client_secret || null,
    redirectUri: finalRedirectUri,
    accessToken,
    refreshToken,
    scope,
    tokenType,
    expiryDate,
    projectId: process.env.GOOGLE_PROJECT_ID || candidate.project_id || null,
  };
};

const getGoogleOAuthCredentials = async (userId = null) => {
  // Always reload from env to ensure freshness during debugging
  const fileCredentials = readCredentialFile();
  
  let userTokens = null;
  if (userId) {
    try {
      const user = await User.findById(userId).select('+googleMeetTokens.accessToken +googleMeetTokens.refreshToken +googleMeetTokens.expiryDate +googleMeetTokens.scope +googleMeetTokens.tokenType');
      if (user && user.googleMeetTokens) {
        userTokens = user.googleMeetTokens;
      }
    } catch (err) {
      console.error('Failed to get user google tokens:', err);
    }
  }

  const credentials = extractClientConfig(fileCredentials, userTokens);

  console.log('🔒 Google OAuth Config Loaded for user:', userId || 'GLOBAL');
  console.log('   - Client ID:', credentials.clientId ? credentials.clientId.substring(0, 15) + '...' : 'MISSING');
  console.log('   - Has Access Token:', !!credentials.accessToken);

  cachedCredentials = credentials;
  return credentials;
};

const persistTokens = async (tokens = {}, userId = null) => {
  try {
    if (userId) {
      console.log('Attempting to persist tokens to Database for user:', userId);
      await User.findByIdAndUpdate(userId, {
        googleMeetTokens: {
          accessToken: tokens.access_token || tokens.accessToken,
          refreshToken: tokens.refresh_token || tokens.refreshToken,
          scope: tokens.scope,
          tokenType: tokens.token_type || tokens.tokenType,
          expiryDate: tokens.expiry_date || tokens.expiryDate
        }
      });
      console.log('Successfully saved tokens to User model.');
      resetCachedCredentials();
      return true;
    }

    console.warn('⚠️ No userId provided to persistTokens. Writing globally is disabled.');
    return false;
  } catch (error) {
    console.error('Failed to persist Google Meet tokens:', error);
    return false;
  }
};

const resetCachedCredentials = () => {
  cachedCredentials = null;
};

module.exports = {
  getGoogleOAuthCredentials,
  persistTokens,
  resetCachedCredentials,
};

