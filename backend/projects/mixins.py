from rest_framework import status
from rest_framework.response import Response


class ProjectDestroyMixin:
    def destroy(self, request, *args, **kwargs):
        """ Переопределения метода удаления (DELETE)
        Вместо фактического удаления меняем активность на 0 (False)
        """
        instance = self.get_object()
        instance.is_active = 0
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
