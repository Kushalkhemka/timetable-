import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🧪 Testing single intent to avoid rate limits...\n');

// Test CANCEL intent specifically
const testInput = 'Cancel the AM101 class for CHEMICAL_ENGINEERING_SEC-1 on Monday P6';

console.log(`📋 Testing: CANCEL Intent`);
console.log(`Input: "${testInput}"`);

try {
  const response = await agent.processRequest(testInput);
  
  console.log(`✅ Intent detected: ${response.intent}`);
  console.log(`✅ Action type: ${response.action?.type || 'none'}`);
  console.log(`✅ Response: ${response.response}`);
  
  if (response.action) {
    console.log(`✅ Action payload:`, JSON.stringify(response.action, null, 2));
  }
  
  if (response.entities && response.entities.length > 0) {
    console.log(`✅ Entities found:`, response.entities.map(e => `${e.type}:${e.label}`).join(', '));
  }
  
  // Check if intent matches expected
  if (response.intent === 'CANCEL') {
    console.log(`✅ Intent matches expected: CANCEL`);
  } else {
    console.log(`❌ Intent mismatch. Expected: CANCEL, Got: ${response.intent}`);
  }
  
} catch (error) {
  console.log(`❌ Error testing CANCEL intent:`, error.message);
}

console.log('\n🏁 Single intent testing completed!');















