import httpx

client = httpx.Client(base_url="http://127.0.0.1:8000")

# 1. Test Login
login_res = client.post("/api/auth/login", json={"email": "demo@skinsense.ai", "password": "demo1234"})
assert login_res.status_code == 200, f"Login failed: {login_res.text}"
token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("[PASS] Auth Login OK")

# 2. Test Get Routine
routine_res = client.get("/api/user-products", headers=headers)
assert routine_res.status_code == 200
prods = routine_res.json()
print(f"[PASS] User Routine OK: {len(prods)} products found")

# 3. Test Feature 1: AI Experience Analysis
exp_res = client.post("/api/experience", headers=headers, json={
    "product_id": prods[0]["product_id"],
    "natural_language_feedback": "I have been using a salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry.",
    "duration_weeks": 3,
    "frequency_used": "Daily"
})
assert exp_res.status_code == 200
exp_data = exp_res.json()
print("[PASS] Feature 1 (Experience Intelligence) OK:")
print("  - Extracted Concern:", exp_data["primary_concern"])
print("  - Positives:", exp_data["positive_outcomes"])
print("  - Negatives:", exp_data["negative_outcomes"])
print("  - Classification:", exp_data["classification"])
print("  - Working Summary:", exp_data["ai_working_summary"][:60], "...")
print("  - Safe Next Steps Count:", len(exp_data["ai_safe_next_steps"]))

# 4. Test Feature 2: AI Routine Conflict Checker
check_res = client.post("/api/routine/analyze", headers=headers, json={
    "product_ids": [p["product_id"] for p in prods],
    "routine_category": "skincare"
})
assert check_res.status_code == 200
check_data = check_res.json()
print("[PASS] Feature 2 (Routine Conflict Checker) OK:")
print("  - Score:", check_data["overall_score"])
print("  - Conflicts Detected:", len(check_data["identified_conflicts"]))
for c in check_data["identified_conflicts"]:
    print(f"    * {c['title']} [{c['risk_level']}]")
print("  - AM Steps:", len(check_data["structured_am_routine"]))
print("  - PM Steps:", len(check_data["structured_pm_routine"]))

# 5. Test AI Assistant Chat
chat_res = client.post("/api/assistant/chat", headers=headers, json={
    "message": "Why does my skin feel dry after using these products?"
})
assert chat_res.status_code == 200
chat_data = chat_res.json()
print("[PASS] AI Assistant OK:")
print("  - Response snippet:", chat_data["response"][:90], "...")
print("  - Citations:", [c["source"] for c in chat_data["citations"]])
print("  - Source Engine:", chat_data.get("source"))
print("  - Model Identified:", chat_data.get("model"))

# 6. Test Gemini Health Connectivity Endpoint
health_res = client.get("/api/health/gemini")
assert health_res.status_code == 200
health_data = health_res.json()
print("[PASS] Gemini Health Endpoint OK:")
print("  - Status:", health_data.get("status"))
print("  - Configured:", health_data.get("configured"))
print("  - Connected:", health_data.get("connected"))
print("  - Target Model:", health_data.get("model"))
print("  - Message:", health_data.get("message"))

# 7. Test Admin Analytics
admin_login = client.post("/api/auth/login", json={"email": "admin@skinsense.ai", "password": "admin1234"})
admin_token = admin_login.json()["access_token"]
admin_res = client.get("/api/admin/analytics", headers={"Authorization": f"Bearer {admin_token}"})
assert admin_res.status_code == 200
admin_data = admin_res.json()
print("[PASS] Admin Analytics OK:")
print("  - Total Anonymized Logs:", admin_data["total_anonymized_logs"])
print("  - Top Complaint:", admin_data["most_frequent_unwanted_effects"][0])
print("\nALL BACKEND & AI INTEGRATION TESTS PASSED!")
