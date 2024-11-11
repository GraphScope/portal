from rtree import index
import logging

logger = logging.getLogger(__name__)


class RectangleInfo:
    def __init__(self, line_content: str) -> None:
        self.line_content = line_content


class PDFRectangle:
    def __init__(self, rect_id, x0, y0, x1, y1, info):
        self.id = rect_id
        self.x0 = x0
        self.y0 = y0
        self.x1 = x1
        self.y1 = y1
        self.info = info

    def bounds(self):
        return (
            self.x0,
            self.y0,
            self.x1,
            self.y1,
        )


class PDFContentIndex:
    def __init__(self) -> None:
        self.rtree = self.create_rtree()

    def create_rtree(self):
        return index.Index()

    def add_rectangle(self, rectangle: PDFRectangle):
        self.rtree.insert(rectangle.id, rectangle.bounds(), obj=rectangle)

    def refine_ord(self, x0, y0, x1, y1):
        valid = True
        if x1 <= x0:
            x1 = x0 + 1
            valid = False
        if y1 <= y0:
            y1 = y0 + 1
            valid = False

        if not valid:
            logger.error(f"Invalid coordination ({x0, y0, x1, y1})")
        return x0, y0, x1, y1

    def query_intersecting_rectangles(self, x0, y0, x1, y1):
        query_box = self.refine_ord(x0, y0, x1, y1)
        return [
            rectangle for rectangle in self.rtree.intersection(query_box, objects=True)
        ]

    def query_nearst_rectangles(self, x0, y0, x1, y1, query_num=1):
        query_box = self.refine_ord(x0, y0, x1, y1)
        return [
            rectangle
            for rectangle in self.rtree.nearest(query_box, query_num, objects=True)
        ]
