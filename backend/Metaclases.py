class IterAttrs(type):
    """Метакласс возвращает итератор из аттрибутов"""
    def __iter__(self):
        for attr in dir(self):
            if not attr.startswith("__"):
                yield attr


class IterAttrValues(type):
    """Метакласс возвращает итератор из значений аттрибутов"""
    def __iter__(self):
        for attr in dir(self):
            if not attr.startswith("__"):
                yield getattr(self, attr, None)
