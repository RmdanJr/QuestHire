---
inclusion: fileMatch
fileMatchPattern: "src/lib/llm/**"
---

# Bedrock structured-output rules

Schemas passed to Bedrock (Converse `outputConfig.textFormat`) must follow these constraints, otherwise the API returns a 400:

- Every object sets `additionalProperties: false`.
- No `minimum`/`maximum`/`multipleOf` and no `minLength`/`maxLength`. Enforce bounds in Zod after parsing.
- At most 12 optional properties in total across the whole schema, and at most 16 union-typed (`anyOf` or type-array) properties.
- Make fields required and nullable (`["string", "null"]`) instead of optional.
- No recursive schemas and no external `$ref`.
- The first request with a new schema compiles a grammar for up to ~90 seconds (cached for 24 hours). Use client timeouts of 120 s or more and warm schemas on deploy.
- Set `maxTokens` high enough for the full JSON object, or the output is truncated.

Keep schemas provider-agnostic so a Grok or other OpenAI-compatible adapter can use the same ones.
