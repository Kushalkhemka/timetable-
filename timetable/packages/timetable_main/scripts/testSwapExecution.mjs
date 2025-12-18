import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing SWAP_CLASS execution...\n');

// Test the specific swap request
const testInput = 'Swap class of @BIO_TECHNOLOGY_SEC-1__SEC-1 from bt103 P5 12:00PM TO 1:00 PM to P7 EC101 2:00pm to 3:00 class exchange both';

console.log(`📋 Testing: SWAP_CLASS Intent with execution`);
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
  }
  
} catch (error) {
  console.log(`❌ Error testing SWAP_CLASS execution:`, error.message);
}

console.log('\n🏁 SWAP_CLASS execution testing completed!');














