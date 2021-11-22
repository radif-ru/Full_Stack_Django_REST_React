from django.urls import path

from projects.views import ProjectModelViewSet

app_name = 'projects'
urlpatterns = [
    path('', ProjectModelViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }))
]
