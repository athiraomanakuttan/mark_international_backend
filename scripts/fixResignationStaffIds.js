const mongoose = require('mongoose');
require('dotenv').config();

const fixResignationStaffIds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Get all resignations
    const resignations = await db.collection('resignations').find().toArray();
    console.log(`\n📋 Found ${resignations.length} resignation(s)`);

    // Get all employee IDs
    const employees = await db.collection('employees').find().toArray();
    const employeeIds = employees.map(emp => emp._id.toString());
    console.log(`👥 Found ${employees.length} employee(s)`);

    // Check each resignation
    let fixedCount = 0;
    let invalidCount = 0;

    for (const resignation of resignations) {
      const staffIdStr = resignation.staffId.toString();
      const employeeExists = employeeIds.includes(staffIdStr);

      if (!employeeExists) {
        console.log(`\n❌ Invalid staffId in resignation ${resignation._id}:`);
        console.log(`   Current staffId: ${resignation.staffId}`);
        console.log(`   This employee doesn't exist!`);
        
        // Option 1: Update to first available employee
        if (employees.length > 0) {
          const firstEmployee = employees[0];
          console.log(`   ✅ Updating to first available employee: ${firstEmployee.name} (${firstEmployee._id})`);
          
          await db.collection('resignations').updateOne(
            { _id: resignation._id },
            { $set: { staffId: firstEmployee._id } }
          );
          fixedCount++;
        } else {
          invalidCount++;
        }
      } else {
        const employee = employees.find(emp => emp._id.toString() === staffIdStr);
        console.log(`✅ Resignation ${resignation._id} - Valid staffId: ${employee.name}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Invalid (no employees available): ${invalidCount}`);
    console.log(`   Valid: ${resignations.length - fixedCount - invalidCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixResignationStaffIds();
