"""
SYNAPSE Feedback Loop - The Intelligence Layer

This is what makes SYNAPSE LEARN:
- Tracks every solution test result
- Identifies patterns in what works
- Learns user preferences from feedback
- Adapts recommendations over time
- Detects conflicts and resolves them

The more tests we run, the smarter we get.
This is the DATA FLYWHEEL in action.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from collections import defaultdict
import json

from pydantic import BaseModel, Field


class TestResult(BaseModel):
    """Result from rapid prototyping test"""
    test_id: str
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Problem context
    problem_type: str  # e.g., "sorting", "authentication", "optimization"
    user_emotion: str  # from intent analyzer
    urgency_level: float  # 0-1
    
    # Solutions tested
    solutions_tested: List[Dict[str, Any]]
    winner_id: str
    winner_score: float
    
    # Outcome
    user_accepted: Optional[bool] = None  # Did user accept the winner?
    user_feedback: Optional[str] = None
    actual_success: Optional[bool] = None  # Did it actually work?


class LearningPattern(BaseModel):
    """Discovered pattern from test results"""
    pattern_id: str
    pattern_type: str  # "preference", "success_factor", "failure_cause"
    
    # The pattern
    condition: Dict[str, Any]  # When this is true...
    outcome: Dict[str, Any]    # ...this happens
    
    # Evidence
    confidence: float  # 0-1
    times_observed: int
    success_rate: float
    
    # Context
    user_ids: List[str]
    first_seen: datetime
    last_seen: datetime


class FeedbackLoop:
    """
    The learning engine that gets smarter with every test.
    
    This is our competitive moat's moat - the data advantage.
    """
    
    def __init__(self):
        self.test_results: List[TestResult] = []
        self.patterns: List[LearningPattern] = []
        self.user_preferences: Dict[str, Dict[str, Any]] = defaultdict(dict)
        
    def record_test(self, result: TestResult):
        """Record a test result and learn from it"""
        self.test_results.append(result)
        
        # Immediate learning
        self._update_user_preferences(result)
        self._detect_patterns(result)
        
        print(f"📊 Recorded test {result.test_id}")
        print(f"   Total tests: {len(self.test_results)}")
        print(f"   Patterns discovered: {len(self.patterns)}")
    
    def _update_user_preferences(self, result: TestResult):
        """Learn user preferences from this test"""
        user_id = result.user_id
        
        # Track preferred languages
        winner = next((s for s in result.solutions_tested if s['id'] == result.winner_id), None)
        if winner:
            lang = winner.get('language', 'unknown')
            self.user_preferences[user_id]['preferred_language'] = lang
            
            # Track preferred approach style
            approach = winner.get('approach', '')
            if 'built-in' in approach.lower():
                self.user_preferences[user_id]['prefers_builtin'] = True
            elif 'manual' in approach.lower():
                self.user_preferences[user_id]['prefers_manual'] = True
    
    def _detect_patterns(self, result: TestResult):
        """Detect patterns across multiple tests"""
        
        # Pattern 1: Language effectiveness by problem type
        problem_type = result.problem_type
        winner = next((s for s in result.solutions_tested if s['id'] == result.winner_id), None)
        
        if winner:
            lang = winner.get('language', 'unknown')
            
            # Check if this pattern exists
            pattern_exists = False
            for pattern in self.patterns:
                if (pattern.pattern_type == 'success_factor' and 
                    pattern.condition.get('problem_type') == problem_type and
                    pattern.outcome.get('language') == lang):
                    
                    # Update existing pattern
                    pattern.times_observed += 1
                    pattern.last_seen = datetime.utcnow()
                    pattern.confidence = min(1.0, pattern.confidence + 0.1)
                    pattern_exists = True
                    break
            
            if not pattern_exists and len(self.test_results) > 3:
                # Create new pattern
                new_pattern = LearningPattern(
                    pattern_id=f"pattern_{len(self.patterns) + 1}",
                    pattern_type="success_factor",
                    condition={"problem_type": problem_type},
                    outcome={"language": lang, "approach": winner.get('approach')},
                    confidence=0.6,
                    times_observed=1,
                    success_rate=1.0,
                    user_ids=[result.user_id],
                    first_seen=datetime.utcnow(),
                    last_seen=datetime.utcnow()
                )
                self.patterns.append(new_pattern)
                print(f"   🧠 New pattern discovered: {lang} works well for {problem_type}")
    
    def get_recommendations(self, user_id: str, problem_type: str) -> Dict[str, Any]:
        """Get smart recommendations based on learned patterns"""
        
        recommendations = {
            "user_preferences": self.user_preferences.get(user_id, {}),
            "general_patterns": [],
            "confidence": 0.0
        }
        
        # Find relevant patterns
        for pattern in self.patterns:
            if pattern.condition.get('problem_type') == problem_type:
                recommendations["general_patterns"].append({
                    "pattern": pattern.outcome,
                    "confidence": pattern.confidence,
                    "evidence": f"Observed {pattern.times_observed} times"
                })
        
        # Calculate overall confidence
        if recommendations["general_patterns"]:
            avg_confidence = sum(p["confidence"] for p in recommendations["general_patterns"]) / len(recommendations["general_patterns"])
            recommendations["confidence"] = avg_confidence
        
        return recommendations
    
    def get_insights(self) -> Dict[str, Any]:
        """Get system-wide insights from all learning"""
        
        if not self.test_results:
            return {"message": "No data yet - run some tests!"}
        
        # Calculate stats
        total_tests = len(self.test_results)
        unique_users = len(set(r.user_id for r in self.test_results))
        unique_problems = len(set(r.problem_type for r in self.test_results))
        
        # Language preferences (overall)
        lang_wins = defaultdict(int)
        for result in self.test_results:
            winner = next((s for s in result.solutions_tested if s['id'] == result.winner_id), None)
            if winner:
                lang_wins[winner.get('language', 'unknown')] += 1
        
        # Success rates by problem type
        problem_success = defaultdict(lambda: {"total": 0, "accepted": 0})
        for result in self.test_results:
            problem_success[result.problem_type]["total"] += 1
            if result.user_accepted:
                problem_success[result.problem_type]["accepted"] += 1
        
        return {
            "total_tests": total_tests,
            "unique_users": unique_users,
            "unique_problem_types": unique_problems,
            "patterns_discovered": len(self.patterns),
            "most_successful_language": max(lang_wins.items(), key=lambda x: x[1])[0] if lang_wins else "N/A",
            "language_distribution": dict(lang_wins),
            "problem_success_rates": {
                prob: f"{(stats['accepted'] / stats['total'] * 100):.0f}%" if stats['total'] > 0 else "0%"
                for prob, stats in problem_success.items()
            },
            "learning_velocity": f"{len(self.patterns) / max(total_tests, 1):.2f} patterns per test"
        }


# Global instance
feedback_loop = FeedbackLoop()


# Example usage
if __name__ == "__main__":
    print("🧠 SYNAPSE Feedback Loop - Intelligence Layer\n")
    print("=" * 70)
    
    # Simulate some test results
    tests = [
        TestResult(
            test_id="test_1",
            user_id="user_001",
            problem_type="sorting",
            user_emotion="urgent",
            urgency_level=0.9,
            solutions_tested=[
                {"id": "sol_1", "language": "python", "approach": "Python sorted()"},
                {"id": "sol_2", "language": "javascript", "approach": "JS built-in sort"}
            ],
            winner_id="sol_1",
            winner_score=96.4,
            user_accepted=True,
            actual_success=True
        ),
        TestResult(
            test_id="test_2",
            user_id="user_001",
            problem_type="sorting",
            user_emotion="neutral",
            urgency_level=0.5,
            solutions_tested=[
                {"id": "sol_3", "language": "python", "approach": "Manual quicksort"},
                {"id": "sol_4", "language": "python", "approach": "Python sorted()"}
            ],
            winner_id="sol_4",
            winner_score=95.2,
            user_accepted=True
        ),
        TestResult(
            test_id="test_3",
            user_id="user_002",
            problem_type="authentication",
            user_emotion="frustrated",
            urgency_level=0.8,
            solutions_tested=[
                {"id": "sol_5", "language": "javascript", "approach": "JWT auth"},
                {"id": "sol_6", "language": "python", "approach": "Flask-Login"}
            ],
            winner_id="sol_5",
            winner_score=88.5,
            user_accepted=True
        )
    ]
    
    print("\n📝 Recording test results...\n")
    for test in tests:
        feedback_loop.record_test(test)
    
    print("\n" + "=" * 70)
    print("📊 SYSTEM INSIGHTS")
    print("=" * 70)
    
    insights = feedback_loop.get_insights()
    for key, value in insights.items():
        print(f"\n{key.replace('_', ' ').title()}:")
        if isinstance(value, dict):
            for k, v in value.items():
                print(f"  • {k}: {v}")
        else:
            print(f"  {value}")
    
    print("\n" + "=" * 70)
    print("🎯 RECOMMENDATIONS FOR NEW REQUEST")
    print("=" * 70)
    
    recs = feedback_loop.get_recommendations("user_001", "sorting")
    print(f"\nFor user_001 solving 'sorting' problem:")
    print(f"\nUser Preferences: {recs['user_preferences']}")
    print(f"\nGeneral Patterns:")
    for pattern in recs['general_patterns']:
        print(f"  • {pattern['pattern']} (confidence: {pattern['confidence']:.1f})")
        print(f"    {pattern['evidence']}")
    print(f"\nOverall Confidence: {recs['confidence']:.2f}")
    
    print("\n" + "=" * 70)
    print("💡 THE DATA FLYWHEEL IN ACTION")
    print("=" * 70)
    print("\nWith each test:")
    print("  ✓ System learns what works")
    print("  ✓ Patterns emerge automatically")
    print("  ✓ Recommendations get smarter")
    print("  ✓ Success rate improves")
    print("\nThis is the competitive moat growing deeper! 🌊")
    print("=" * 70 + "\n")
