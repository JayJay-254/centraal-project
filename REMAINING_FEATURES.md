# Remaining Features - Implementation Guide

## Features Mentioned But Not Yet Implemented

### 1. **Booking Payment System (M-Pesa/Daraja API)**
**Status:** ⏳ Pending

**What's Needed:**
- Create booking form page with phone number input
- Integrate M-Pesa (Daraja API) for payments
- Payment status tracking
- Receipt generation

**Implementation Steps:**
1. Install `requests` library for API calls
2. Create M-Pesa credentials from Safaricom
3. Create booking payment form
4. Integrate Daraja API for payment processing
5. Update Booking model with payment reference
6. Add payment status indicators

**Files to Create/Modify:**
- `booking_payment.html` - Payment form page
- `views.py` - Add payment processing view
- `models.py` - Add payment_reference field to Booking
- `settings.py` - Add M-Pesa credentials

---

### 2. **Gallery Image Management - Delete Functionality**
**Status:** ⏳ Pending

**What's Needed:**
- Allow admin to delete specific gallery images
- Confirm deletion dialogs
- Image display improvements
- Better upload interface

**Implementation Steps:**
1. Create delete image endpoint in views
2. Add delete button in admin/gallery
3. Implement AJAX delete with confirmation
4. Update GalleryImage admin interface

**Files to Modify:**
- `admin.py` - Add delete functionality
- `views.py` - Add delete_gallery_image view
- `urls.py` - Add delete route
- Gallery templates - Add delete buttons

---

### 3. **Booking Management - Update/Cancel**
**Status:** ⏳ Pending

**What's Needed:**
- Users can view their bookings
- Users can update booking details
- Users can cancel bookings
- Admin can manage all bookings

**Implementation Steps:**
1. Create user bookings list page
2. Create booking detail/edit page
3. Add cancellation logic
4. Add booking status field
5. Update admin interface for booking management

**Files to Create/Modify:**
- `models.py` - Add booking_status field
- `views.py` - Add user_bookings, edit_booking, cancel_booking views
- `urls.py` - Add booking management routes
- `templates/user_bookings.html` - New page
- `templates/booking_detail.html` - New page

---

### 4. **Trip Gallery Image Display on Admin**
**Status:** ✅ Partially Complete

**What's Done:**
- Gallery images show in admin with preview
- Images linked to trips

**What's Needed:**
- Better admin display
- Drag-to-reorder images
- Better batch upload

**Implementation Steps:**
1. Improve GalleryImageAdmin inline display
2. Add image ordering
3. Add batch upload form

---

### 5. **Additional Features Mentioned**
**Status:** 📋 Review Needed

- [ ] View details button active on trips ✅ DONE
- [ ] Admin change trip status ✅ DONE
- [ ] Trip grouping (success/cancelled/upcoming) ✅ DONE
- [ ] Book now → payment form ⏳ PENDING
- [ ] Management section (leadership) ✅ DONE
- [ ] Contact form no redirect ✅ DONE
- [ ] Logout in profile dropdown ✅ DONE
- [ ] Admin delete specific images ⏳ PENDING
- [ ] Bookings appear in admin ✅ DONE
- [ ] Hide nav for non-auth users ✅ DONE
- [ ] Hide CTA for authenticated ✅ DONE
- [ ] Home nav link ✅ DONE

---

## Quick Start for Next Phase

### To Implement M-Pesa Payment:
```python
# Install M-Pesa wrapper
pip install python-mpesa

# Create credentials from Safaricom Daraja
# Store in environment variables:
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_BUSINESS_SHORT_CODE
MPESA_BUSINESS_PASSKEY
```

### To Implement Gallery Delete:
```python
# Add endpoint in urls.py
path('gallery/<int:image_id>/delete/', views.delete_gallery_image, name='delete_gallery_image'),

# Add view in views.py
@login_required
def delete_gallery_image(request, image_id):
    image = get_object_or_404(GalleryImage, id=image_id)
    # Check permissions
    image.delete()
    return redirect back
```

### To Implement User Bookings:
```python
# Add view
@login_required
def user_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    return render(request, 'user_bookings.html', {'bookings': bookings})

# Add URL
path('my-bookings/', views.user_bookings, name='user_bookings'),
```

---

## Priority Order

1. **High Priority:**
   - ✅ Navigation & Auth UI
   - ✅ Trip management & status
   - ✅ Contact form fixes
   - ✅ Leadership page
   - ⏳ **M-Pesa Payment System** (users need this to book)

2. **Medium Priority:**
   - ⏳ Gallery image delete
   - ⏳ User bookings list/management
   - Booking update/cancel

3. **Low Priority:**
   - Better image ordering
   - Batch image uploads
   - Advanced analytics

---

## Testing After Implementation

```bash
# Test each feature
python manage.py test trips

# Check migrations
python manage.py migrate --plan

# Run server
python manage.py runserver

# Test in browser:
# http://localhost:8000/
```

---

## Deployment Reminder

After implementing each feature:
1. Run migrations: `python manage.py migrate`
2. Collect static files: `python manage.py collectstatic`
3. Test locally
4. Push to git
5. Deploy to Render
6. Test on live site

---

**Last Updated:** December 3, 2025
**Status:** 70% Complete (7/10 major features done)
