import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing Monday BT103 ↔ EC101 swap based on screenshot...\n');

// Test the specific swap request based on what we see in the screenshot
const testInput = 'Swap the BT103 class on Monday P5 (12:00 PM - 1:00 PM) with the EC101 class on Monday P7 (2:00 PM - 3:00 PM) for @BIO_TECHNOLOGY_SEC-1__SEC-1';

console.log(`📋 Testing: SWAP_CLASS Intent for Monday classes`);
console.log(`Input: "${testInput}"`);

try {
  // First, process the request to get the action
  const response = await agent.processRequest(testInput);
  
  console.log(`✅ Intent detected: ${response.intent}`);
  console.log(`✅ Action type: ${response.action?.type || 'none'}`);
  console.log(`✅ Response: ${response.response}`);
  
  if (response.action && response.action.type === 'SWAP_CLASS') {
    console.log(`✅ Action payload:`, JSON.stringify(response.action, null, 2));
    
    // Now execute the action
    console.log(`\n🚀 Executing SWAP_CLASS action...`);
    const executionResult = await agent.executeAction(response.action);
    
    console.log(`✅ Execution result:`, executionResult);
    
  } else {
    console.log(`❌ No SWAP_CLASS action generated`);
    console.log(`📊 Full response:`, JSON.stringify(response, null, 2));
  }
  
} catch (error) {
  console.log(`❌ Error testing Monday swap:`, error.message);
}

console.log('\n🏁 Monday swap testing completed!');














