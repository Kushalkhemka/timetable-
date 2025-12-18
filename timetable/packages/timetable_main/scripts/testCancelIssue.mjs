import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing the CANCEL issue from screenshot...\n');

// Test with the exact scenario from the screenshot
const testInput = 'delete all the class @BIO_TECHNOLOGY_SEC-1__SEC-1 on monday';

console.log(`📋 Testing: Cancel all Monday classes`);
console.log(`Input: "${testInput}"`);

try {
  // Process the request to get the action
  const response = await agent.processRequest(testInput);
  
  console.log(`✅ Intent detected: ${response.intent}`);
  console.log(`✅ Action type: ${response.action?.type || 'none'}`);
  console.log(`✅ Response: ${response.response}`);
  
  if (response.action) {
    console.log(`✅ Action payload:`, JSON.stringify(response.action, null, 2));
    
    // Check if we have valid IDs
    if (response.action.type === 'CANCEL' && (response.action.parameters.id || response.action.parameters.ids)) {
      const ids = response.action.parameters.ids || [response.action.parameters.id];
      console.log(`✅ Valid IDs found: ${ids.join(', ')}`);
      
      // Execute the action
      console.log(`\n🚀 Executing CANCEL action...`);
      const executionResult = await agent.executeAction(response.action);
      
      console.log(`✅ Execution result:`, executionResult);
      
      if (executionResult.success) {
        console.log(`🎉 Cancel completed successfully!`);
      } else {
        console.log(`❌ Cancel failed: ${executionResult.message}`);
      }
    } else {
      console.log(`❌ Missing or invalid ID in action parameters`);
      console.log(`📊 Action parameters:`, response.action.parameters);
    }
    
  } else {
    console.log(`❌ No action generated`);
    console.log(`📊 Full response:`, JSON.stringify(response, null, 2));
  }
  
} catch (error) {
  console.log(`❌ Error testing cancel issue:`, error.message);
}

console.log('\n🏁 Cancel issue testing completed!');
