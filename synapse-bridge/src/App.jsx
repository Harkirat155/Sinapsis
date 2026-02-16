import { useState } from 'react'

/**
 * SYNAPSE Web Interface
 * 
 * Visual demonstration of the complete system:
 * - Intent Analysis
 * - Memory Recall
 * - Rapid Prototyping (parallel testing)
 * - Feedback Learning
 * 
 * This shows what traditional AI can't do.
 */

function App() {
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const demoProblems = [
    "I'm stuck! Need to sort an array quickly",
    "Build a secure login system ASAP",
    "How do I optimize database queries?"
  ]

  const handleAnalyze = async () => {
    if (!userInput.trim()) return
    
    setIsProcessing(true)
    setResult(null)

    // Simulate the full SYNAPSE flow
    setTimeout(() => {
      const mockResult = {
        intent: {
          detected: userInput.includes('sort') ? 'sort_data' : userInput.includes('login') ? 'build_authentication' : 'optimize',
          emotion: userInput.includes('stuck') || userInput.includes('ASAP') ? 'urgent' : 'neutral',
          urgency: userInput.includes('quickly') || userInput.includes('ASAP') ? 0.9 : 0.5,
          hiddenGoals: ['deliver_value', 'solve_problem']
        },
        memory: {
          pastInteractions: 2,
          learnedPreferences: ['Python preferred', 'Fast execution important']
        },
        rapidTesting: {
          solutionsTested: 3,
          results: [
            { approach: 'Python sorted()', score: 96.4, winner: true },
            { approach: 'JavaScript built-in', score: 94.0, winner: false },
            { approach: 'Manual implementation', score: 74.0, winner: false }
          ]
        },
        feedback: {
          patternsLearned: 1,
          confidence: 0.85
        }
      }
      
      setResult(mockResult)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>
          🧠 SYNAPSE
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.9 }}>
          AI That Remembers, Learns, and Validates
        </p>
        <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>
          The only AI that tests multiple solutions in parallel and picks the winner
        </p>
      </div>

      {/* Input Section */}
      <div className="container" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Ask Me Anything</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your problem or question..."
            rows="3"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          {demoProblems.map((problem, i) => (
            <button 
              key={i}
              onClick={() => setUserInput(problem)}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Try: "{problem.substring(0, 30)}..."
            </button>
          ))}
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={isProcessing || !userInput.trim()}
          style={{ 
            width: '100%',
            fontSize: '18px',
            padding: '15px',
            opacity: isProcessing || !userInput.trim() ? 0.6 : 1
          }}
        >
          {isProcessing ? '🔄 Processing...' : '🚀 Analyze with SYNAPSE'}
        </button>
      </div>

      {/* Processing Flow */}
      {isProcessing && (
        <div className="container loading">
          <h3 style={{ marginBottom: '20px' }}>Processing...</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div className="card">
              <strong>Step 1:</strong> Analyzing intent & emotion...
            </div>
            <div className="card">
              <strong>Step 2:</strong> Recalling past interactions...
            </div>
            <div className="card">
              <strong>Step 3:</strong> Testing 3 solutions in parallel...
            </div>
            <div className="card">
              <strong>Step 4:</strong> Learning patterns...
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Intent Analysis */}
          <div className="container" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>🎯 Intent Analysis</h3>
            <div className="grid grid-2">
              <div>
                <p><strong>Detected Intent:</strong> {result.intent.detected}</p>
                <p><strong>Emotional State:</strong> {result.intent.emotion}</p>
              </div>
              <div>
                <p><strong>Urgency:</strong> {(result.intent.urgency * 100).toFixed(0)}%</p>
                <div className="progress-bar" style={{ marginTop: '10px' }}>
                  <div className="progress-fill" style={{ width: `${result.intent.urgency * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Memory Recall */}
          <div className="container" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>💾 Memory Recall</h3>
            <p><strong>Past Interactions Found:</strong> {result.memory.pastInteractions}</p>
            <p><strong>Learned Preferences:</strong></p>
            <div style={{ marginTop: '10px' }}>
              {result.memory.learnedPreferences.map((pref, i) => (
                <span key={i} className="badge badge-info">{pref}</span>
              ))}
            </div>
          </div>

          {/* Rapid Testing - THE MOAT */}
          <div className="container" style={{ marginBottom: '20px', border: '3px solid #f5576c' }}>
            <h3 style={{ marginBottom: '15px' }}>
              ⚡ Rapid Prototyping <span className="badge badge-danger">THE MOAT</span>
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Tested {result.rapidTesting.solutionsTested} solutions in parallel
            </p>
            
            <div className="grid" style={{ gap: '10px' }}>
              {result.rapidTesting.results.map((sol, i) => (
                <div 
                  key={i}
                  className="card"
                  style={{ 
                    border: sol.winner ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
                    background: sol.winner ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {sol.winner && <span style={{ marginRight: '8px' }}>🏆</span>}
                      {i === 1 && !sol.winner && <span style={{ marginRight: '8px' }}>🥈</span>}
                      {i === 2 && !sol.winner && <span style={{ marginRight: '8px' }}>🥉</span>}
                      <strong>{sol.approach}</strong>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {sol.score}
                    </div>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '10px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${sol.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback & Learning */}
          <div className="container">
            <h3 style={{ marginBottom: '15px' }}>🧠 Learning & Feedback</h3>
            <div className="grid grid-2">
              <div>
                <p><strong>Patterns Learned:</strong> {result.feedback.patternsLearned}</p>
                <p><strong>Confidence:</strong> {(result.feedback.confidence * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p><strong>System Status:</strong></p>
                <span className="badge badge-success">Learning Active</span>
                <span className="badge badge-info">Improving</span>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="container" style={{ marginTop: '30px', background: 'rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginBottom: '15px' }}>Traditional AI vs SYNAPSE</h3>
            <div className="grid grid-2">
              <div>
                <h4 style={{ color: '#ef4444' }}>❌ Traditional AI</h4>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>Gives ONE solution</li>
                  <li>No validation</li>
                  <li>Forgets everything</li>
                  <li>Generic responses</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#10b981' }}>✅ SYNAPSE</h4>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>Tests 3+ solutions in parallel</li>
                  <li>Picks winner automatically</li>
                  <li>Remembers & learns</li>
                  <li>Personalized & validated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.7 }}>
        <p>Built to close the AI-human gap 🚀</p>
        <p style={{ fontSize: '14px', marginTop: '5px' }}>
          Phases 1, 2, 3, 4 Complete • Ready for Beta Testing
        </p>
      </div>
    </div>
  )
}

export default App
