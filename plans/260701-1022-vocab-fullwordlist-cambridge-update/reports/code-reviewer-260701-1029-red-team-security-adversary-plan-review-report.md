# Red Team Security Adversary Review — Cambridge Vocab Fullwordlist Plan

## Finding 1: Vocab word content is injected via `innerHTML`/unescaped HTML attribute with no sanitization step anywhere in the plan
- **Severity:** High
- **Location:** Phase 2 & 3, "Implementation Steps" (translation/data authoring); Phase 4, "Success Criteria"; Phase 5, QA
- **Flaw:** The plan scales vocab content from 172 hand-curated entries to 1000-1400+ entries sourced from bulk PDF extraction + bulk (likely LLM-assisted) translation, but no phase adds validation/escaping of the `en`/`vi` string fields before they reach the DOM. The existing render path is unescaped.
- **Failure scenario:** `js/english-generators.js:69-77` sets `exercise.question = correctWord.en` / `correctWord.vi` and `exercise.options = options.map(w => w.vi)` directly from vocab data. `js/english-engine.js:63` does `qText.innerHTML = '<div class="question-text">' + exercise.question + '</div>'`, and `js/english-engine.js:66`/`87` build `data-answer="' + opt + '"` by string concatenation. Any extracted/translated word or phrase containing `<`, `>`, `"` , or `&` (plausible given PDF-extraction artifacts, stray bullet characters `•`, or a translation batch that accidentally includes markup-like text) will either break rendering or execute as HTML/attribute-injected markup. No phase 1-5 step checks for HTML metacharacters in `en`/`vi` fields, and no `escapeHtml` helper exists anywhere in `js/` (verified via grep — zero matches for `escapeHtml|sanitiz`).
- **Evidence:** `js/english-generators.js:69-77`, `js/english-engine.js:63,66,83,87,90,105-107`; grep of `js/` for `escapeHtml|sanitiz` returns no results.
- **Suggested fix:** Add an explicit Phase 1 or Phase 4 step: validate every extracted/translated string against an allowlist regex (letters, spaces, apostrophe, hyphen only) and reject/flag anything else before it's written into the `.js` data files. Longer term, switch renders to `textContent`/`escapeHtml`, but at minimum the plan must add a data-validation gate given the 8x content volume increase.

## Finding 2: No integrity verification of externally-downloaded PDFs before treating their content as ground truth
- **Severity:** Medium
- **Location:** Phase 1, "Nguon du lieu da xac nhan" and step 1 of Implementation Steps
- **Flaw:** Phase 1 instructs downloading `506166-starters-movers-flyers-word-list-2025.pdf` and `506886-a2-key-2020-vocabulary-list.pdf` from `cambridgeenglish.org` and trusting the extracted text as authoritative "ground truth" for all subsequent phases. There is no hash pinning, no diff against a previously known-good copy, and no re-verification step if the PDFs are re-downloaded in a future session.
- **Failure scenario:** If the download is served via a compromised CDN edge, DNS hijack, or a captive-portal/MITM proxy (plausible on shared/home networks), the "official" wordlist could be altered before extraction, silently propagating incorrect or malicious content (feeds directly into Finding 1's unescaped render path) into 1000+ vocab entries that a child then studies from.
- **Evidence:** Phase 1 lines 22-23 (URLs), line 34 ("Tai lai 2 PDF ... da xac nhan co san tren may"); no hash/checksum mentioned anywhere in Phase 1 Risk Assessment (lines 49-53).
- **Suggested fix:** Record and pin the SHA-256 of the downloaded PDFs in the intermediate JSON metadata (the plan already tracks `sourcePage` for traceability — extend this to a file-level hash) so future re-extractions can be diffed against the first trusted run.

## Finding 3: Phase 1 relies on session-scoped scratchpad cache that will not exist when the plan is executed
- **Severity:** Medium
- **Location:** Phase 1, Implementation Step 1
- **Flaw:** "Tai lai 2 PDF (co the da co ban cache tu phien nghien cuu — kiem tra scratchpad truoc khi tai lai)" assumes the PDFs cached during the prior research session remain accessible. The scratchpad directory is explicitly session-specific and isolated per the environment's own instructions (path includes a session UUID). When Phase 1 actually executes (a new `/ck:cook` session), the referenced cache path (`.../115cdf9b-1a06-4c2e-b74e-d7f9da394627/scratchpad/vocab-pdfs/`) will not be the active session's scratchpad.
- **Failure scenario:** The executor either wastes time hunting for a non-existent path, or — worse — silently falls back to a fresh download without re-verifying it matches the version referenced during planning (compounds Finding 2: no integrity check on the fresh download either).
- **Evidence:** current scratchpad path observed: `C:\Users\dangu\AppData\Local\Temp\claude\C--DATA-Family-Toan\115cdf9b-1a06-4c2e-b74e-d7f9da394627\scratchpad\vocab-pdfs\` (confirmed to exist in this session only); Phase 1 step 1 text assumes cross-session availability.
- **Suggested fix:** Store the downloaded PDFs (or at least their extracted raw `.txt`) under the plan's own `data/` directory (which Phase 1 already proposes creating under `plans/.../data/`) rather than relying on ephemeral scratchpad, so the artifact survives across sessions and is reviewable/diffable.

## Finding 4: `english-generators.js:23` vs plan's cited line 24 for `generateDistractors` — factual inaccuracy in Phase 3
- **Severity:** Medium
- **Location:** Phase 3, Implementation Step 7 and Risk Assessment (last bullet)
- **Flaw:** Phase 3 step 7 cites `generateDistractors` at `js/english-generators.js:24`. The actual function declaration is at line 23.
- **Failure scenario:** Minor by itself, but it signals the plan's code citations were not grep-verified before being written — combined with Finding 1 (no citation of the actual unescaped-render call sites at all, despite the plan explicitly discussing distractor/pool logic in detail), this suggests the trust-boundary implications of the data pipeline were not actually traced through the render layer during planning.
- **Evidence:** `grep -n "function generateDistractors" js/english-generators.js` → line 23. Plan.md line 58 correctly cites line 23; Phase 3 line 43 cites line 24 (inconsistent within the plan itself).
- **Suggested fix:** Fix the off-by-one citation; more importantly, re-trace the full data flow from vocab file → generator → engine render before Phase 4, since that trace is what should have surfaced Finding 1.

## Finding 5: No file-count/line-count ceiling enforcement mechanism specified, risking a rushed split that reintroduces the innerHTML risk via inconsistent escaping added ad hoc
- **Severity:** Medium
- **Location:** Phase 2 Implementation Step 5, Phase 3 Implementation Step 6
- **Flaw:** Both phases say "neu 1 nhom category qua nhieu tu vuot 200 dong, tach nho hon" as a reactive, per-file manual decision made during a 700-1000+ word bulk-translation pass. There's no upfront word-count-per-category budget from Phase 1's extraction output, meaning file-splitting decisions (and any escaping/validation logic, if later added per Finding 1) will be applied inconsistently file-by-file rather than through one aggregation function.
- **Failure scenario:** If Finding 1's mitigation (validate strings before writing) is adopted only in Phase 4 (aggregator) rather than at Phase 1 (extraction) as suggested, some hand-written file parts from Phase 2/3 could bypass it entirely if the aggregator only concats without re-validating, since Phase 4 step 2 is described as a pure `[].concat(...)` with no validation logic.
- **Evidence:** Phase 4 "Related Code Files" line 22: aggregator "chi lam 1 viec: `const VOCAB_STARTERS = [].concat(...)`" — explicitly no validation/transformation logic in the one place all data funnels through.
- **Suggested fix:** If a validation gate is added (per Finding 1), place it in Phase 1 (single extraction script, single choke point) rather than leaving it to per-file authoring discipline across Phase 2/3.

## Finding 6: Deletion of `js/vocab-data-starters.js` / `js/vocab-data-a2key.js` with no rollback path if translation quality issues surface post-merge
- **Severity:** Medium
- **Location:** Phase 2 "Related Code Files" (Xoa line 30), Phase 3 "Related Code Files" (Xoa line 33)
- **Flaw:** Both phases instruct deleting the original 172-word files outright once split into parts. Combined with Phase 5 QA being a manual, non-exhaustive 15-20% sample (Phase 5 step 4), there is a realistic chance that translation errors in the un-sampled 80-85% ship to production (a live kids' app) undetected, and the only rollback is `git revert`.
- **Failure scenario:** Not a security exploit, but a data-integrity/trust concern: a child is taught an incorrect translation and the app's only correctness gate (spot QA) never covers it. This is a content-authoring app for children — factual/translation errors are the actual "data corruption" risk class here, and the plan's own P2 priority + non-exhaustive QA makes this the most likely real-world failure mode, yet Phase 5 treats it as low-severity ("Risk" bullet, not blocking).
- **Evidence:** Phase 5 step 4: "Random sample 15-20% tu moi ... xac nhan khong co loi dich ro rang" is the only correctness check for ~800-1200 new translations; Phase 2/3 both delete originals with git as the only fallback (implicit, not stated).
- **Suggested fix:** Explicitly state in Phase 5 (or plan.md) that git history is the rollback mechanism and that this is an accepted residual risk given no automated test suite exists — otherwise a reader could assume 15-20% sampling is an accepted sufficient QA bar for the full 100% of content silently.

Status: DONE
Summary: Six findings, all evidence-backed via grep against js/english-engine.js, js/english-generators.js, index.html, and the plan files; the standout is that vocab word strings flow unescaped into innerHTML/HTML attributes with no validation step added despite an 8x jump in externally-sourced content volume.
Concerns/Blockers: None blocking my review itself, but Finding 1 should be treated as a plan blocker before Phase 2/3 authoring begins, since retrofitting validation after 1000+ entries are already written is more costly than gating at Phase 1.
