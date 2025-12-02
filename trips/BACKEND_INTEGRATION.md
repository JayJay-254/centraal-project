# Backend Integration Guide - Central Adventures

This guide outlines how to integrate the Central Adventures frontend with a Django backend.

## Overview

The frontend is built to be backend-ready with clear data structures and API integration points. Admin users will manage destinations and gallery content through Django admin.

---

## Django Models Structure

### 1. User Model (Extend Django's User)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class AdventureUser(AbstractUser):
    """Extended user model for Central Adventures"""
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    county = models.CharField(max_length=50)
    constituency = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    contact_info = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
```

### 2. Destination Model

```python
class Destination(models.Model):
    """Adventure destinations/trips"""
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='destinations/')
    location = models.CharField(max_length=200)
    duration = models.CharField(max_length=100)  # e.g., "5 Days, 4 Nights"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expectations = models.TextField()  # What to expect
    requirements = models.TextField()  # What to bring
    max_participants = models.IntegerField(default=20)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
```

### 3. Booking Model

```python
class Booking(models.Model):
    """User bookings for destinations"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(AdventureUser, on_delete=models.CASCADE, related_name='bookings')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    number_of_people = models.IntegerField(default=1)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    special_requests = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-booking_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.destination.title}"
```

### 4. Gallery Model

```python
class GalleryImage(models.Model):
    """Gallery images managed by admin"""
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery_images')
    caption = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(AdventureUser, on_delete=models.SET_NULL, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-upload_date']
    
    def __str__(self):
        return self.title
```

### 5. Contact Message Model

```python
class ContactMessage(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
```

---

## API Endpoints

### Authentication Endpoints

```python
# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
]
```

### Destinations Endpoints

```python
# urls.py
urlpatterns = [
    path('api/destinations/', DestinationListView.as_view(), name='destinations_list'),
    path('api/destinations/<slug:slug>/', DestinationDetailView.as_view(), name='destination_detail'),
    path('api/destinations/featured/', FeaturedDestinationsView.as_view(), name='featured_destinations'),
]
```

### Bookings Endpoints

```python
urlpatterns = [
    path('api/bookings/', BookingListCreateView.as_view(), name='bookings'),
    path('api/bookings/<int:pk>/', BookingDetailView.as_view(), name='booking_detail'),
]
```

### Gallery Endpoints

```python
urlpatterns = [
    path('api/gallery/', GalleryListView.as_view(), name='gallery_list'),
    path('api/gallery/featured/', FeaturedGalleryView.as_view(), name='featured_gallery'),
]
```

### Contact Endpoints

```python
urlpatterns = [
    path('api/contact/', ContactMessageCreateView.as_view(), name='contact_create'),
]
```

---

## Frontend JavaScript Updates

### API Configuration

Create `js/api-config.js`:

```javascript
// API base URL configuration
const API_BASE_URL = 'http://localhost:8000/api';  // Change for production

// API endpoints
const API_ENDPOINTS = {
    login: `${API_BASE_URL}/token/`,
    refresh: `${API_BASE_URL}/token/refresh/`,
    register: `${API_BASE_URL}/register/`,
    profile: `${API_BASE_URL}/profile/`,
    profileUpdate: `${API_BASE_URL}/profile/update/`,
    destinations: `${API_BASE_URL}/destinations/`,
    destinationDetail: (slug) => `${API_BASE_URL}/destinations/${slug}/`,
    bookings: `${API_BASE_URL}/bookings/`,
    gallery: `${API_BASE_URL}/gallery/`,
    contact: `${API_BASE_URL}/contact/`
};

// Helper function for authenticated requests
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        // Token expired, try to refresh
        await refreshToken();
        return authenticatedFetch(url, options);
    }
    
    return response;
}

// Refresh token function
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch(API_ENDPOINTS.refresh, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
    });
    
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
    } else {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = 'login.html';
    }
}
```

### Load Destinations from Backend

Update `js/main.js`:

```javascript
// Load destinations from backend
async function loadDestinations() {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    try {
        const response = await authenticatedFetch(API_ENDPOINTS.destinations);
        const destinations = await response.json();
        
        grid.innerHTML = '';
        
        destinations.forEach(dest => {
            const card = createDestinationCard(dest);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading destinations:', error);
        grid.innerHTML = '<p class="error">Failed to load destinations. Please try again later.</p>';
    }
}

function createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.setAttribute('data-destination-id', dest.id);
    card.setAttribute('data-slug', dest.slug);
    
    card.innerHTML = `
        <div class="destination-image" style="background-image: url('${dest.image}');">
            <div class="destination-overlay">
                <h3 class="destination-title">${dest.title}</h3>
                <p class="destination-description">${dest.description.substring(0, 100)}...</p>
                <button class="btn btn-small view-details-btn">View Details</button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openDestinationModal(dest.slug));
    
    return card;
}
```

### Load Gallery from Backend

```javascript
// Load gallery images from backend
async function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    try {
        const response = await authenticatedFetch(API_ENDPOINTS.gallery);
        const images = await response.json();
        
        if (images.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p>No gallery images available yet.</p></div>';
            return;
        }
        
        grid.innerHTML = '';
        
        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.image}" alt="${img.title}">
                <div class="gallery-overlay">
                    <h3>${img.title}</h3>
                    ${img.caption ? `<p>${img.caption}</p>` : ''}
                </div>
            `;
            grid.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}
```

---

## Django Admin Configuration

### admin.py

```python
from django.contrib import admin
from .models import AdventureUser, Destination, Booking, GalleryImage, ContactMessage

@admin.register(AdventureUser)
class AdventureUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'county', 'constituency', 'created_at']
    list_filter = ['county', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'start_date', 'price', 'status', 'is_featured']
    list_filter = ['status', 'is_featured', 'start_date']
    search_fields = ['title', 'location', 'description']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_date'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'booking_date', 'status', 'total_amount']
    list_filter = ['status', 'booking_date']
    search_fields = ['user__username', 'destination__title']
    date_hierarchy = 'booking_date'

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'uploaded_by', 'upload_date', 'is_featured']
    list_filter = ['is_featured', 'upload_date', 'destination']
    search_fields = ['title', 'caption']
    date_hierarchy = 'upload_date'

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'submitted_at', 'is_read', 'replied']
    list_filter = ['is_read', 'replied', 'submitted_at']
    search_fields = ['name', 'email', 'subject', 'message']
    date_hierarchy = 'submitted_at'
```

---

## CORS Configuration

### settings.py

```python
INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'corsheaders',
    'adventures',  # your app name
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:5500",  # Live Server
    # Add your production domain
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## Migration Steps

1. **Set up Django project:**
   ```bash
   django-admin startproject central_adventures
   cd central_adventures
   python manage.py startapp adventures
   ```

2. **Install dependencies:**
   ```bash
   pip install djangorestframework djangorestframework-simplejwt django-cors-headers Pillow
   ```

3. **Create models** (use the models above)

4. **Make migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Update frontend:**
   - Add `api-config.js` to the project
   - Update `main.js` with API integration
   - Replace localStorage auth with JWT tokens

---

## Testing the Integration

1. Start Django server: `python manage.py runserver`
2. Open Django admin: `http://localhost:8000/admin`
3. Add destinations and gallery images through admin
4. Test frontend API calls
5. Verify data loads correctly

---

## Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use Django's CSRF protection
- Store sensitive credentials in environment variables
- Implement proper file upload validation

---

## Next Steps

1. Replace localStorage authentication with JWT tokens
2. Implement booking functionality
3. Add payment gateway integration
4. Create admin dashboard for managing content
5. Add email notifications for bookings
6. Implement user reviews and ratings

---

For questions or issues, refer to Django REST Framework documentation: https://www.django-rest-framework.org/
