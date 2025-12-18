import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing SWAP_CLASS functionality for UI...\n');

// Test with a natural language prompt that would be typical for the UI
const testInput = 'Can you swap the AM101 class on Tuesday P3 with the AP101 class on Tuesday P4 for @BIO_TECHNOLOGY_SEC-1__SEC-1';

console.log(`📋 Testing: Natural language SWAP_CLASS request`);
console.log(`Input: "${testInput}"`);

try {
  // Process the request to get the action
  const response = await agent.processRequest(testInput);
  
  console.log(`✅ Intent detected: ${response.intent}`);
  console.log(`✅ Action type: ${response.action?.type || 'none'}`);
  console.log(`✅ Response: ${response.response}`);
  
  if (response.action && response.action.type === 'SWAP_CLASS') {
    console.log(`✅ Action payload:`, JSON.stringify(response.action, null, 2));
    
    // Execute the action
    console.log(`\n🚀 Executing SWAP_CLASS action...`);
    const executionResult = await agent.executeAction(response.action);
    
    console.log(`✅ Execution result:`, executionResult);
    
    if (executionResult.success) {
      console.log(`🎉 Swap completed successfully!`);
    } else {
      console.log(`❌ Swap failed: ${executionResult.message}`);
    }
    
  } else {
    console.log(`❌ No SWAP_CLASS action generated`);
    console.log(`📊 Full response:`, JSON.stringify(response, null, 2));
  }
  
} catch (error) {
  console.log(`❌ Error testing UI swap:`, error.message);
}

console.log('\n🏁 UI swap testing completed!');














