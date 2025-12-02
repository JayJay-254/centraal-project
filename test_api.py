#!/usr/bin/env python
import requests
import json

base_url = "http://localhost:8000"

print("Testing Location APIs...")
print("=" * 50)

# Test 1: Counties API
print("\n1. Testing /api/counties/")
try:
    response = requests.get(f"{base_url}/api/counties/")
    data = response.json()
    counties = data.get('counties', [])
    print(f"✓ Status: {response.status_code}")
    print(f"✓ Counties found: {len(counties)}")
    print(f"✓ First 5: {counties[:5]}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 2: Constituencies API
print("\n2. Testing /api/constituencies/?county=Nairobi")
try:
    response = requests.get(f"{base_url}/api/constituencies/?county=Nairobi")
    data = response.json()
    constituencies = data.get('constituencies', [])
    print(f"✓ Status: {response.status_code}")
    print(f"✓ Constituencies found: {len(constituencies)}")
    print(f"✓ All constituencies: {constituencies}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 3: Signup template
print("\n3. Testing signup template")
try:
    response = requests.get(f"{base_url}/signup/")
    content = response.text
    has_script = "kenya-locations.js" in content
    has_county = 'id="county"' in content
    has_constituency = 'id="constituency"' in content
    print(f"✓ Status: {response.status_code}")
    print(f"✓ Has location JS: {has_script}")
    print(f"✓ Has county select: {has_county}")
    print(f"✓ Has constituency select: {has_constituency}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 4: Edit-profile template
print("\n4. Testing edit-profile template")
try:
    response = requests.get(f"{base_url}/edit-profile/")
    content = response.text
    has_script = "kenya-locations.js" in content
    has_county = 'id="editCounty"' in content
    has_constituency = 'id="editConstituency"' in content
    print(f"✓ Status: {response.status_code}")
    print(f"✓ Has location JS: {has_script}")
    print(f"✓ Has county select: {has_county}")
    print(f"✓ Has constituency select: {has_constituency}")
    if not has_script:
        # Debug: show end of response
        print("\n  Last 500 chars of response:")
        print(content[-500:])
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 50)
print("Testing complete!")
