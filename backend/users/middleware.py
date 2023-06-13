from users.models import PageVisits


class PageVisitsMiddleware:
    """Подсчёт количества посещений страниц"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """Увеличение количества посещений страниц и сохранение в БД"""
        if request.user.is_authenticated:
            hc, created = PageVisits.objects.get_or_create(
                url=request.path, user=request.user)
            hc.user = request.user
        else:
            hc, created = PageVisits.objects.get_or_create(url=request.path,
                                                           user=None)
        hc.hits += 1
        hc.save()
        response = self.get_response(request)
        return response
