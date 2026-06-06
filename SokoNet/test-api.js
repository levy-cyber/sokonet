async function testAPI() {
  try {
    console.log('Testing SokoNet API endpoints...\n');

    // Test health endpoint
    const healthRes = await fetch('http://127.0.0.1:5000/api/health');
    const health = await healthRes.json();
    console.log('Health check:', health);

    // Test user registration
    const registerRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@sokonet.dev',
        password: 'Password123',
        role: 'user'
      })
    });
    const register = await registerRes.json();
    console.log('Registration:', register);

    if (register.token) {
      // Test login
      const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@sokonet.dev',
          password: 'Password123'
        })
      });
      const login = await loginRes.json();
      console.log('Login:', login);

      // Test protected route
      const profileRes = await fetch('http://127.0.0.1:5000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${login.token}` }
      });
      const profile = await profileRes.json();
      console.log('Profile:', profile);
    }

    console.log('\n✅ API tests completed successfully!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();