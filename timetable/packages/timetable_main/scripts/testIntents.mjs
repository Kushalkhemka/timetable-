import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🧪 Testing different AI agent intents...\n');

// Test cases for different intents
const testCases = [
  {
    name: 'SCHEDULE Intent',
    input: 'Schedule @CHEMICAL_ENGINEERING_SEC-1__SEC-1 add extra class on monday P6, 1:00 pm to 2:00 pm of AM101 subject',
    expectedIntent: 'SCHEDULE'
  },
  {
    name: 'CANCEL Intent', 
    input: 'Cancel the AM101 class for CHEMICAL_ENGINEERING_SEC-1 on Monday P6',
    expectedIntent: 'CANCEL'
  },
  {
    name: 'RESCHEDULE Intent',
    input: 'Reschedule the AM101 class for CHEMICAL_ENGINEERING_SEC-1 from Monday P6 to Tuesday P3',
    expectedIntent: 'RESCHEDULE'
  },
  {
    name: 'SUBSTITUTE Intent',
    input: 'Assign substitute teacher Dr. Johnson for the AM101 class on Monday P6',
    expectedIntent: 'SUBSTITUTE'
  },
  {
    name: 'AVAILABILITY Intent',
    input: 'Find available slots for CHEMICAL_ENGINEERING_SEC-1 on Monday',
    expectedIntent: 'AVAILABILITY'
  },
  {
    name: 'CONSTRAINTS Intent',
    input: 'Add constraint that room A-101 cannot be used on Fridays',
    expectedIntent: 'CONSTRAINTS'
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
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Intent testing completed!');
}

runTests().catch(console.error);
