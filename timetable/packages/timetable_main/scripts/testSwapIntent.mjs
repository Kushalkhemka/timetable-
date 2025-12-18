import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🧪 Testing SWAP_CLASS intent with rate limiting...\n');

// Test SWAP_CLASS intent specifically
const testInput = 'Swap the AM101 class for CHEMICAL_ENGINEERING_SEC-1 on Monday P9 with the EE105 class on Monday P3';

console.log(`📋 Testing: SWAP_CLASS Intent`);
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
  if (response.intent === 'SWAP_CLASS') {
    console.log(`✅ Intent matches expected: SWAP_CLASS`);
  } else {
    console.log(`❌ Intent mismatch. Expected: SWAP_CLASS, Got: ${response.intent}`);
  }
  
} catch (error) {
  console.log(`❌ Error testing SWAP_CLASS intent:`, error.message);
}

console.log('\n🏁 SWAP_CLASS intent testing completed!');















