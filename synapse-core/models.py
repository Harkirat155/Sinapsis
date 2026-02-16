from datetime import datetime
from typing import Optional, Dict, Any, List
from enum import Enum
from pydantic import BaseModel, Field
import uuid


class InteractionType(str, Enum):
    """Types of interactions we track"""
    QUESTION = "question"
    REQUEST = "request"
    FEEDBACK = "feedback"
    CORRECTION = "correction"
    PREFERENCE = "preference"
    SUCCESS = "success"
    FAILURE = "failure"


class EmotionalContext(str, Enum):
    """Detected emotional state"""
    NEUTRAL = "neutral"
    EXCITED = "excited"
    FRUSTRATED = "frustrated"
    URGENT = "urgent"
    CONFUSED = "confused"
    SATISFIED = "satisfied"


class Interaction(BaseModel):
    """Core data model for every AI-human interaction"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # The interaction content
    user_message: str
    ai_response: Optional[str] = None
    interaction_type: InteractionType = InteractionType.QUESTION
    
    # Context and intent
    detected_intent: Optional[str] = None  # What they really want
    surface_request: Optional[str] = None  # What they literally asked for
    emotional_context: EmotionalContext = EmotionalContext.NEUTRAL
    urgency_score: float = Field(default=0.5, ge=0.0, le=1.0)
    
    # Solution tracking
    solution_attempted: Optional[str] = None
    solution_successful: Optional[bool] = None
    time_to_resolution: Optional[float] = None  # seconds
    
    # Metadata
    context_tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "user_message": "I need to build a login system",
                "detected_intent": "secure_authentication_implementation",
                "surface_request": "login_system",
                "emotional_context": "neutral",
                "urgency_score": 0.6,
                "context_tags": ["web_development", "security", "authentication"]
            }
        }


class UserPreference(BaseModel):
    """Learned preferences for a specific user"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Preference details
    category: str  # e.g., "code_style", "communication", "tech_stack"
    preference_key: str  # e.g., "preferred_language", "verbosity_level"
    preference_value: Any
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    
    # Evidence
    learned_from_interactions: List[str] = Field(default_factory=list)  # interaction IDs
    times_confirmed: int = 0
    times_contradicted: int = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "category": "code_style",
                "preference_key": "preferred_language",
                "preference_value": "Python",
                "confidence": 0.85,
                "times_confirmed": 12,
                "times_contradicted": 2
            }
        }


class MemoryEntry(BaseModel):
    """A stored memory in the vector database"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Content
    content: str  # The actual memory text
    embedding: Optional[List[float]] = None  # Vector representation
    
    # Classification
    memory_type: str  # e.g., "preference", "past_solution", "context"
    importance_score: float = Field(default=0.5, ge=0.0, le=1.0)
    
    # Relationships
    related_interactions: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    
    # Decay
    access_count: int = 0
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "content": "User prefers concise explanations without excessive details",
                "memory_type": "communication_preference",
                "importance_score": 0.8,
                "tags": ["communication", "style", "brevity"],
                "access_count": 15
            }
        }


class SolutionAttempt(BaseModel):
    """Track each solution attempt for rapid iteration"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    interaction_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # The solution
    approach: str  # Description of the approach
    implementation: Optional[str] = None  # Code/config/etc
    
    # Testing
    test_environment: Optional[str] = None  # Docker container ID, etc
    test_results: Optional[Dict[str, Any]] = None
    success: Optional[bool] = None
    
    # Metrics
    execution_time: Optional[float] = None  # seconds
    resource_usage: Optional[Dict[str, float]] = None
    quality_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    
    # Learning
    failure_reason: Optional[str] = None
    lessons_learned: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "interaction_id": "interaction_456",
                "approach": "JWT-based authentication with refresh tokens",
                "success": True,
                "execution_time": 2.3,
                "quality_score": 0.92
            }
        }
