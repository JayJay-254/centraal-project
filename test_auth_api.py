#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'central_adventures.settings')
django.setup()

from django.contrib.auth.models import User
from trips.models import UserProfile
from django.test import Client
import json

# Create a test user
test_user, created = User.objects.get_or_create(
    username='testuser',
    defaults={
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'User'
    }
)

if created:
    test_user.set_password('testpass123')
    test_user.save()
    print(f"Created test user: {test_user.username}")
    
    # Create UserProfile
    profile, _ = UserProfile.objects.get_or_create(
        user=test_user,
        defaults={
            'age': 30,
            'county': 'Nairobi',
            'constituency': 'Westlands'
        }
    )
    print(f"Created profile for {test_user.username}")
else:
    print(f"Test user already exists: {test_user.username}")

# Create client and log in
client = Client()
logged_in = client.login(username='testuser', password='testpass123')
print(f"Logged in: {logged_in}")

# Test the edit-profile page
print("\nTesting /edit-profile/ with authenticated user:")
response = client.get('/edit-profile/')
print(f"Status: {response.status_code}")

content = response.content.decode('utf-8')
has_script = "kenya-locations.js" in content
has_county = 'id="editCounty"' in content
has_constituency = 'id="editConstituency"' in content

print(f"Has location JS: {has_script}")
print(f"Has county select: {has_county}")
print(f"Has constituency select: {has_constituency}")

if not has_script or not has_county or not has_constituency:
    print("\nEnd of response (last 800 chars):")
    print(content[-800:])
