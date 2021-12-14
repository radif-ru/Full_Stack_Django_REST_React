from django.contrib import admin

from .models import User, PermissionGroups, HitCount

admin.site.register(User)
admin.site.register(PermissionGroups)
admin.site.register(HitCount)
