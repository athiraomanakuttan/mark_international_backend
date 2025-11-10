const mongoose = require('mongoose');
require('dotenv').config();

const testEmployeeLookup = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Get a sample resignation
    const resignations = await db.collection('resignations').find().limit(1).toArray();
    if (resignations.length === 0) {
      console.log('\n❌ No resignations found');
      process.exit(0);
    }

    const resignation = resignations[0];
    console.log('\n📋 Sample Resignation:');
    console.log('  ID:', resignation._id);
    console.log('  Staff ID:', resignation.staffId);
    console.log('  Staff ID Type:', typeof resignation.staffId);

    // Try to find the employee directly
    const employee = await db.collection('employees').findOne({ _id: resignation.staffId });
    console.log('\n👤 Direct Employee Lookup:');
    if (employee) {
      console.log('  Found:', employee.name);
      console.log('  Email:', employee.email);
    } else {
      console.log('  ❌ Employee not found with ID:', resignation.staffId);
      
      // List some employees to see what IDs exist
      const employees = await db.collection('employees').find().limit(5).toArray();
      console.log('\n  📋 Sample employee IDs in database:');
      employees.forEach(emp => {
        console.log(`    - ${emp._id} : ${emp.name}`);
      });
      
      // Try to find employee with string conversion
      const employeeByString = await db.collection('employees').findOne({ 
        _id: new mongoose.Types.ObjectId(resignation.staffId.toString()) 
      });
      if (employeeByString) {
        console.log('  ✅ Found with string conversion:', employeeByString.name);
      }
    }

    // Test the aggregation pipeline
    console.log('\n🔍 Testing Aggregation Pipeline:');
    const result = await db.collection('resignations').aggregate([
      { $match: { _id: resignation._id } },
      {
        $lookup: {
          from: 'employees',
          localField: 'staffId',
          foreignField: '_id',
          as: 'staffData'
        }
      }
    ]).toArray();

    console.log('  Aggregation Result:');
    console.log('  Staff Data Count:', result[0]?.staffData?.length);
    if (result[0]?.staffData?.length > 0) {
      console.log('  ✅ Employee Name:', result[0].staffData[0].name);
    } else {
      console.log('  ❌ No employee data in aggregation');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testEmployeeLookup();
