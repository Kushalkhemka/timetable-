import { TimetableAIAgent } from '../dist-test/services/aiAgent.js';

const agent = new TimetableAIAgent();

console.log('🧪 Testing AI agent with new API key...\n');

// Test a comprehensive query that would be typical for the UI
const testInput = 'Schedule @CHEMICAL_ENGINEERING_SEC-1__SEC-1 add extra class on monday P6, 1:00 pm to 2:00 pm of AM101 subject';

console.log(`📋 Testing: SCHEDULE Intent with @mentions`);
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
  console.log(`❌ Error testing with new API key:`, error.message);
}

console.log('\n🏁 Testing completed!');















