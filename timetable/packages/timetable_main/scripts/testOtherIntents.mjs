import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🧪 Testing other AI agent intents...\n');

// Test cases for the remaining intents
const testCases = [
  {
    name: 'SWAP_CLASS Intent',
    input: 'Swap the AM101 class for CHEMICAL_ENGINEERING_SEC-1 on Monday P9 with the EE105 class on Monday P3',
    expectedIntent: 'SWAP_CLASS'
  },
  {
    name: 'ACCOMMODATE_URGENT_EVENT Intent',
    input: 'Accommodate urgent event: Guest lecture on AI for CHEMICAL_ENGINEERING_SEC-1, prefer Tuesday or Wednesday, any available room',
    expectedIntent: 'ACCOMMODATE_URGENT_EVENT'
  },
  {
    name: 'AVAILABILITY Intent - Free Slots',
    input: 'Find free slots for CHEMICAL_ENGINEERING_SEC-1 on Monday',
    expectedIntent: 'AVAILABILITY'
  },
  {
    name: 'AVAILABILITY Intent - Room Availability',
    input: 'Check room availability for A-101 on Tuesday',
    expectedIntent: 'AVAILABILITY'
  },
  {
    name: 'DISTRIBUTION Intent',
    input: 'Check teacher workload distribution for Dr. Smith',
    expectedIntent: 'DISTRIBUTION'
  }
];

async function testIntent(testCase) {
  console.log(`\n📋 Testing: ${testCase.name}`);
  console.log(`Input: "${testCase.input}"`);
  
  try {
    const response = await agent.processRequest(testCase.input);
    
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
    if (response.intent === testCase.expectedIntent) {
      console.log(`✅ Intent matches expected: ${testCase.expectedIntent}`);
    } else {
      console.log(`❌ Intent mismatch. Expected: ${testCase.expectedIntent}, Got: ${response.intent}`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing ${testCase.name}:`, error.message);
  }
}

async function runTests() {
  for (const testCase of testCases) {
    await testIntent(testCase);
    // Small delay between tests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 Other intents testing completed!');
}

runTests().catch(console.error);















