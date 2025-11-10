const mongoose = require('mongoose');
require('dotenv').config();

const checkResignationEmployees = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Get all resignations
    const resignations = await db.collection('resignations').find({}).toArray();
    console.log(`\n📋 Found ${resignations.length} resignations\n`);

    // Check each resignation's employee
    for (const resignation of resignations) {
      const employee = await db.collection('employees').findOne({ 
        _id: resignation.staffId 
      });

      if (!employee) {
        console.log(`❌ Resignation ${resignation._id} has invalid employee ID: ${resignation.staffId}`);
        console.log(`   Reason: ${resignation.reason}`);
        console.log(`   Status: ${resignation.status}`);
        
        // Get first available employee to suggest as replacement
        const firstEmployee = await db.collection('employees').findOne({});
        if (firstEmployee) {
          console.log(`   💡 Suggested fix: Update to employee ${firstEmployee.name} (${firstEmployee._id})`);
        }
        console.log('');
      } else {
        console.log(`✅ Resignation ${resignation._id} -> Employee: ${employee.name} (${employee._id})`);
      }
    }

    // List all available employees
    console.log('\n📊 Available Employees:');
    const employees = await db.collection('employees').find({}).toArray();
    employees.forEach(emp => {
      console.log(`   - ${emp.name} (${emp._id}) - ${emp.email}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkResignationEmployees();
