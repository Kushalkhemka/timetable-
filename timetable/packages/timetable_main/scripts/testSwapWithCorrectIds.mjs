import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing SWAP_CLASS with correct UUIDs...\n');

// Test the swap with the actual database IDs we found
const testAction = {
  type: 'SWAP_CLASS',
  parameters: {
    eventAId: 'a5fdaaed-9dad-4b5e-ba3c-e4d2892bdca7', // BT103 Monday P5
    eventBId: 'f9038b0b-7a86-4f67-b4a7-377675637700'  // EC101 Monday P7
  },
  confirmationRequired: true
};

console.log(`📋 Testing: SWAP_CLASS execution with correct UUIDs`);
console.log(`BT103 (P5): ${testAction.parameters.eventAId}`);
console.log(`EC101 (P7): ${testAction.parameters.eventBId}`);

try {
  // Execute the swap action directly
  console.log(`\n🚀 Executing SWAP_CLASS action...`);
  const executionResult = await agent.executeAction(testAction);
  
  console.log(`✅ Execution result:`, executionResult);
  
  if (executionResult.success) {
    console.log(`🎉 Swap completed successfully!`);
    console.log(`📊 Updated data:`, executionResult.data);
  } else {
    console.log(`❌ Swap failed: ${executionResult.message}`);
  }
  
} catch (error) {
  console.log(`❌ Error executing swap:`, error.message);
}

console.log('\n🏁 Swap execution testing completed!');














