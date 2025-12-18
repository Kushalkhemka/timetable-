import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🔄 Testing SWAP_CLASS functionality...\n');

// Test the specific swap request
const testInput = 'Swap class of @BIO_TECHNOLOGY_SEC-1__SEC-1 from bt103 P5 12:00PM TO 1:00 PM to P7 EC101 2:00pm to 3:00 class exchange both';

console.log(`📋 Testing: SWAP_CLASS Intent with @mentions`);
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
  
  if (response.thoughts && response.thoughts.length > 0) {
    console.log(`✅ Chain of Thought steps: ${response.thoughts.length}`);
    response.thoughts.slice(0, 2).forEach((thought, i) => {
      console.log(`   Step ${i + 1}: ${thought.thought.substring(0, 100)}...`);
    });
  }
  
  if (response.treeOfThought) {
    console.log(`✅ Tree of Thought: ${response.treeOfThought.content.substring(0, 100)}...`);
  }
  
} catch (error) {
  console.log(`❌ Error testing SWAP_CLASS:`, error.message);
}

console.log('\n🏁 SWAP_CLASS testing completed!');














