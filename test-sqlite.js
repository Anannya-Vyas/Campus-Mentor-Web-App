// Quick SQLite Test Script
// Run with: node test-sqlite.js

const SQLiteUser = require('./models/SQLiteUser');
const { setupDatabase } = require('./db/database');

async function quickTest() {
    console.log('\n🧪 Quick SQLite Test\n');
    console.log('='.repeat(50));

    try {
        // Initialize database
        console.log('\n1️⃣ Initializing database...');
        await setupDatabase();

        // Add test user
        console.log('\n2️⃣ Adding test user...');
        const user = await SQLiteUser.addUser(
            'Test User',
            `test${Date.now()}@example.com`,
            'student'
        );
        console.log('✅ User added:', user);

        // Get all users
        console.log('\n3️⃣ Getting all users...');
        const users = await SQLiteUser.getUsers();
        console.log(`✅ Found ${users.length} users`);

        // Get statistics
        console.log('\n4️⃣ Getting statistics...');
        const stats = await SQLiteUser.getUserStats();
        console.log('✅ Statistics:', stats);

        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests passed!');
        console.log('\n💡 Next steps:');
        console.log('   - Run: node server.js');
        console.log('   - Open: http://localhost:3001/pages/sqlite-test.html');
        console.log('   - Test API: curl http://localhost:3001/api/sqlite/users\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

quickTest();
