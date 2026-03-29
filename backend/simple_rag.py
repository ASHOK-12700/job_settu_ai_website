import os
import glob

class SimpleRAG:
    """Simple keyword-based retrieval without embeddings"""
    def __init__(self, policy_dir: str = "hr_policies"):
        self.policy_dir = policy_dir
        self.documents = []
        self.load_documents()
    
    def load_documents(self):
        """Load all policy documents"""
        files = glob.glob(os.path.join(self.policy_dir, "*.txt"))
        
        for fpath in files:
            fname = os.path.basename(fpath)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Split into chunks
                    chunks = self._chunk_text(content)
                    for chunk in chunks:
                        self.documents.append({
                            "title": fname,
                            "text": chunk
                        })
            except Exception as e:
                print(f"Error loading {fname}: {e}")
    
    def _chunk_text(self, text: str, chunk_size: int = 400, overlap: int = 50):
        """Split text into overlapping chunks"""
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size].strip()
            if len(chunk) > 50:  # Skip tiny chunks
                chunks.append(chunk)
        return chunks
    
    def retrieve(self, query: str, top_k: int = 3):
        """Simple keyword-based retrieval"""
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        # Score documents by keyword overlap
        scored_docs = []
        for doc in self.documents:
            doc_lower = doc["text"].lower()
            doc_words = set(doc_lower.split())
            
            # Calculate simple relevance score
            common_words = query_words.intersection(doc_words)
            score = len(common_words)
            
            # Bonus for exact phrase match
            if query_lower in doc_lower:
                score += 10
            
            if score > 0:
                scored_docs.append((score, doc))
        
        # Sort by score and return top_k
        scored_docs.sort(reverse=True, key=lambda x: x[0])
        
        results = []
        for score, doc in scored_docs[:top_k]:
            results.append({
                "title": doc["title"],
                "text_snippet": doc["text"][:300] + "..." if len(doc["text"]) > 300 else doc["text"]
            })
        
        return results
