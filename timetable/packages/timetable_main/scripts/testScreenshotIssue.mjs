import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing the exact issue from screenshot...\n');

// Test with the exact scenario from the screenshot
const testInput = 'Swap AC101 and AM101 classes for @BIO_TECHNOLOGY_SEC-1__SEC-1 on Wednesday, moving AC101 from 11:00 AM-12:00 PM to 12:00 PM-1:00 PM';

console.log(`📋 Testing: Screenshot scenario`);
console.log(`Input: "${testInput}"`);

try {
  // Process the request to get the action
  const response = await agent.processRequest(testInput);
  
  console.log(`✅ Intent detected: ${response.intent}`);
  console.log(`✅ Action type: ${response.action?.type || 'none'}`);
  console.log(`✅ Response: ${response.response}`);
  
  if (response.action && response.action.type === 'SWAP_CLASS') {
    console.log(`✅ Action payload:`, JSON.stringify(response.action, null, 2));
    
    // Check if we have valid IDs
    if (response.action.parameters.eventAId && response.action.parameters.eventBId) {
      console.log(`✅ Valid IDs found: ${response.action.parameters.eventAId} and ${response.action.parameters.eventBId}`);
      
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
      console.log(`❌ Missing or invalid IDs in action parameters`);
    }
    
  } else {
    console.log(`❌ No SWAP_CLASS action generated`);
    console.log(`📊 Full response:`, JSON.stringify(response, null, 2));
  }
  
} catch (error) {
  console.log(`❌ Error testing screenshot issue:`, error.message);
}

console.log('\n🏁 Screenshot issue testing completed!');














