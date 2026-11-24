"""AI provider abstraction with FREE fallback chain.

Chain (in order):
 1) local-cv — always available offline, geometry assessment (not an LLM).
 2) pollinations-text — keyless free text API https://text.pollinations.ai/{prompt}
 3) huggingface — only if HF_TOKEN set (Inference API, free tier).
 4) openrouter-free — only if OPENROUTER_API_KEY set, free models only.
 5) openai-compatible — only if OPENAI_API_KEY set.
Each call: timeout 15s, 1 retry, then next provider.
The `provider` + `model_version` are ALWAYS recorded in assessment metadata.
A local-CV result is labelled provider='local-cv', never claimed as LLM output.
"""
import os, time, urllib.parse, urllib.request, json

TIMEOUT = 15

def _http_get(url, headers=None, timeout=TIMEOUT):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", errors="replace")

def _http_post_json(url, payload, headers=None, timeout=TIMEOUT):
    data = json.dumps(payload).encode()
    h = {"Content-Type": "application/json"}; h.update(headers or {})
    req = urllib.request.Request(url, data=data, headers=h, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", errors="replace"))

def sanitize_user_text(text: str) -> str:
    """Prompt-injection guard: strip lines that try to inject system instructions."""
    bad = ("ignore previous", "ignore all instructions", "you are now", "system:",
           "### instruction", "disregard", "override")
    out = []
    for line in (text or "").splitlines():
        if any(b in line.lower() for b in bad):
            continue
        out.append(line)
    return "\n".join(out).strip()[:4000]

def pollinations_text(prompt: str) -> str:
    """Keyless free text endpoint (Pollinations). Returns raw text or raises."""
    url = "https://text.pollinations.ai/" + urllib.parse.quote(prompt[:2000])
    last = None
    for _ in range(2):
        try:
            return _http_get(url)
        except Exception as e:
            last = e; time.sleep(0.5)
    raise RuntimeError(f"pollinations failed: {last}")

def huggingface_text(prompt: str, model: str = "HuggingFaceH4/zephyr-7b-beta") -> str:
    token = os.environ.get("HF_TOKEN")
    if not token: raise RuntimeError("HF_TOKEN not set")
    url = f"https://api-inference.huggingface.co/models/{model}"
    out = _http_post_json(url, {"inputs": prompt, "parameters": {"max_new_tokens": 512}},
                          headers={"Authorization": f"Bearer {token}"})
    if isinstance(out, list) and out: return out[0].get("generated_text", "")
    if isinstance(out, dict) and "error" in out: raise RuntimeError(str(out["error"]))
    return str(out)

def openrouter_text(prompt: str, model: str = "meta-llama/llama-3.1-8b-instruct:free") -> str:
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key: raise RuntimeError("OPENROUTER_API_KEY not set")
    out = _http_post_json("https://openrouter.ai/api/v1/chat/completions",
        {"model": model, "messages": [{"role": "user", "content": prompt}]},
        headers={"Authorization": f"Bearer {key}", "HTTP-Referer": "https://drawpath.local"})
    return out["choices"][0]["message"]["content"]

def openai_compatible_text(prompt: str, model: str = "gpt-4o-mini") -> str:
    key = os.environ.get("OPENAI_API_KEY")
    if not key: raise RuntimeError("OPENAI_API_KEY not set")
    base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    out = _http_post_json(f"{base}/chat/completions",
        {"model": model, "messages": [{"role": "user", "content": prompt}]},
        headers={"Authorization": f"Bearer {key}"})
    return out["choices"][0]["message"]["content"]

PROVIDERS = [
    ("pollinations", pollinations_text, "pollinations-text"),
    ("huggingface", huggingface_text, "HuggingFaceH4/zephyr-7b-beta"),
    ("openrouter", openrouter_text, "meta-llama/llama-3.1-8b-instruct:free"),
    ("openai-compatible", openai_compatible_text, "gpt-4o-mini"),
]

def generate_text(prompt: str, system: str = "") -> dict:
    """Try providers in order. Returns {provider, model, text} or raises RuntimeError."""
    full = (system + "\n\n" + prompt).strip() if system else prompt
    errors = []
    for name, fn, model in PROVIDERS:
        try:
            text = fn(full)
            if text and text.strip():
                return {"provider": name, "model": model, "text": text.strip()}
        except Exception as e:
            errors.append(f"{name}: {e}")
    raise RuntimeError("All text providers failed: " + " | ".join(errors))

def available_providers() -> list:
    avail = ["local-cv", "pollinations"]
    if os.environ.get("HF_TOKEN"): avail.append("huggingface")
    if os.environ.get("OPENROUTER_API_KEY"): avail.append("openrouter")
    if os.environ.get("OPENAI_API_KEY"): avail.append("openai-compatible")
    return avail
