"""Create a test user, assign an AdminRole, and add a GalleryImage to verify admin flows.
Run with: python manage.py runscript scripts/create_admin_test.py or run via python -m django shell executing this file.
But we'll run it directly with manage.py shell -c import.
"""
import os
import django
from django.core.files import File

auth_user_model = None

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'central_adventures.settings')
django.setup()

from django.contrib.auth.models import User
from trips.models import AdminRole, GalleryImage, Trip

# Create user
username = 'testadmin'
if not User.objects.filter(username=username).exists():
    user = User.objects.create_user(username=username, email='testadmin@example.com', password='Testpass123')
    print('Created user', user.username)
else:
    user = User.objects.get(username=username)
    print('User exists:', user.username)

# Assign role
role, created = AdminRole.objects.get_or_create(user=user, defaults={'role':'it_dept'})
if created:
    print('Created AdminRole for', user.username)
else:
    print('AdminRole exists for', user.username)

# Create a TripCategory and Trip if none exists (for gallery foreignkey)
from trips.models import TripCategory
category = TripCategory.objects.first()
if not category:
    category = TripCategory.objects.create(name='Default')
    print('Created TripCategory', category.id)

trip = Trip.objects.first()
if not trip:
    trip = Trip.objects.create(title='Test Trip', category=category, location='Test Location', date='2025-12-31', image_url='', description_short='Short', description_full='Full')
    print('Created sample Trip', trip.id)

# Create a small placeholder image file in media for upload
media_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media', 'test_upload')
if not os.path.exists(media_dir):
    os.makedirs(media_dir)
img_path = os.path.join(media_dir, 'sample.png')
if not os.path.exists(img_path):
    # create a 1x1 PNG
    import base64
    png_b64 = (
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    )
    with open(img_path, 'wb') as f:
        f.write(base64.b64decode(png_b64))
    print('Wrote sample image to', img_path)

# Create GalleryImage
with open(img_path, 'rb') as f:
    django_file = File(f)
    gi = GalleryImage.objects.create(trip=trip, caption='Test image', uploaded_by=user)
    gi.image_url.save('sample.png', django_file, save=True)
    print('Created GalleryImage', gi.id, 'file saved to', gi.image_url.url)

print('Done')
