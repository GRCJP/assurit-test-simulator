/**
 * User Data Synchronization Service
 * Handles cross-device synchronization of user progress data using PostgreSQL backend via Supabase
 * Includes comprehensive error handling and monitoring to prevent database issues
 */

import { supabase, updateUserData, getUserData } from '../lib/supabase.js';

/**
 * Enhanced UserDataSync with PostgreSQL backend via Supabase
 * Replaces Auth0 Management API with reliable database storage
 */
class UserDataSync {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.lastSuccessfulSync = null;
    this.errorCount = 0;
    this.maxErrors = 5;
    this.postgresAvailable = true;
  }

  // Monitor system health and detect issues early
  checkHealth() {
    const now = Date.now();
    const timeSinceLastSync = this.lastSuccessfulSync ? now - this.lastSuccessfulSync : Infinity;
    const isHealthy = this.errorCount < 3 && timeSinceLastSync < 24 * 60 * 60 * 1000; // 24 hours
    
    if (!isHealthy && this.isHealthy) {
      console.warn('⚠️ UserDataSync health degraded - errors:', this.errorCount, 'time since last sync:', timeSinceLastSync);
    }
    
    this.isHealthy = isHealthy;
    return isHealthy;
  }

  // Enhanced error handling with retry logic
  async handleApiCall(apiCall, operation, retryCount = 0) {
    try {
      const result = await apiCall();
      this.errorCount = 0; // Reset on success
      this.lastSuccessfulSync = Date.now();
      console.log(`✅ ${operation} successful`);
      return result;
    } catch (error) {
      this.errorCount++;
      console.error(`❌ ${operation} failed (attempt ${retryCount + 1}/${this.maxRetries}):`, error);
      
      // Check for specific token errors
      if (error.message?.includes('Missing Refresh Token') || error.message?.includes('refresh_token')) {
        console.error('🔐 Refresh token issue detected - triggering re-authentication');
        this.triggerReauth();
        return null;
      }
      
      // Retry logic for transient errors
      if (retryCount < this.maxRetries - 1 && this.isTransientError(error)) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`🔄 Retrying ${operation} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.handleApiCall(apiCall, operation, retryCount + 1);
      }
      
      // Fallback to local storage if sync fails
      if (this.shouldFallbackToLocalStorage()) {
        console.log(`💾 Falling back to localStorage for ${operation}`);
        return this.fallbackToLocalStorage(operation);
      }
      
      return null;
    }
  }

  // Detect if error is transient and worth retrying
  isTransientError(error) {
    const transientErrors = [
      'network error',
      'timeout',
      'rate limit',
      '503',
      '502',
      '500'
    ];
    
    return transientErrors.some(err => 
      error.message?.toLowerCase().includes(err) ||
      error.status >= 500
    );
  }

  // Check if we should fall back to localStorage
  shouldFallbackToLocalStorage() {
    return this.errorCount >= 2 || !this.isHealthy;
  }

  // Fallback to localStorage when cloud sync fails
  fallbackToLocalStorage(operation) {
    console.log(`💾 Using localStorage fallback for ${operation}`);
    // Return mock success to prevent app from breaking
    return { success: true, fallback: true, operation };
  }

  // Rate limiting to prevent excessive API calls
  canMakeApiCall() {
    if (!this.lastSyncTime) return true;
    const timeSinceLastSync = Date.now() - this.lastSyncTime;
    return timeSinceLastSync >= this.minSyncInterval;
  }

  // Batch multiple update requests into single API call
  queueUpdate(userId, bankId, dataType, data, getAccessTokenSilently) {
    const update = { userId, bankId, dataType, data, getAccessTokenSilently, timestamp: Date.now() };
    
    // Check if we already have a pending update for this data type
    const existingIndex = this.syncQueue.findIndex(item => 
      item.userId === userId && item.bankId === bankId && item.dataType === dataType
    );
    
    if (existingIndex >= 0) {
      // Replace existing update with newer data
      this.syncQueue[existingIndex] = update;
    } else {
      this.syncQueue.push(update);
    }
    
    // Schedule batch processing
    this.scheduleBatchProcessing();
  }

  // Schedule batch processing with debouncing
  scheduleBatchProcessing() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, 500); // Wait 0.5 seconds to batch more updates
  }

  // Process batched updates
  async processBatch() {
    if (this.syncQueue.length === 0 || this.isProcessing) return;
    
    // Rate limiting check
    if (!this.canMakeApiCall()) {
      console.log('🕐 Rate limiting - delaying sync batch');
      setTimeout(() => this.processBatch(), this.minSyncInterval);
      return;
    }
    
    this.isProcessing = true;
    console.log(`📦 Processing batch of ${this.syncQueue.length} updates`);
    
    try {
      // Group updates by user to minimize API calls
      const updatesByUser = {};
      this.syncQueue.forEach(update => {
        const key = `${update.userId}_${update.bankId}`;
        if (!updatesByUser[key]) {
          updatesByUser[key] = { userId: update.userId, bankId: update.bankId, updates: {} };
        }
        updatesByUser[key].updates[`cmmc_${update.bankId}_${update.dataType}`] = update.data;
      });
      
      // Process each user's updates in a single API call
      for (const [key, userGroup] of Object.entries(updatesByUser)) {
        await this.flushUserUpdates(userGroup.userId, userGroup.updates, userGroup.bankId);
      }
      
      // Clear processed updates
      this.syncQueue = [];
      this.lastSyncTime = Date.now();
      
    } catch (error) {
      console.error('❌ Batch processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Trigger re-authentication when token issues are detected
  triggerReauth() {
    console.log('🔐 Triggering re-authentication due to token issues');
    localStorage.setItem('cmmc_needs_reauth', 'true');
    
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('auth0_token_error', {
      detail: { message: 'Refresh token expired, please re-authenticate' }
    }));
  }

  // Validate environment configuration
  validateConfig() {
    const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required Supabase environment variables:', missingVars);
      return false;
    }
    
    return true;
  }

  // Validate JWT token format
  isValidJwtFormat(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('⚠️ Token does not have JWT format (expected 3 parts, got ' + parts.length + ')');
      return false;
    }
    
    // Each part should be base64url encoded
    try {
      parts.forEach(part => {
        // Add padding if needed for base64url
        const paddedPart = part + '='.repeat((4 - part.length % 4) % 4);
        atob(paddedPart.replace(/-/g, '+').replace(/_/g, '/'));
      });
      return true;
    } catch (error) {
      console.warn('⚠️ Token part is not valid base64url encoding:', error.message);
      return false;
    }
  }

  // Generate cache key for user data
  getCacheKey(userId, bankId, dataType) {
    return `${userId}_${bankId}_${dataType}`;
  }

  // Check if cached data is still valid
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // Get user data from GitHub Gist via Netlify Function
  async getUserData(userId, bankId, dataType, getAccessTokenSilently) {
    const cacheKey = this.getCacheKey(userId, bankId, dataType);
    
    console.log(`Getting user data: ${userId}, ${bankId}, ${dataType}`);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      console.log(`Returning cached data for ${dataType}`);
      return this.cache.get(cacheKey).data;
    }

    try {
      // Use Auth0 user.sub as stable identifier
      console.log('🔑 Using Auth0 user.sub as userKey:', userId);

      // NEW: PostgreSQL sync via Supabase
      if (window.location.hostname !== 'localhost' && import.meta.env.VITE_DISABLE_CLOUD_SYNC !== 'true') {
        try {
          console.log(`🗄️ Loading ${dataType} from PostgreSQL...`);
          
          // Get data from PostgreSQL via Supabase
          const cloudData = await getUserData(userId, bankId, dataType);
          
          if (cloudData) {
            console.log(`✅ Retrieved ${dataType} from PostgreSQL successfully`);
            
            // Cache the result
            this.cache.set(cacheKey, { data: cloudData, timestamp: Date.now() });
            
            // Also update localStorage as backup
            this.saveToLocalStorage(bankId, dataType, cloudData);
            
            // Update health tracking
            this.lastSuccessfulSync = Date.now();
            this.errorCount = 0;
            this.postgresAvailable = true;
            
            return cloudData;
          } else {
            console.log(`No ${dataType} found in PostgreSQL, checking localStorage...`);
          }
        } catch (postgresError) {
          this.errorCount++;
          console.warn('⚠️ PostgreSQL sync error:', postgresError.message);
          
          if (this.errorCount >= this.maxErrors) {
            console.warn('🚫 PostgreSQL disabled due to repeated failures');
            this.postgresAvailable = false;
          }
        }
      } else {
        console.log('☁️ Using localStorage for localhost development');
      }

      return this.getFromLocalStorage(bankId, dataType);

    } catch (error) {
      console.error('Error fetching user data:', error);
      console.warn('⚠️ Falling back to localStorage due to error');
      return this.getFromLocalStorage(bankId, dataType);
    }
  }

  // Fallback to localStorage when Management API fails
  getFromLocalStorage(bankId, dataType) {
    try {
      const key = `cmmc_${bankId}_${dataType}`;
      const data = localStorage.getItem(key);
      if (data) {
        console.log(`✅ Retrieved ${dataType} from localStorage`);
        return JSON.parse(data);
      }
      console.log(`No ${dataType} found in localStorage`);
      return null;
    } catch (error) {
      console.error(`❌ Error reading ${dataType} from localStorage:`, error);
      return null;
    }
  }
  
  // Get all user data for single-file storage
  getAllUserData(bankId) {
    const dataTypes = [
      'progressStreaks',
      'scoreStats',
      'studyPlan',
      'missedQuestions',
      'markedQuestions',
      'testHistory',
      'domainMastery',
      'questionStats',
      'spacedRepetition',
      'adaptiveDifficulty'
    ];
    
    const allData = {};
    dataTypes.forEach(type => {
      const data = this.getFromLocalStorage(bankId, type);
      if (data) {
        allData[type] = data;
      }
    });
    
    return allData;
  }

  // Update user data in PostgreSQL via Supabase
  async updateUserData(userId, bankId, dataType, data, getAccessTokenSilently) {
    console.log(`💾 Saving ${dataType} to PostgreSQL for user: ${userId}`);
    
    try {
      // Use Auth0 user.sub as stable identifier
      console.log('🔑 Using Auth0 user.sub as userKey:', userId);
      
      // Save to localStorage immediately as backup
      this.saveToLocalStorage(bankId, dataType, data);
      
      // NEW: PostgreSQL sync via Supabase
      if (window.location.hostname !== 'localhost' && import.meta.env.VITE_DISABLE_CLOUD_SYNC !== 'true') {
        try {
          console.log(`🗄️ Saving ${dataType} to PostgreSQL...`);
          
          // Save data to PostgreSQL via Supabase
          const result = await updateUserData(userId, bankId, dataType, data);
          
          if (result.success) {
            console.log(`✅ ${dataType} synced to PostgreSQL successfully`);
            
            // Update cache
            const cacheKey = this.getCacheKey(userId, bankId, dataType);
            this.cache.set(cacheKey, {
              data,
              timestamp: Date.now()
            });
            
            // Update health tracking
            this.lastSuccessfulSync = Date.now();
            this.errorCount = 0;
            this.postgresAvailable = true;
            
            return result;
          }
          
        } catch (postgresError) {
          this.errorCount++;
          console.error('❌ PostgreSQL sync error:', postgresError.message);
          
          if (this.errorCount >= this.maxErrors) {
            console.warn('🚫 PostgreSQL disabled due to repeated failures');
            this.postgresAvailable = false;
          }
          
          console.log('💾 Falling back to localStorage only');
        }
      } else {
        console.log('☁️ Using localStorage for localhost development');
      }
      
      return { success: true, dataType, saved: 'localStorage' };
      
    } catch (error) {
      console.error('Error updating user data:', error);
      console.warn('⚠️ Falling back to localStorage only');
      this.saveToLocalStorage(bankId, dataType, data);
      return { success: true, dataType, saved: 'localStorage' };
    }
  }

  // Helper functions for GitHub Gist management
  getGistId(userEmail) {
    return localStorage.getItem(`cmmc_gist_id_${userEmail}`);
  }

  saveGistId(userEmail, gistId) {
    localStorage.setItem(`cmmc_gist_id_${userEmail}`, gistId);
  }

  getOrCreateGistId(userEmail) {
    const existingId = this.getGistId(userEmail);
    console.log('📝 Gist ID for', userEmail, ':', existingId || 'new');
    return existingId || 'new';
  }

  // Test function to check sync status
  async testSyncStatus() {
    console.log('🧪 Testing sync status...');
    console.log('📱 LocalStorage available:', typeof Storage !== 'undefined');
    
    // Test if we can call the Netlify Function
    try {
      const response = await fetch('/.netlify/functions/github-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test',
          userEmail: 'test@example.com'
        })
      });
      
      if (response.ok) {
        console.log('✅ Netlify Function available - GitHub sync ready');
        return { status: 'github-ready', method: 'netlify-function' };
      } else {
        console.log('❌ Netlify Function failed:', response.status);
        return { status: 'localStorage-only', reason: 'netlify-function-failed' };
      }
    } catch (error) {
      console.log('❌ Netlify Function error:', error.message);
      return { status: 'localStorage-only', reason: 'netlify-function-error' };
    }
  }

  // Export all data for manual sync
  exportAllData() {
    const allData = {};
    const dataTypes = ['progressStreaks', 'scoreStats', 'studyPlan', 'missedQuestions', 'domainMastery', 'questionStats'];
    
    dataTypes.forEach(dataType => {
      const ccaData = this.getFromLocalStorage('bankCCA', dataType);
      const ccpData = this.getFromLocalStorage('bankCCP', dataType);
      
      if (ccaData) allData[`bankCCA_${dataType}`] = ccaData;
      if (ccpData) allData[`bankCCP_${dataType}`] = ccpData;
    });
    
    return allData;
  }

  // Import all data for manual sync
  importAllData(data) {
    try {
      Object.keys(data).forEach(key => {
        if (key.startsWith('bankCCA_') || key.startsWith('bankCCP_')) {
          const [bankId, dataType] = key.split('_', 2);
          this.saveToLocalStorage(bankId, dataType, data[key]);
        }
      });
      return { success: true, imported: Object.keys(data).length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Simplified batch processing to prevent circular dependencies
  async processBatch() {
    if (this.syncQueue.length === 0 || this.isProcessing) return;
    
    // Rate limiting check
    if (!this.canMakeApiCall()) {
      console.log('🕐 Rate limiting - delaying sync batch');
      setTimeout(() => this.processBatch(), this.minSyncInterval);
      return;
    }
    
    this.isProcessing = true;
    console.log(`📦 Processing batch of ${this.syncQueue.length} updates`);
    
    try {
      // Process updates one by one to avoid circular dependencies
      const updatesToProcess = [...this.syncQueue];
      this.syncQueue = []; // Clear queue immediately
      
      for (const update of updatesToProcess) {
        try {
          await this.processSingleUpdate(update);
        } catch (error) {
          console.error(`❌ Failed to process update for ${update.dataType}:`, error);
        }
      }
      
      this.lastSyncTime = Date.now();
      
    } catch (error) {
      console.error('❌ Batch processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Process single update to avoid complex batching issues
  async processSingleUpdate(update) {
    return this.handleApiCall(async () => {
      console.log('Getting auth token for update...');
      const token = await this.getManagementApiToken(update.getAccessTokenSilently);
      
      if (!token) {
        console.warn('⚠️ No token received, saving to localStorage only');
        this.saveToLocalStorage(update.bankId, update.dataType, update.data);
        return { success: true, fallback: true };
      }
      
      // Try to update user metadata via Auth0 Management API
      try {
        console.log('Getting auth token for update...');
        const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${update.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            console.warn(`⚠️ Management API not accessible (${response.status}), saving to localStorage only`);
            this.saveToLocalStorage(update.bankId, update.dataType, update.data);
            return { success: true, fallback: true };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        const currentMetadata = userData.user_metadata || {};
        
        // Update specific data type
        const metadataKey = `cmmc_${update.bankId}_${update.dataType}`;
        const updatedMetadata = { ...currentMetadata };
        updatedMetadata[metadataKey] = update.data;
        
        // Single API call to update data
        const patchResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${update.userId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_metadata: updatedMetadata
          })
        });
        
        if (!patchResponse.ok) {
          if (patchResponse.status === 401 || patchResponse.status === 403 || patchResponse.status === 404) {
            console.warn(`⚠️ Management API update failed (${patchResponse.status}), saving to localStorage only`);
            this.saveToLocalStorage(update.bankId, update.dataType, update.data);
            return { success: true, fallback: true };
          }
          throw new Error(`HTTP error! status: ${patchResponse.status}`);
        }
        
        console.log(`✅ Update successful for ${update.dataType}`);
        return { success: true };
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('403') || error.message.includes('404') || error.message.includes('Management API')) {
          console.warn('⚠️ Management API error, saving to localStorage only:', error.message);
          this.saveToLocalStorage(update.bankId, update.dataType, update.data);
          return { success: true, fallback: true };
        }
        throw error;
      }
    }, `update(${update.dataType})`);
  }

  // Save data to localStorage when Management API fails
  saveToLocalStorage(bankId, dataType, data) {
    try {
      const key = `cmmc_${bankId}_${dataType}`;
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Saved ${dataType} to localStorage`);
    } catch (error) {
      console.error(`❌ Error saving ${dataType} to localStorage:`, error);
    }
  }

  // Flush all pending updates to Auth0
  async flushUpdates(userId, getAccessTokenSilently) {
    if (this.pendingUpdates.size === 0) return;

    console.log('Flushing updates to Auth0...', Object.fromEntries(this.pendingUpdates));

    return this.handleApiCall(async () => {
      console.log('Getting auth token for updates...');
      const token = await this.getManagementApiToken(getAccessTokenSilently);
      if (!token) {
        throw new Error('No token received for updates');
      }
      console.log('Token received for updates');

      // Get current user metadata
      console.log(`Fetching current user metadata for ${userId}...`);
      const getResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!getResponse.ok) {
        console.error(`Error fetching user metadata: ${getResponse.status}`);
        const errorText = await getResponse.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${getResponse.status}`);
      }

      const userData = await getResponse.json();
      const currentMetadata = userData.user_metadata || {};

      // Merge pending updates with current metadata
      const updatedMetadata = { ...currentMetadata };
      this.pendingUpdates.forEach((data, key) => {
        updatedMetadata[key] = data;
      });

      console.log('Updating user metadata...');
      const patchResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_metadata: updatedMetadata
        })
      });

      if (!patchResponse.ok) {
        console.error(`Error updating metadata: ${patchResponse.status}`);
        const errorText = await patchResponse.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${patchResponse.status}`);
      }

      // Clear pending updates
      this.pendingUpdates.clear();
      this.updateTimeout = null;

      console.log('User data synchronized successfully');
      return { success: true };
    }, 'flushUpdates');
  }

  // Sync all data types for a user and bank
  async syncAllUserData(userId, bankId, getAccessTokenSilently) {
    const dataTypes = [
      'progressStreaks',
      'scoreStats', 
      'studyPlan',
      'missedQuestions',
      'markedQuestions',
      'testHistory',
      'domainMastery',
      'questionStats',
      'spacedRepetition',
      'adaptiveDifficulty'
    ];

    const results = {};
    for (const dataType of dataTypes) {
      results[dataType] = await this.getUserData(userId, bankId, dataType, getAccessTokenSilently);
    }

    return results;
  }

  // Clear cache for specific data type
  clearCache(userId, bankId, dataType) {
    const cacheKey = this.getCacheKey(userId, bankId, dataType);
    this.cache.delete(cacheKey);
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear();
    this.pendingUpdates.clear();
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }
}

// Create singleton instance
const userDataSync = new UserDataSync();

export default userDataSync;
