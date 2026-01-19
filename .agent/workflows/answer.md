---
description: 💬 Answer a question or provide documentation without modifying code.
---
# 💬 Answer Protocol (v4.8)

**Goal:** Respond to questions, provide explanations, or generate documentation without touching codebase files.

## When to Use

- User asks "How does X work?"
- User asks "What is the purpose of Y?"
- User wants documentation or explanation only.

## Steps

1. **Research:** Use `view_file`, `grep_search`, or `view_code_item` to gather context.
2. **Synthesize:** Formulate a clear, concise answer.
3. **Cite:** Reference specific files/lines if applicable.
4. **NO CODE CHANGES:** This workflow is read-only. Do not edit files.

## Output Format

Provide the answer in markdown with:

- Clear headers
- Code snippets (if quoting existing code)
- File references as backtick paths
