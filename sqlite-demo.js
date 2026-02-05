// SQLite Demo App for Campus Mentor
// Standalone demonstration of SQLite database functionality
// Run with: node sqlite-demo.js

const { setupDatabase } = require('./db/database');
const SQLiteUser = require('./models/SQLiteUser');

/**
 * Demo function to showcase SQLite functionality
 */
async function runDemo() {
    console.log('\n🎓 Campus Mentor - SQLite Database Demo\n');
    console.log('='.repeat(50));

    try {
        // Step 1: Initialize database
        console.log('\n📦 Step 1: Initializing database...');
        await setupDatabase();

        // Step 2: Add sample users
        console.log('\n👥 Step 2: Adding sample users...');
        
        const user1 = await SQLiteUser.addUser(
            'John Doe',
            'john.doe@example.com',
            'student'
        );
        console.log('   Created:', user1);

        const user2 = await SQLiteUser.addUser(
            'Dr. Sarah Smith',
            'sarah.smith@example.com',
            'teacher'
        );
        console.log('   Created:', user2);

        const user3 = await SQLiteUser.addUser(
            'Mike Johnson',
            'mike.j@example.com',
            'student'
        );
        console.log('   Created:', user3);

        const user4 = await SQLiteUser.addUser(
            'Admin User',
            'admin@campusmentor.com',
            'admin'
        );
        console.log('   Created:', user4);

        // Step 3: Get all users
        console.log('\n📋 Step 3: Fetching all users...');
        const allUsers = await SQLiteUser.getUsers();
        console.log(`   Total users: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
        });

        // Step 4: Get users by role
        console.log('\n🎓 Step 4: Fetching students only...');
        const students = await SQLiteUser.getUsersByRole('student');
        students.forEach(student => {
            console.log(`   - ${student.name} (${student.email})`);
        });

        console.log('\n👨‍🏫 Step 5: Fetching teachers only...');
        const teachers = await SQLiteUser.getUsersByRole('teacher');
        teachers.forEach(teacher => {
            console.log(`   - ${teacher.name} (${teacher.email})`);
        });

        // Step 6: Update a user
        console.log('\n✏️ Step 6: Updating user information...');
        const updatedUser = await SQLiteUser.updateUser(user1.id, {
            name: 'John Doe Jr.',
            email: 'john.doe.jr@example.com'
        });
        console.log('   Updated:', updatedUser);

        // Step 7: Search users
        console.log('\n🔍 Step 7: Searching for users...');
        const searchResults = await SQLiteUser.searchUsers('sarah');
        console.log(`   Found ${searchResults.length} user(s):`);
        searchResults.forEach(user => {
            console.log(`   - ${user.name} (${user.email})`);
        });

        // Step 8: Get user by ID
        console.log('\n🔎 Step 8: Getting user by ID...');
        const userById = await SQLiteUser.getUserById(user2.id);
        console.log('   User:', userById);

        // Step 9: Get statistics
        console.log('\n📊 Step 9: Getting user statistics...');
        const stats = await SQLiteUser.getUserStats();
        console.log('   Statistics:');
        console.log(`   - Total users: ${stats.total}`);
        console.log(`   - Students: ${stats.student}`);
        console.log(`   - Teachers: ${stats.teacher}`);
        console.log(`   - Admins: ${stats.admin}`);

        // Step 10: Final user list
        console.log('\n📋 Step 10: Final user list...');
        const finalUsers = await SQLiteUser.getUsers();
        console.table(finalUsers.map(u => ({
            ID: u.id,
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Created: new Date(u.created_at).toLocaleString()
        })));

        console.log('\n' + '='.repeat(50));
        console.log('✅ Demo completed successfully!');
        console.log('📁 Database file: campus_mentor.db');
        console.log('\n💡 Try these functions in your code:');
        console.log('   - SQLiteUser.addUser(name, email, role)');
        console.log('   - SQLiteUser.getUsers()');
        console.log('   - SQLiteUser.getUserById(id)');
        console.log('   - SQLiteUser.getUsersByRole(role)');
        console.log('   - SQLiteUser.updateUser(id, updates)');
        console.log('   - SQLiteUser.deleteUser(id)');
        console.log('   - SQLiteUser.searchUsers(searchTerm)');
        console.log('   - SQLiteUser.getUserStats()');
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Error during demo:', error.message);
        console.error(error);
    }
}

// Run the demo
if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = { runDemo };
