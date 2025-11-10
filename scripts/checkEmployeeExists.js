const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

async function checkEmployee() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    const employeeId = '689070b3235d323fa949a256';
    
    // Check if employee exists
    const Employee = mongoose.connection.collection('employees');
    const employee = await Employee.findOne({ _id: new mongoose.Types.ObjectId(employeeId) });
    
    console.log('\n📊 Employee lookup result:');
    console.log('Employee ID:', employeeId);
    console.log('Employee found:', !!employee);
    
    if (employee) {
      console.log('Employee data:', {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation
      });
    } else {
      console.log('❌ Employee NOT FOUND in database');
      
      // Check what employees exist
      console.log('\n📋 Checking existing employees...');
      const allEmployees = await Employee.find({}).limit(5).toArray();
      console.log(`Total employees found: ${allEmployees.length}`);
      
      if (allEmployees.length > 0) {
        console.log('\nSample employees:');
        allEmployees.forEach((emp, idx) => {
          console.log(`${idx + 1}. ID: ${emp._id}, Name: ${emp.name}, Email: ${emp.email}`);
        });
      }
    }

    // Check resignation
    const Resignation = mongoose.connection.collection('resignations');
    const resignation = await Resignation.findOne({ _id: new mongoose.Types.ObjectId('690ea42b7818e5085e7a4ec1') });
    
    if (resignation) {
      console.log('\n📄 Resignation data:');
      console.log('Resignation ID:', resignation._id);
      console.log('Staff ID:', resignation.staffId);
      console.log('Staff ID type:', typeof resignation.staffId);
      console.log('Reason:', resignation.reason);
      console.log('Status:', resignation.status);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
  }
}

checkEmployee();
