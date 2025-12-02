from django.contrib import admin
from .models import UserProfile

# Register profile so superusers can manage profiles in admin
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'age', 'county', 'constituency', 'contact_info')
	search_fields = ('user__username', 'user__email', 'county', 'constituency')
