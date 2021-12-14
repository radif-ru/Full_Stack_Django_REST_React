from users.models import HitCount


class PatchCountMiddleware:
    """Подсчёт количества посещений страниц"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """Увеличение количества посещений страниц и сохранение в БД"""
        hc, created = HitCount.objects.get_or_create(url=request.path)
        hc.hits += 1
        hc.save()
        response = self.get_response(request)
        return response
