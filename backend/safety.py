import re

class SafetyGuard:
    def __init__(self):
        # Regex patterns for PII
        self.pii_patterns = {
            "email": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            "phone": r'(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}',
            "ssn": r'\d{3}-\d{2}-\d{4}',
        }
        
        # Keywords indicating action requests (forbidden)
        self.action_keywords = [
            "approve", "grant", "process", "change salary", "terminate",
            "promotion", "raise", "book", "apply for", "sanction"
        ]

    def redact_pii(self, text: str) -> tuple[str, dict]:
        """
        Redacts PII from text and returns (redacted_text, summary_of_redactions).
        Does NOT store the actual PII values in the summary, just a mask or count.
        """
        redacted_text = text
        redacted_summary = {}

        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, redacted_text)
            if matches:
                # Replace with [REDACTED_TYPE]
                redacted_text = re.sub(pattern, f"[REDACTED_{pii_type.upper()}]", redacted_text)
                # Store masked versions or just a flag for the summary
                # Requirement: "redaction summary in the response (do not store)"
                # We'll just return the list of masked strings as a visual indicator
                # or just the fact that we redacted something. 
                # "email": ["masked@..."] - let's attempt to give a masked hint
                masked_list = []
                for m in matches:
                    if isinstance(m, tuple): m = m[0] # handle groups
                    if pii_type == "email":
                        # simple mask: f***@**.com
                        try:
                            parts = m.split('@')
                            masked = parts[0][0] + "***@" + parts[1]
                        except:
                            masked = "[REDACTED_EMAIL]"
                        masked_list.append(masked)
                    else:
                        masked_list.append(f"[REDACTED_{pii_type.upper()}]")
                
                redacted_summary[pii_type] = masked_list
        
        return redacted_text, redacted_summary

    def is_action_request(self, text: str) -> bool:
        """
        Detects if the query is asking to perform an action (forbidden).
        This is a simple keyword-based heuristic.
        """
        lower_text = text.lower()
        for keyword in self.action_keywords:
            # Check for word boundaries to avoid partial matches if possible, 
            # but simple 'in' check with spaces might suffice for this level.
            # Using regex for word boundary is safer.
            if re.search(r'\b' + re.escape(keyword) + r'\b', lower_text):
                return True
        return False
