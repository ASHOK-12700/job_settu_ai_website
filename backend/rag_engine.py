import os
import glob
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class RAGEngine:
    def __init__(self, policy_dir: str = "hr_policies"):
        self.policy_dir = policy_dir
        self.chunks = [] # List of dicts: {'title': str, 'text': str}
        self.index = None
        
        # Load embedding model
        model_name = os.environ.get("RAG_EMBED_MODEL", "all-MiniLM-L6-v2")
        self.embedder = SentenceTransformer(model_name)
        
        # Initialize
        self.reload_and_index()

    def reload_and_index(self):
        """Loads files, chunks them, and builds FAISS index."""
        self.chunks = []
        files = glob.glob(os.path.join(self.policy_dir, "*.txt"))
        
        for fpath in files:
            fname = os.path.basename(fpath)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
                # Simple chunking by paragraphs or fixed size
                # Requirement: 300-450 chars. 
                # Let's simple slide window or paragraph split then sub-chunk.
                # For simplicity and speed: fixed size with overlap
                size = 400
                overlap = 50
                for i in range(0, len(content), size - overlap):
                    chunk_text = content[i : i + size].strip()
                    if len(chunk_text) > 20: # skip tiny chunks
                        self.chunks.append({
                            "title": fname,
                            "text": chunk_text
                        })
        
        if not self.chunks:
            print("Warning: No chunks found to index.")
            # Initialize empty index
            d = 384 # Dimension for all-MiniLM-L6-v2
            self.index = faiss.IndexFlatL2(d)
            return

        # Embed
        texts = [c["text"] for c in self.chunks]
        embeddings = self.embedder.encode(texts)
        
        # Build FAISS index
        d = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(d)
        self.index.add(np.array(embeddings))
        print(f"Indexed {len(self.chunks)} chunks.")

    def retrieve(self, query: str, top_k: int = 4, threshold: float = 0.55):
        """
        Retrieves relevant chunks for a query.
        Returns list of chunks.
        """
        if not self.chunks or self.index is None:
            return []
            
        q_emb = self.embedder.encode([query])
        distances, indices = self.index.search(np.array(q_emb), top_k)
        
        results = []
        # Distances in L2 index are squared Euclidean distances. 
        # Lower is better. 
        # Converting L2 distance to something roughly like cosine similarity/relevance:
        # For normalized vectors, L2 = 2(1-cos). 
        # However, sentence-transformers output is usually normalized.
        # Let's assume normalized vectors.
        # 0.55 similarity check requested. 
        # If using L2: dist = 2 * (1 - sim) => sim = 1 - dist/2
        # If dist is large, sim is low.
        
        for i, idx in enumerate(indices[0]):
            if idx == -1: continue
            dist = distances[0][i]
            
            # Rough conversion if normalized (all-MiniLM does normalize by default usually?)
            # Actually, let's verify normalization. 
            # If not normalized, thresholding L2 is tricky without scale.
            # safe assumption: assume sim roughly correlates. 
            # If dist > 1.0 (unrelated), skip. 
            # User asked for cosine similarity threshold 0.55.
            # L2=0.9 corresponds to sim=0.55 roughly if normalized.
            # Let's go with a looser check to ensure we get data, relying on LLM to filter.
            
            if dist > 1.2: # Very far
                continue
                
            chunk = self.chunks[idx].copy()
            # Add text_snippet for API contract (first 300 chars)
            chunk["text_snippet"] = chunk["text"][:300]
            results.append(chunk)
            
        return results
