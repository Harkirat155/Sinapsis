import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Database, 
  Target, 
  Trophy, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Rocket,
  Heart,
  AlertCircle,
  Clock,
  Code,
  Play,
  Award,
  ChevronRight
} from 'lucide-react'

/**
 * ✨ SYNAPSE - World-Class AI Development Interface
 * 
 * The most beautiful AI tool interface ever built.
 * Inspired by Linear, Vercel, and Arc Browser.
 * 
 * Features:
 * - Stunning glassmorphism design
 * - Smooth Framer Motion animations
 * - Real-time SYNAPSE flow visualization
 * - Celebration effects
 * - Responsive & accessible
 */

function App() {
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [stats, setStats] = useState({
    totalQueries: 127,
    solutionsTested: 381,
    avgConfidence: 94.2,
    timesSaved: '42h'
  })

  const demoProblems = [
    { text: "I'm stuck! Need to sort an array quickly", icon: Zap },
    { text: "Build a secure login system ASAP", icon: AlertCircle },
    { text: "How do I optimize database queries?", icon: Database }
  ]

  const processingSteps = [
    { icon: Target, label: 'Analyzing Intent', description: 'Understanding your goal & emotion', color: 'from-violet-500 to-purple-500' },
    { icon: Database, label: 'Memory Recall', description: 'Finding relevant past interactions', color: 'from-blue-500 to-cyan-500' },
    { icon: Zap, label: 'Rapid Testing', description: 'Testing 3 solutions in parallel', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, label: 'Learning', description: 'Discovering patterns & improving', color: 'from-emerald-500 to-green-500' }
  ]

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev < 3 ? prev + 1 : prev))
      }, 600)
      return () => clearInterval(interval)
    } else {
      setCurrentStep(0)
    }
  }, [isProcessing])

  const handleAnalyze = async () => {
    if (!userInput.trim()) return
    
    setIsProcessing(true)
    setResult(null)
    setShowCelebration(false)

    setTimeout(() => {
      const mockResult = {
        intent: {
          detected: userInput.includes('sort') ? 'sort_data' : userInput.includes('login') ? 'build_authentication' : 'optimize_performance',
          emotion: userInput.includes('stuck') || userInput.includes('ASAP') ? 'urgent' : 'neutral',
          urgency: userInput.includes('quickly') || userInput.includes('ASAP') ? 0.92 : 0.58,
          hiddenGoals: ['deliver_value', 'solve_problem', 'learn_best_practice']
        },
        memory: {
          pastInteractions: 12,
          learnedPreferences: ['Python preferred', 'Fast execution', 'Clean code', 'Well documented'],
          relatedTopics: ['algorithms', 'data structures', 'optimization']
        },
        rapidTesting: {
          solutionsTested: 3,
          results: [
            { approach: 'Python sorted() with key', score: 96.4, time: '0.02ms', memory: '128KB', winner: true },
            { approach: 'JavaScript Array.sort()', score: 94.0, time: '0.04ms', memory: '156KB', winner: false },
            { approach: 'Custom QuickSort', score: 87.2, time: '0.08ms', memory: '192KB', winner: false }
          ]
        },
        feedback: {
          patternsLearned: 3,
          confidence: 0.96,
          improvements: ['Faster response time', 'Better accuracy', 'Memory optimization']
        }
      }
      
      setResult(mockResult)
      setIsProcessing(false)
      setShowCelebration(true)
      setStats(prev => ({
        totalQueries: prev.totalQueries + 1,
        solutionsTested: prev.solutionsTested + 3,
        avgConfidence: 94.2,
        timesSaved: '42h'
      }))

      setTimeout(() => setShowCelebration(false), 3000)
    }, 3500)
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-tertiary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="w-12 h-12 text-accent-primary" />
            <h1 className="text-7xl font-bold gradient-text">
              SYNAPSE
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-text-secondary mb-4 font-light"
          >
            AI That <span className="text-accent-primary font-semibold">Remembers</span>, 
            <span className="text-accent-secondary font-semibold"> Learns</span>, and 
            <span className="text-accent-tertiary font-semibold"> Validates</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm"
          >
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>The only AI that tests solutions in parallel and picks the winner</span>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Queries Solved', value: stats.totalQueries, icon: CheckCircle2 },
              { label: 'Solutions Tested', value: stats.solutionsTested, icon: Zap },
              { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: TrendingUp },
              { label: 'Time Saved', value: stats.timesSaved, icon: Clock }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass rounded-xl p-4 text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-accent-primary" />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="card glow-box">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-accent-primary" />
              What do you need help with?
            </h2>
            
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAnalyze()
                }
              }}
              placeholder="Describe your problem or question... (⌘+Enter to submit)"
              className="input resize-none min-h-[120px] mb-4"
              style={{ fontSize: '16px', lineHeight: '1.6' }}
            />

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {demoProblems.map((problem, i) => (
                <motion.button
                  key={i}
                  onClick={() => setUserInput(problem.text)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <problem.icon className="w-4 h-4" />
                  Try this
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={handleAnalyze}
              disabled={isProcessing || !userInput.trim()}
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              className="btn-primary w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Processing with SYNAPSE...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Analyze with SYNAPSE
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-xs text-text-secondary mt-3 text-center">
              Press <kbd className="px-2 py-1 glass rounded text-xs">⌘</kbd> + <kbd className="px-2 py-1 glass rounded text-xs">Enter</kbd> to submit
            </p>
          </div>
        </motion.div>

        {/* Processing Flow */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="card">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Play className="w-5 h-5 text-accent-primary" />
                  SYNAPSE Flow in Action
                </h3>
                
                <div className="space-y-4">
                  {processingSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: currentStep >= i ? 1 : 0.3,
                        x: 0,
                        scale: currentStep === i ? 1.02 : 1
                      }}
                      transition={{ delay: i * 0.1 }}
                      className={`glass rounded-xl p-4 border-2 transition-all ${
                        currentStep >= i ? 'border-accent-primary/50' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={currentStep === i ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ duration: 0.5, repeat: currentStep === i ? Infinity : 0 }}
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="font-semibold text-text-primary">{step.label}</div>
                          <div className="text-sm text-text-secondary">{step.description}</div>
                        </div>

                        {currentStep > i && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          </motion.div>
                        )}

                        {currentStep === i && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-accent-primary"
                          />
                        )}
                      </div>

                      {/* Progress bar */}
                      {currentStep === i && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6 }}
                          className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mt-3"
                          style={{ transformOrigin: 'left' }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration Effect */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1 }}
                className="text-8xl"
              >
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Intent Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card glow-box"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Intent Analysis</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-2">Detected Intent</div>
                    <div className="font-mono text-accent-primary font-semibold">{result.intent.detected}</div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-2">Emotional State</div>
                    <div className="flex items-center gap-2">
                      {result.intent.emotion === 'urgent' ? (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Heart className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={`font-semibold ${result.intent.emotion === 'urgent' ? 'text-orange-500' : 'text-blue-500'}`}>
                        {result.intent.emotion}
                      </span>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-2">Urgency Level</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.intent.urgency * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-accent-primary to-accent-tertiary rounded-full"
                        />
                      </div>
                      <span className="font-bold text-accent-primary">{(result.intent.urgency * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 glass rounded-xl p-4">
                  <div className="text-sm text-text-secondary mb-2">Hidden Goals Detected</div>
                  <div className="flex flex-wrap gap-2">
                    {result.intent.hiddenGoals.map((goal, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-sm font-medium"
                      >
                        {goal}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Memory Recall */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card glow-box"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Memory Recall</h3>
                  <span className="ml-auto text-sm glass px-3 py-1 rounded-full">
                    {result.memory.pastInteractions} interactions found
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Learned Preferences
                    </div>
                    <div className="space-y-2">
                      {result.memory.learnedPreferences.map((pref, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm">{pref}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Related Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.memory.relatedTopics.map((topic, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Rapid Testing - THE MOAT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card border-2 border-accent-tertiary/50 shadow-[0_0_50px_rgba(236,72,153,0.3)]"
              >
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Rapid Prototyping</h3>
                  <span className="px-4 py-1 bg-gradient-to-r from-accent-tertiary to-rose-500 text-white rounded-full text-sm font-bold">
                    THE MOAT 🔥
                  </span>
                  <span className="ml-auto text-sm glass px-3 py-1 rounded-full">
                    {result.rapidTesting.solutionsTested} solutions tested in parallel
                  </span>
                </div>

                <div className="space-y-3">
                  {result.rapidTesting.results.map((sol, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={`glass rounded-xl p-5 border-2 transition-all ${
                        sol.winner 
                          ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                          : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {sol.winner && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.8 }}
                            >
                              <Trophy className="w-6 h-6 text-yellow-500" />
                            </motion.div>
                          )}
                          {i === 1 && !sol.winner && <Award className="w-5 h-5 text-gray-400" />}
                          {i === 2 && !sol.winner && <Award className="w-5 h-5 text-amber-700" />}
                          <div>
                            <div className="font-semibold text-lg">{sol.approach}</div>
                            <div className="text-sm text-text-secondary mt-1">
                              {sol.time} • {sol.memory}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${sol.winner ? 'gradient-text' : 'text-text-secondary'}`}>
                            {sol.score}
                          </div>
                          <div className="text-xs text-text-secondary">score</div>
                        </div>
                      </div>

                      <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sol.score}%` }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                          className={`h-full rounded-full ${
                            sol.winner 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                              : 'bg-gradient-to-r from-accent-primary to-accent-secondary opacity-50'
                          }`}
                        />
                      </div>

                      {sol.winner && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ delay: 1.2 }}
                          className="mt-3 pt-3 border-t border-emerald-500/30"
                        >
                          <div className="flex items-center gap-2 text-sm text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-semibold">Winner Selected - Best Performance</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Feedback Learning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card glow-box"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Learning & Feedback</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                    <div className="text-2xl font-bold gradient-text">{result.feedback.patternsLearned}</div>
                    <div className="text-sm text-text-secondary mt-1">Patterns Learned</div>
                  </div>

                  <div className="glass rounded-xl p-4 text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold gradient-text">{(result.feedback.confidence * 100).toFixed(1)}%</div>
                    <div className="text-sm text-text-secondary mt-1">Confidence</div>
                  </div>

                  <div className="glass rounded-xl p-4 text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold gradient-text">Active</div>
                    <div className="text-sm text-text-secondary mt-1">Learning Status</div>
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="text-sm text-text-secondary mb-3">System Improvements</div>
                  <div className="space-y-2">
                    {result.feedback.improvements.map((improvement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-gradient-to-br from-bg-secondary/80 to-bg-tertiary/80"
              >
                <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
                  Traditional AI vs SYNAPSE
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-xl p-6 border-2 border-red-500/30"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <XCircle className="w-8 h-8 text-red-500" />
                      <h4 className="text-xl font-bold text-red-500">Traditional AI</h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Gives ONE solution',
                        'No validation or testing',
                        'Forgets everything',
                        'Generic responses',
                        'No learning capability',
                        'Single-threaded approach'
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className="flex items-center gap-2 text-text-secondary"
                        >
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-xl p-6 border-2 border-emerald-500/30 bg-emerald-500/5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <h4 className="text-xl font-bold text-emerald-500">SYNAPSE</h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Tests 3+ solutions in parallel',
                        'Picks winner automatically',
                        'Remembers & learns from history',
                        'Personalized & context-aware',
                        'Continuous improvement',
                        'Validates before delivery'
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <Rocket className="w-4 h-4" />
            <span>Built to close the AI-human gap</span>
          </div>
          <div className="text-sm text-text-secondary/70">
            Phases 1, 2, 3, 4 Complete • Ready for Beta Testing
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary/50">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-accent-tertiary fill-accent-tertiary" />
            <span>by the SYNAPSE team</span>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default App
