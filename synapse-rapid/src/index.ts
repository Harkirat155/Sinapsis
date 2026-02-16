/**
 * SYNAPSE Rapid Prototyping Engine
 * 
 * THE MOAT - What makes us different:
 * Test 3-5 solutions in parallel, automatically pick the winner.
 * 
 * Flow:
 * 1. Receive problem + multiple solution approaches
 * 2. Spin up isolated Docker containers for each
 * 3. Execute in parallel
 * 4. Collect metrics (time, success, resource usage)
 * 5. Rank and return winner
 * 
 * This is what competitors CAN'T copy easily.
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ALLOW_ORIGINS?.split(',').map(s => s.trim()) || '*',
  credentials: true
}));

// Solution template
interface Solution {
  id: string;
  approach: string;
  code: string;
  language: 'javascript' | 'python' | 'bash';
  timeout?: number; // milliseconds
}

// Test result
interface TestResult {
  solutionId: string;
  approach: string;
  success: boolean;
  executionTime: number; // ms
  output?: string;
  error?: string;
  exitCode?: number;
  score: number; // 0-100, higher is better
}

// Ranking criteria
interface RankingWeights {
  success: number;      // 50% - most important
  speed: number;        // 30% - faster is better
  simplicity: number;   // 20% - less code is better
}

const DEFAULT_WEIGHTS: RankingWeights = {
  success: 0.5,
  speed: 0.3,
  simplicity: 0.2
};

/**
 * Execute a single solution in isolation
 * For now, using Node's child_process (later: Docker containers)
 */
async function executeSolution(solution: Solution): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    // For MVP: Execute directly (unsafe but fast for demo)
    // In production: Use Docker containers for isolation
    const result = await executeCode(solution.code, solution.language, solution.timeout);
    const executionTime = Date.now() - startTime;
    
    // Calculate score
    const score = calculateScore(result, executionTime, solution.code.length);
    
    return {
      solutionId: solution.id,
      approach: solution.approach,
      success: result.success,
      executionTime,
      output: result.output,
      error: result.error,
      exitCode: result.exitCode,
      score
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      solutionId: solution.id,
      approach: solution.approach,
      success: false,
      executionTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      score: 0
    };
  }
}

/**
 * Execute code based on language
 */
async function executeCode(
  code: string, 
  language: string, 
  timeout: number = 5000
): Promise<{ success: boolean; output?: string; error?: string; exitCode?: number }> {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    let command: string;
    
    switch (language) {
      case 'javascript':
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'python':
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'bash':
        command = code;
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    
    const { stdout, stderr } = await execAsync(command, { timeout });
    
    return {
      success: true,
      output: stdout,
      error: stderr || undefined,
      exitCode: 0
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      exitCode: error.code || 1
    };
  }
}

/**
 * Calculate score for a solution
 */
function calculateScore(
  result: { success: boolean; output?: string; error?: string },
  executionTime: number,
  codeLength: number,
  weights: RankingWeights = DEFAULT_WEIGHTS
): number {
  // Success score (0 or 100)
  const successScore = result.success ? 100 : 0;
  
  // Speed score (faster = higher, max 100)
  // Normalize: 100ms = 100 points, 1000ms = 50 points, 5000ms = 0 points
  const speedScore = Math.max(0, 100 - (executionTime / 50));
  
  // Simplicity score (fewer lines = higher, max 100)
  // Normalize: 10 chars = 100 points, 500 chars = 50 points, 1000+ chars = 0 points
  const simplicityScore = Math.max(0, 100 - (codeLength / 10));
  
  // Weighted total
  const totalScore = 
    (successScore * weights.success) +
    (speedScore * weights.speed) +
    (simplicityScore * weights.simplicity);
  
  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
}

/**
 * Test multiple solutions in parallel and rank them
 */
async function testSolutionsInParallel(solutions: Solution[]): Promise<{
  results: TestResult[];
  winner: TestResult;
  ranking: TestResult[];
}> {
  console.log(`🚀 Testing ${solutions.length} solutions in parallel...`);
  
  // Execute all solutions simultaneously
  const startTime = Date.now();
  const results = await Promise.all(
    solutions.map(solution => executeSolution(solution))
  );
  const totalTime = Date.now() - startTime;
  
  // Rank by score
  const ranking = [...results].sort((a, b) => b.score - a.score);
  const winner = ranking[0];
  
  console.log(`✓ Completed in ${totalTime}ms`);
  console.log(`🏆 Winner: ${winner.approach} (score: ${winner.score})`);
  
  return { results, winner, ranking };
}

/**
 * API: Test multiple solutions
 */
app.post('/test', async (req, res) => {
  try {
    const { problem, solutions } = req.body;
    
    if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
      return res.status(400).json({ error: 'Solutions array required' });
    }
    
    // Add IDs to solutions
    const solutionsWithIds = solutions.map(s => ({
      ...s,
      id: s.id || uuidv4()
    }));
    
    // Test in parallel
    const { results, winner, ranking } = await testSolutionsInParallel(solutionsWithIds);
    
    res.json({
      success: true,
      problem,
      tested: solutions.length,
      results,
      winner,
      ranking,
      insight: generateInsight(ranking)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate insight from results
 */
function generateInsight(ranking: TestResult[]): string {
  const successCount = ranking.filter(r => r.success).length;
  const totalCount = ranking.length;
  const winner = ranking[0];
  
  if (successCount === 0) {
    return 'All solutions failed. Need to rethink the approach.';
  }
  
  if (successCount === totalCount) {
    return `All ${totalCount} solutions worked! Winner (${winner.approach}) was fastest at ${winner.executionTime}ms.`;
  }
  
  return `${successCount}/${totalCount} solutions succeeded. ${winner.approach} won with ${winner.score} points.`;
}

/**
 * Health check
 */
app.get('/', (req, res) => {
  res.json({
    service: 'SYNAPSE Rapid Prototyping Engine',
    status: 'operational',
    version: '0.1.0',
    capabilities: [
      'Parallel solution testing',
      'Automatic winner selection',
      'Performance metrics',
      'Multi-language support (JS, Python, Bash)'
    ]
  });
});

/**
 * Get stats
 */
let testsRun = 0;
let solutionsTested = 0;

app.get('/stats', (req, res) => {
  res.json({
    testsRun,
    solutionsTested,
    averageSolutionsPerTest: testsRun > 0 ? (solutionsTested / testsRun).toFixed(1) : 0
  });
});

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`🚀 SYNAPSE Rapid Prototyping Engine running on port ${PORT}`);
  console.log(`🔥 This is our MOAT - parallel solution testing!`);
});

export { executeSolution, testSolutionsInParallel, calculateScore };
