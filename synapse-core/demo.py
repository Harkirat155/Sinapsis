"""
Demo script to showcase SYNAPSE capabilities
"""

import asyncio
from datetime import datetime
from models import Interaction, UserPreference, InteractionType, EmotionalContext
from memory_layer import MemoryLayer


async def demo():
    print("🧠 SYNAPSE Memory Layer Demo\n")
    
    # Initialize
    memory = MemoryLayer(persist_directory="./demo_chroma_data")
    
    # Simulate user interactions
    user_id = "demo_user_001"
    
    print("=" * 60)
    print("SCENARIO: User asks for help building features")
    print("=" * 60)
    
    # Interaction 1
    interaction1 = Interaction(
        user_id=user_id,
        user_message="I need to build a login system for my web app",
        interaction_type=InteractionType.REQUEST,
        detected_intent="build_authentication",
        surface_request="login_system",
        emotional_context=EmotionalContext.NEUTRAL,
        urgency_score=0.6,
        solution_attempted="JWT authentication with refresh tokens",
        solution_successful=True,
        time_to_resolution=180.0,
        context_tags=["web", "authentication", "security"]
    )
    
    id1 = await memory.store_interaction(interaction1)
    print(f"\n✓ Stored interaction 1: {interaction1.user_message[:50]}...")
    
    # Learn preference
    pref1 = UserPreference(
        user_id=user_id,
        category="tech_stack",
        preference_key="auth_method",
        preference_value="JWT",
        confidence=0.8,
        learned_from_interactions=[id1],
        times_confirmed=1
    )
    
    await memory.store_preference(pref1)
    print(f"✓ Learned preference: User prefers JWT authentication")
    
    # Interaction 2
    await asyncio.sleep(0.5)
    interaction2 = Interaction(
        user_id=user_id,
        user_message="How do I add password reset functionality?",
        interaction_type=InteractionType.QUESTION,
        detected_intent="extend_authentication",
        surface_request="password_reset",
        emotional_context=EmotionalContext.NEUTRAL,
        urgency_score=0.5,
        solution_attempted="Email-based reset tokens",
        solution_successful=True,
        time_to_resolution=120.0,
        context_tags=["web", "authentication", "email"]
    )
    
    await memory.store_interaction(interaction2)
    print(f"\n✓ Stored interaction 2: {interaction2.user_message[:50]}...")
    
    # Interaction 3 - Similar to first
    await asyncio.sleep(0.5)
    interaction3 = Interaction(
        user_id=user_id,
        user_message="Need to implement OAuth for social login",
        interaction_type=InteractionType.REQUEST,
        detected_intent="build_authentication",
        surface_request="oauth_login",
        emotional_context=EmotionalContext.NEUTRAL,
        urgency_score=0.7,
        context_tags=["web", "authentication", "oauth", "social"]
    )
    
    await memory.store_interaction(interaction3)
    print(f"\n✓ Stored interaction 3: {interaction3.user_message[:50]}...")
    
    # Now recall similar interactions
    print("\n" + "=" * 60)
    print("RECALL: Finding similar past interactions")
    print("=" * 60)
    
    query = "I want to add authentication to my app"
    similar = await memory.recall_similar_interactions(query, user_id, limit=3)
    
    print(f"\nQuery: '{query}'")
    print(f"\nFound {len(similar)} similar interactions:\n")
    
    for i, item in enumerate(similar, 1):
        print(f"{i}. [{item['similarity']:.2f} similarity]")
        print(f"   {item['content'][:60]}...")
        print(f"   Intent: {item['metadata']['detected_intent']}")
        print(f"   Success: {item['metadata']['successful']}")
        print()
    
    # Get user preferences
    print("=" * 60)
    print("PREFERENCES: What we learned about the user")
    print("=" * 60)
    
    prefs = await memory.get_user_preferences(user_id)
    print(f"\nLearned {len(prefs)} preferences:\n")
    
    for pref in prefs:
        meta = pref['metadata']
        print(f"• {meta['category']} / {meta['preference_key']}")
        print(f"  Value: {pref['content']}")
        print(f"  Confidence: {meta['confidence']:.2f}")
        print()
    
    # Get full context
    print("=" * 60)
    print("CONTEXT: Everything relevant for a new query")
    print("=" * 60)
    
    context_query = "How do I make my login more secure?"
    context = await memory.get_relevant_context(context_query, user_id, limit=5)
    
    print(f"\nQuery: '{context_query}'")
    print(f"\nRelevant context ({len(context)} items):\n")
    
    for item in context:
        source = item['source']
        content = item['content'][:50]
        print(f"[{source.upper()}] {content}...")
    
    # Stats
    print("\n" + "=" * 60)
    print("STATS")
    print("=" * 60)
    
    stats = memory.get_stats(user_id)
    print(f"\nSystem-wide:")
    print(f"  Total interactions: {stats['total_interactions']}")
    print(f"  Total preferences: {stats['total_preferences']}")
    print(f"  Total memories: {stats['total_memories']}")
    print(f"\nFor user {user_id}:")
    print(f"  Interactions: {stats['user_interactions']}")
    print(f"  Preferences: {stats['user_preferences']}")
    print(f"  Memories: {stats['user_memories']}")
    
    print("\n" + "=" * 60)
    print("✨ This is SYNAPSE in action!")
    print("=" * 60)
    print("\nKey capabilities demonstrated:")
    print("1. ✓ Store interactions with rich metadata")
    print("2. ✓ Semantic search across past interactions")
    print("3. ✓ Learn and store user preferences")
    print("4. ✓ Retrieve full context for any query")
    print("5. ✓ Track success patterns")
    print("\nImagine this running for 1000s of users, learning constantly...")
    print("That's how we build AI that actually understands humans! 🚀\n")


if __name__ == "__main__":
    asyncio.run(demo())
