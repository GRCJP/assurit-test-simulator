// Alternative sync test using Auth0 user metadata directly
async function testDirectSync() {
  console.log('🔧 Testing Direct Auth0 Sync');
  
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
    // Try to get token with default audience (not Management API)
    const token = await getAccessTokenSilently();
    console.log('✅ Default token retrieved');
    
    // Try to use the userinfo endpoint to check if we can access user data
    const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log('✅ Userinfo accessible');
      console.log('Available claims:', Object.keys(userInfo));
      
      // Check if there's any app_metadata or user_metadata
      if (userInfo[`${import.meta.env.VITE_AUTH0_DOMAIN}/app_metadata`]) {
        console.log('✅ App metadata found:', userInfo[`${import.meta.env.VITE_AUTH0_DOMAIN}/app_metadata`]);
      }
      
      if (userInfo[`${import.meta.env.VITE_AUTH0_DOMAIN}/user_metadata`]) {
        console.log('✅ User metadata found:', userInfo[`${import.meta.env.VITE_AUTH0_DOMAIN}/user_metadata`]);
      }
    } else {
      console.error('❌ Userinfo request failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Direct sync test failed:', error);
  }
}

testDirectSync();
