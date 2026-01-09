// Simple sync test - run this in browser console when logged in
async function testCrossDeviceSync() {
  console.log('🧪 Testing Cross-Device Sync...');
  
  // Check if Auth0 is working
  const { getAccessTokenSilently, user, isAuthenticated } = window.auth0Hook || {};
  
  if (!isAuthenticated) {
    console.error('❌ Not authenticated - sync cannot work');
    return false;
  }
  
  console.log('✅ Authenticated as:', user?.email || user?.sub);
  
  try {
    // Test token retrieval
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'offline_access read:current_user update:current_user_metadata'
      }
    });
    
    console.log('✅ Token retrieved successfully');
    
    // Test UserDataSync
    const userDataSync = window.userDataSync;
    if (!userDataSync) {
      console.error('❌ UserDataSync not available');
      return false;
    }
    
    // Test getting data
    const testData = await userDataSync.getUserData(
      user.sub, 
      'bankCCP', 
      'progressStreaks', 
      getAccessTokenSilently
    );
    
    console.log('✅ Cloud data retrieval successful:', testData);
    
    // Test saving data
    await userDataSync.updateUserData(
      user.sub,
      'bankCCP', 
      'testSync', 
      { timestamp: Date.now(), test: true },
      getAccessTokenSilently
    );
    
    console.log('✅ Cloud data save successful');
    
    return true;
    
  } catch (error) {
    console.error('❌ Sync test failed:', error);
    return false;
  }
}

// Run the test
testCrossDeviceSync().then(success => {
  console.log(success ? '🎉 Cross-device sync is working!' : '💥 Cross-device sync has issues');
});
