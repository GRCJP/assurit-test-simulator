// Quick sync test - run in browser console
async function quickSyncTest() {
  console.log('🧪 Quick Sync Test');
  
  // Check if we're authenticated
  const auth0Hook = window.auth0Hook;
  if (!auth0Hook) {
    console.error('❌ Auth0 not available');
    return;
  }
  
  const { isAuthenticated, user, getAccessTokenSilently } = auth0Hook;
  
  if (!isAuthenticated) {
    console.error('❌ Not authenticated');
    return;
  }
  
  console.log('✅ Authenticated as:', user?.sub);
  
  try {
    // Try to get a token with Management API scope
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'read:current_user update:current_user_metadata'
      }
    });
    
    console.log('✅ Token retrieved');
    console.log('Token length:', token.length);
    
    // Try to read user metadata
    const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Metadata response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ User metadata retrieved');
      console.log('Metadata keys:', Object.keys(userData.user_metadata || {}));
      console.log('CMMC data found:', userData.user_metadata?.cmmc_bankCCP_studyPlan ? 'YES' : 'NO');
    } else {
      const errorText = await response.text();
      console.error('❌ Metadata request failed:', response.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
quickSyncTest();
