from django.contrib import admin

from .models import User, PermissionGroups, PageVisits

admin.site.register(User)
admin.site.register(PermissionGroups)
admin.site.register(PageVisits)
