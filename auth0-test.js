// Quick Auth0 Configuration Test
// Run this in browser console after configuring Auth0

async function testAuth0Config() {
  console.log('🧪 Testing Auth0 Configuration...');
  
  // Check if auth0 is available
  if (!window.auth0Hook) {
    console.error('❌ Auth0 hook not found. Make sure you\'re logged in.');
    return;
  }
  
  const { getAccessTokenSilently, user } = window.auth0Hook;
  
  try {
    console.log('🔑 Testing Management API token...');
    
    // Test Management API token
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-351wds1ubpw3eyut.us.auth0.com/api/v2/',
        scope: 'read:current_user_metadata update:current_user_metadata'
      }
    });
    
    if (!token) {
      console.error('❌ No token received');
      return;
    }
    
    console.log('✅ Token received successfully');
    console.log('🔑 Token length:', token.length);
    
    // Test Management API call
    console.log('📡 Testing Management API call...');
    const response = await fetch(`https://dev-351wds1ubpw3eyut.us.auth0.com/api/v2/users/${user.sub}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Management API call successful!');
      const userData = await response.json();
      console.log('📊 User metadata keys:', Object.keys(userData.user_metadata || {}));
      console.log('🎉 Auth0 is properly configured!');
    } else {
      console.error('❌ Management API call failed:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      if (response.status === 401) {
        console.log('💡 Check: Management API permissions in Auth0 dashboard');
      } else if (response.status === 403) {
        console.log('💡 Check: Scopes include read:current_user_metadata');
      } else if (response.status === 400) {
        console.log('💡 Check: Refresh token rotation is enabled');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Missing Refresh Token')) {
      console.log('💡 Fix: Enable refresh token rotation in Auth0 dashboard');
    }
  }
}

// Run the test
testAuth0Config();
