import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔍 Debugging SWAP_CLASS conflict detection...\n');

// Let's check what's currently in the database
console.log('📊 Current database state:');
console.log('BT103 Monday P5: a5fdaaed-9dad-4b5e-ba3c-e4d2892bdca7');
console.log('EC101 Monday P7: f9038b0b-7a86-4f67-b4a7-377675637700');

// Test the swap action
const testAction = {
  type: 'SWAP_CLASS',
  parameters: {
    eventAId: 'a5fdaaed-9dad-4b5e-ba3c-e4d2892bdca7', // BT103 Monday P5
    eventBId: 'f9038b0b-7a86-4f67-b4a7-377675637700'  // EC101 Monday P7
  },
  confirmationRequired: true
};

try {
  // Let's manually check what the swap would look like
  console.log('\n🔄 What the swap should do:');
  console.log('BT103 (currently P5) → should move to P7');
  console.log('EC101 (currently P7) → should move to P5');
  
  // Execute the swap action
  console.log(`\n🚀 Executing SWAP_CLASS action...`);
  const executionResult = await agent.executeAction(testAction);
  
  console.log(`✅ Execution result:`, executionResult);
  
} catch (error) {
  console.log(`❌ Error executing swap:`, error.message);
}

console.log('\n🏁 Debug completed!');














