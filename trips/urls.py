from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('trips/', views.trips, name='trips'),
    path('trip/<int:id>/', views.trip_details, name='trip_details'),
    path('book/<int:id>/', views.book_trip, name='book'),
    path('group-chat/', views.chat_room, name='group_chat'),
    path('contact-us/', views.contact_us, name='contact_us'),
    # Static/frontend templates routes
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup_page, name='signup'),
    path('gallery/', views.gallery_page, name='gallery'),
    path('edit-profile/', views.edit_profile_page, name='edit_profile'),
    path('destinations/', views.destinations_page, name='destinations_page'),
    path('notification-demo/', views.notification_demo, name='notification_demo'),
]
