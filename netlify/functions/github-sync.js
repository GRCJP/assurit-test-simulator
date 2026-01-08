// Netlify Function for GitHub Gist Sync
// This keeps the GitHub token private on the server side

// Helper: Find existing gist by userKey
async function findGistByUserKey(githubToken, userKey) {
  console.log('🔍 Searching for existing gist for userKey:', userKey);
  
  try {
    const response = await fetch('https://api.github.com/gists', {
      headers: {
        'Authorization': `token ${githubToken}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to list gists:', response.status);
      return null;
    }
    
    const gists = await response.json();
    const targetDescription = `CMMC_SYNC:${userKey}`;
    
    const found = gists.find(g => g.description === targetDescription);
    if (found) {
      console.log('✅ Found existing gist:', found.id);
      return found.id;
    }
    
    console.log('No existing gist found for userKey');
    return null;
  } catch (error) {
    console.error('Error searching for gist:', error);
    return null;
  }
}

const handler = async (event) => {
  const { action, data, userKey, fileName = 'cmmc_user_data.json' } = JSON.parse(event.body);
  
  // Get GitHub token from environment (server-side only)
  const githubToken = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  
  console.log('🔑 Checking for GitHub token...');
  
  if (!githubToken) {
    console.log('❌ No GitHub token found in environment');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'GitHub token not configured'
      })
    };
  }
  
  console.log('✅ GitHub token found, processing request for userKey:', userKey);

  // Handle test action
  if (action === 'test') {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Netlify Function working' })
    };
  }

  try {
    if (action === 'read') {
      // Discover gist by userKey
      const gistId = await findGistByUserKey(githubToken, userKey);
      
      if (!gistId) {
        console.log('No gist found for userKey, returning empty data');
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            data: null,
            message: 'No gist found for user'
          })
        };
      }
      
      // Read from discovered gist
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          'Authorization': `token ${githubToken}`
        }
      });

      if (response.ok) {
        const gistData = await response.json();
        const fileData = gistData.files[fileName];
        
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            data: fileData ? JSON.parse(fileData.content) : null,
            gistId: gistId
          })
        };
      } else {
        console.error('Failed to read gist:', response.status);
        return {
          statusCode: 404,
          body: JSON.stringify({ success: false, error: 'Gist not found' })
        };
      }
    }

    // Handle write action with retry logic
    if (action === 'write') {
      const writeGist = async (attemptGistId) => {
        if (!attemptGistId) {
          // Create new gist
          console.log('🆕 Creating new gist for userKey:', userKey);
          
          const createResponse = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              description: `CMMC_SYNC:${userKey}`,
              public: false,
              files: {
                [fileName]: {
                  content: JSON.stringify(data, null, 2)
                }
              }
            })
          });

          if (!createResponse.ok) {
            const error = await createResponse.text();
            throw new Error(`Failed to create gist: ${error}`);
          }
          
          const newGist = await createResponse.json();
          console.log('✅ Created new gist:', newGist.id);
          return newGist.id;
        } else {
          // Update existing gist
          console.log('📝 Updating existing gist:', attemptGistId);
          
          const updateResponse = await fetch(`https://api.github.com/gists/${attemptGistId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              files: {
                [fileName]: {
                  content: JSON.stringify(data, null, 2)
                }
              }
            })
          });

          if (!updateResponse.ok) {
            const error = await updateResponse.text();
            const status = updateResponse.status;
            
            // 409 or 404 means gist is invalid - need to rediscover or create
            if (status === 409 || status === 404) {
              console.warn(`⚠️ Gist ${status} error - will rediscover/recreate`);
              throw new Error(`RETRY:${status}`);
            }
            
            throw new Error(`Failed to update gist: ${error}`);
          }
          
          console.log('✅ Updated existing gist');
          return attemptGistId;
        }
      };
      
      try {
        // First attempt: discover existing gist
        let gistId = await findGistByUserKey(githubToken, userKey);
        let finalGistId;
        
        try {
          finalGistId = await writeGist(gistId);
        } catch (error) {
          // Retry logic for 409/404
          if (error.message.startsWith('RETRY:')) {
            console.log('🔄 Retrying with rediscovery...');
            
            // Rediscover or create new (will be null if not found, triggering creation)
            gistId = await findGistByUserKey(githubToken, userKey);
            finalGistId = await writeGist(gistId);
            
            return {
              statusCode: 200,
              body: JSON.stringify({
                success: true,
                gistId: finalGistId,
                message: 'Data saved to GitHub Gist (retry successful)'
              })
            };
          }
          
          // Not a retry error, rethrow
          throw error;
        }
        
        // First attempt succeeded
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            gistId: finalGistId,
            message: 'Data saved to GitHub Gist'
          })
        };
      } catch (error) {
        console.error('❌ Write operation failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: error.message
          })
        };
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

module.exports = { handler };
