const { MongoClient } = require('mongodb');

async function dropEmployeeIdIndex() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('markeducation');
    const collection = db.collection('employees');
    
    // Try to drop the employeeId index
    try {
      await collection.dropIndex('employeeId_1');
      console.log('Successfully dropped employeeId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('employeeId_1 index does not exist (already dropped)');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }
    
    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log('- ', index.name, ':', JSON.stringify(index.key));
    });
    
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

dropEmployeeIdIndex().catch(console.error);