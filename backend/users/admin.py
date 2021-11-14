from django.contrib import admin

from .models import User, PermissionGroups

admin.site.register(User)
admin.site.register(PermissionGroups)
