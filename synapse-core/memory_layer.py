"""
SYNAPSE Memory Layer - Core Component

This is the brain of SYNAPSE. It provides:
1. Persistent storage of interactions using vector embeddings
2. User preference learning and retrieval
3. Context-aware memory recall
4. Automatic memory importance scoring
"""

from typing import List, Optional, Dict, Any
import chromadb
from chromadb.config import Settings
from datetime import datetime
import asyncio
import logging
import hashlib
import numpy as np

try:
    from sentence_transformers import SentenceTransformer  # type: ignore
except Exception:
    SentenceTransformer = None

from models import Interaction, UserPreference, MemoryEntry

logger = logging.getLogger(__name__)


class MemoryLayer:
    """
    The Memory Layer uses ChromaDB for vector storage and semantic search.
    Every interaction, preference, and context is embedded and stored.
    """
    
    def __init__(self, persist_directory: str = "./chroma_data"):
        # Initialize ChromaDB
        self.client = chromadb.Client(Settings(
            persist_directory=persist_directory,
            anonymized_telemetry=False
        ))
        
        # Collections for different types of memories
        self.interactions_collection = self.client.get_or_create_collection(
            name="interactions",
            metadata={"description": "All user interactions"}
        )
        
        self.preferences_collection = self.client.get_or_create_collection(
            name="preferences",
            metadata={"description": "Learned user preferences"}
        )
        
        self.memories_collection = self.client.get_or_create_collection(
            name="memories",
            metadata={"description": "General context memories"}
        )
        
        # Embedding model (fallback to lightweight local embedding if unavailable)
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2') if SentenceTransformer else None
        
        logger.info("Memory Layer initialized")

    def _embed_text(self, text: str) -> List[float]:
        """Create embeddings with transformer if available, else deterministic lightweight vectors."""
        if self.embedder is not None:
            return self.embedder.encode(text).tolist()

        digest = hashlib.sha256(text.encode("utf-8")).digest()
        seed = int.from_bytes(digest[:8], byteorder="big", signed=False)
        rng = np.random.default_rng(seed)
        return rng.standard_normal(384).astype(np.float32).tolist()
    
    async def store_interaction(self, interaction: Interaction) -> str:
        """
        Store an interaction and return its ID.
        Automatically creates embeddings for semantic search.
        """
        # Create embedding of the user message
        embedding = self._embed_text(interaction.user_message)
        
        # Store in ChromaDB
        self.interactions_collection.add(
            ids=[interaction.id],
            embeddings=[embedding],
            documents=[interaction.user_message],
            metadatas=[{
                "user_id": interaction.user_id,
                "timestamp": interaction.timestamp.isoformat(),
                "interaction_type": interaction.interaction_type.value,
                "emotional_context": interaction.emotional_context.value,
                "urgency_score": interaction.urgency_score,
                "detected_intent": interaction.detected_intent or "",
                "successful": interaction.solution_successful if interaction.solution_successful is not None else "unknown"
            }]
        )
        
        logger.info(f"Stored interaction {interaction.id} for user {interaction.user_id}")
        return interaction.id
    
    async def recall_similar_interactions(
        self,
        query: str,
        user_id: str,
        limit: int = 5,
        min_similarity: float = 0.5
    ) -> List[Dict[str, Any]]:
        """
        Find similar past interactions for context.
        This is how we learn from history.
        """
        # Embed the query
        query_embedding = self._embed_text(query)
        
        # Search for similar interactions
        results = self.interactions_collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"user_id": user_id}
        )
        
        # Format results
        similar = []
        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i]
                distance = results['distances'][0][i] if results.get('distances') else None
                
                # Convert distance to similarity (cosine similarity)
                similarity = 1 - (distance if distance else 0)
                
                if similarity >= min_similarity:
                    similar.append({
                        "id": results['ids'][0][i],
                        "content": doc,
                        "similarity": similarity,
                        "metadata": metadata
                    })
        
        logger.info(f"Recalled {len(similar)} similar interactions for user {user_id}")
        return similar
    
    async def store_preference(self, preference: UserPreference) -> str:
        """Store a learned user preference"""
        # Create embedding of the preference description
        pref_text = f"{preference.category}: {preference.preference_key} = {preference.preference_value}"
        embedding = self._embed_text(pref_text)
        
        # Store in ChromaDB
        self.preferences_collection.add(
            ids=[preference.id],
            embeddings=[embedding],
            documents=[pref_text],
            metadatas=[{
                "user_id": preference.user_id,
                "category": preference.category,
                "preference_key": preference.preference_key,
                "confidence": preference.confidence,
                "times_confirmed": preference.times_confirmed,
                "times_contradicted": preference.times_contradicted
            }]
        )
        
        logger.info(f"Stored preference {preference.id} for user {preference.user_id}")
        return preference.id
    
    async def get_user_preferences(
        self,
        user_id: str,
        category: Optional[str] = None,
        min_confidence: float = 0.5
    ) -> List[Dict[str, Any]]:
        """Get all preferences for a user, optionally filtered by category"""
        where_filter = {"user_id": user_id}
        if category:
            where_filter["category"] = category
        
        results = self.preferences_collection.get(
            where=where_filter,
            limit=100
        )
        
        # Filter by confidence
        preferences = []
        if results['documents']:
            for i, doc in enumerate(results['documents']):
                metadata = results['metadatas'][i]
                if metadata['confidence'] >= min_confidence:
                    preferences.append({
                        "id": results['ids'][i],
                        "content": doc,
                        "metadata": metadata
                    })
        
        return preferences
    
    async def store_memory(self, memory: MemoryEntry) -> str:
        """Store a general context memory"""
        embedding = self._embed_text(memory.content)
        
        self.memories_collection.add(
            ids=[memory.id],
            embeddings=[embedding],
            documents=[memory.content],
            metadatas=[{
                "user_id": memory.user_id,
                "memory_type": memory.memory_type,
                "importance_score": memory.importance_score,
                "access_count": memory.access_count,
                "tags": ",".join(memory.tags)
            }]
        )
        
        logger.info(f"Stored memory {memory.id}")
        return memory.id
    
    async def get_relevant_context(
        self,
        query: str,
        user_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get the most relevant memories/context for a query.
        This combines interactions, preferences, and general memories.
        """
        query_embedding = self._embed_text(query)
        
        # Search across all collections
        context = []
        
        # Recent similar interactions
        interactions = await self.recall_similar_interactions(query, user_id, limit=3)
        context.extend([{**item, "source": "interaction"} for item in interactions])
        
        # Relevant preferences
        prefs = await self.get_user_preferences(user_id)
        context.extend([{**item, "source": "preference"} for item in prefs[:2]])
        
        # Relevant memories
        memory_results = self.memories_collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"user_id": user_id}
        )
        
        if memory_results['documents'] and memory_results['documents'][0]:
            for i, doc in enumerate(memory_results['documents'][0]):
                context.append({
                    "id": memory_results['ids'][0][i],
                    "content": doc,
                    "metadata": memory_results['metadatas'][0][i],
                    "source": "memory"
                })
        
        # Sort by importance/relevance
        context.sort(key=lambda x: x.get('metadata', {}).get('importance_score', 0.5), reverse=True)
        
        return context[:limit]
    
    def get_stats(self, user_id: Optional[str] = None) -> Dict[str, int]:
        """Get statistics about stored memories"""
        stats = {
            "total_interactions": len(self.interactions_collection.get()['ids']),
            "total_preferences": len(self.preferences_collection.get()['ids']),
            "total_memories": len(self.memories_collection.get()['ids'])
        }
        
        if user_id:
            user_interactions = self.interactions_collection.get(where={"user_id": user_id})
            user_preferences = self.preferences_collection.get(where={"user_id": user_id})
            user_memories = self.memories_collection.get(where={"user_id": user_id})
            
            stats["user_interactions"] = len(user_interactions['ids'])
            stats["user_preferences"] = len(user_preferences['ids'])
            stats["user_memories"] = len(user_memories['ids'])
        
        return stats
