import os
import google.generativeai as genai
from typing import List, Dict

class LLMClient:
    def __init__(self):
        """Initialize Gemini API client."""
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_answer(self, question: str, retrieved_chunks: List[Dict]) -> str:
        """
        Generate an answer using Gemini based on the question and retrieved context.
        
        Args:
            question: The user's question
            retrieved_chunks: List of dicts with 'title' and 'text_snippet' keys
            
        Returns:
            Generated answer string
        """
        # Build context from retrieved chunks
        context = "\n\n".join([
            f"[{chunk['title']}]\n{chunk['text_snippet']}"
            for chunk in retrieved_chunks
        ])
        
        # Create prompt
        system_prompt = """You are an Enterprise HR Assistant. Your role is to answer questions about company policies based ONLY on the provided policy documents.

Rules:
1. Answer only based on the provided context
2. If the information is not in the context, say "This information is not specified in the company policy."
3. Be professional, concise, and helpful
4. Do not make up information or policies
5. Do not perform actions like approving requests - only explain policies

Context from HR Policies:
{context}

User Question: {question}

Answer:"""
        
        prompt = system_prompt.format(context=context, question=question)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating answer: {e}")
            return "I'm having trouble generating a response right now. Please try again later."
