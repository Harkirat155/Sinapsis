/**
 * SYNAPSE Intent Analyzer
 * 
 * Extracts the TRUE intent behind user requests.
 * Goes beyond surface-level keywords to understand:
 * - What they really want (vs what they asked for)
 * - Emotional context (frustrated, excited, confused)
 * - Urgency level
 * - Hidden goals
 */

import express from 'express';
import cors from 'cors';
import natural from 'natural';
import Sentiment from 'sentiment';
import compromise from 'compromise';

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ALLOW_ORIGINS?.split(',').map(s => s.trim()) || '*',
  credentials: true
}));

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();

// Intent patterns learned from common requests
const INTENT_PATTERNS = {
  build_feature: ['build', 'create', 'make', 'implement', 'add', 'develop'],
  debug_issue: ['bug', 'error', 'broken', 'fix', 'debug', 'not working', 'fails'],
  learn_concept: ['how', 'what', 'why', 'explain', 'understand', 'learn', 'teach'],
  optimize: ['faster', 'optimize', 'improve', 'performance', 'slow', 'speed up'],
  security: ['secure', 'security', 'authentication', 'auth', 'protect', 'vulnerability'],
  guidance: ['should i', 'recommend', 'best practice', 'advice', 'suggest', 'which']
};

// Urgency indicators
const URGENCY_HIGH = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'now', 'production'];
const URGENCY_LOW = ['someday', 'eventually', 'when you can', 'no rush', 'maybe'];

// Emotional indicators
const FRUSTRATED = ['frustrated', 'stuck', 'confused', 'lost', 'help', 'struggling'];
const EXCITED = ['excited', 'amazing', 'awesome', 'cool', 'love', 'great'];

interface IntentAnalysis {
  detectedIntent: string;
  surfaceRequest: string;
  emotionalContext: 'neutral' | 'excited' | 'frustrated' | 'confused' | 'urgent' | 'satisfied';
  urgencyScore: number;
  hiddenGoals: string[];
  confidence: number;
  reasoning: string;
}

/**
 * Analyze a user message to extract true intent
 */
function analyzeIntent(message: string): IntentAnalysis {
  const lowerMessage = message.toLowerCase();
  const tokens = tokenizer.tokenize(lowerMessage) || [];
  const doc = compromise(message);
  
  // Sentiment analysis
  const sentimentResult = sentiment.analyze(message);
  
  // Detect surface request (what they literally asked for)
  const surfaceRequest = extractSurfaceRequest(doc);
  
  // Detect true intent (what they really want)
  const detectedIntent = detectIntent(lowerMessage, tokens);
  
  // Emotional context
  const emotionalContext = detectEmotion(lowerMessage, sentimentResult);
  
  // Urgency scoring
  const urgencyScore = calculateUrgency(lowerMessage);
  
  // Hidden goals
  const hiddenGoals = extractHiddenGoals(message, detectedIntent);
  
  // Confidence in our analysis
  const confidence = calculateConfidence(tokens, detectedIntent);
  
  // Reasoning
  const reasoning = generateReasoning(detectedIntent, emotionalContext, urgencyScore);
  
  return {
    detectedIntent,
    surfaceRequest,
    emotionalContext,
    urgencyScore,
    hiddenGoals,
    confidence,
    reasoning
  };
}

function extractSurfaceRequest(doc: any): string {
  // Extract main nouns and verbs
  const verbs = doc.verbs().out('array');
  const nouns = doc.nouns().out('array');
  
  if (verbs.length > 0 && nouns.length > 0) {
    return `${verbs[0]}_${nouns[0]}`.toLowerCase().replace(/\s+/g, '_');
  }
  
  return 'general_request';
}

function detectIntent(message: string, tokens: string[]): string {
  let maxScore = 0;
  let detectedIntent = 'general_assistance';
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    const score = patterns.filter(pattern => 
      message.includes(pattern) || tokens.includes(pattern)
    ).length;
    
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    }
  }
  
  return detectedIntent;
}

function detectEmotion(message: string, sentimentResult: any): IntentAnalysis['emotionalContext'] {
  // Check for explicit emotional indicators
  if (FRUSTRATED.some(word => message.includes(word))) return 'frustrated';
  if (EXCITED.some(word => message.includes(word))) return 'excited';
  if (URGENCY_HIGH.some(word => message.includes(word))) return 'urgent';
  
  // Use sentiment score
  if (sentimentResult.score > 2) return 'excited';
  if (sentimentResult.score < -2) return 'frustrated';
  
  // Check for questions (often indicates confusion)
  if (message.includes('how') || message.includes('why') || message.includes('?')) {
    return 'confused';
  }
  
  return 'neutral';
}

function calculateUrgency(message: string): number {
  let urgency = 0.5; // baseline
  
  // High urgency indicators
  URGENCY_HIGH.forEach(word => {
    if (message.includes(word)) urgency += 0.15;
  });
  
  // Low urgency indicators
  URGENCY_LOW.forEach(word => {
    if (message.includes(word)) urgency -= 0.15;
  });
  
  // Exclamation marks indicate urgency
  const exclamations = (message.match(/!/g) || []).length;
  urgency += exclamations * 0.1;
  
  // Multiple question marks indicate confusion/urgency
  const questionMarks = (message.match(/\?/g) || []).length;
  if (questionMarks > 1) urgency += 0.15;
  
  return Math.max(0, Math.min(1, urgency));
}

function extractHiddenGoals(message: string, detectedIntent: string): string[] {
  const goals: string[] = [];
  
  // Map intents to likely hidden goals
  const goalMapping: Record<string, string[]> = {
    build_feature: ['deliver_value_to_users', 'learn_new_technology', 'meet_deadline'],
    debug_issue: ['unblock_progress', 'understand_root_cause', 'prevent_future_issues'],
    learn_concept: ['build_confidence', 'apply_knowledge', 'become_proficient'],
    optimize: ['reduce_costs', 'improve_user_experience', 'scale_system'],
    security: ['protect_users', 'comply_with_regulations', 'build_trust'],
    guidance: ['make_informed_decision', 'avoid_mistakes', 'save_time']
  };
  
  if (goalMapping[detectedIntent]) {
    goals.push(...goalMapping[detectedIntent]);
  }
  
  // Additional goals based on context
  if (message.includes('production') || message.includes('users')) {
    goals.push('serve_end_users');
  }
  
  if (message.includes('team') || message.includes('colleague')) {
    goals.push('enable_team_success');
  }
  
  return [...new Set(goals)]; // deduplicate
}

function calculateConfidence(tokens: string[], intent: string): number {
  // More tokens = more context = higher confidence
  const tokenBonus = Math.min(tokens.length / 50, 0.3);
  
  // Base confidence depends on intent clarity
  const baseConfidence = intent === 'general_assistance' ? 0.4 : 0.7;
  
  return Math.min(1, baseConfidence + tokenBonus);
}

function generateReasoning(intent: string, emotion: string, urgency: number): string {
  const urgencyLevel = urgency > 0.7 ? 'high urgency' : urgency < 0.3 ? 'low urgency' : 'moderate urgency';
  
  return `Detected as ${intent.replace(/_/g, ' ')} with ${emotion} emotional state and ${urgencyLevel}`;
}

// API Endpoints
app.get('/', (req, res) => {
  res.json({
    service: 'SYNAPSE Intent Analyzer',
    status: 'operational',
    version: '0.1.0'
  });
});

app.post('/analyze', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const analysis = analyzeIntent(message);
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`🧠 SYNAPSE Intent Analyzer running on port ${PORT}`);
});

export { analyzeIntent, IntentAnalysis };
