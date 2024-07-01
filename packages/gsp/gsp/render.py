from typing import Union
from IPython.display import display, HTML
from .server import serve
from .environment_detection import detect_environment
import os
import random
import string


# 生成随机字符串的函数
def get_random_id():
    return "root-" + "".join(
        random.choices(string.ascii_lowercase + string.digits, k=9)
    )


def get_html(type="modeling"):
    try:
        with open(
            os.path.join(os.path.dirname(__file__), f"template/{type}.html"),
            "r",
            encoding="utf-8",
        ) as f:
            template_content = f.read()

            template_content = template_content.replace("ROOT_ID", get_random_id())
            return template_content
    except FileNotFoundError:
        print("Template file not found.")


def render(
    html: Union[str, HTML],
):
    ENV = detect_environment()
    if ENV == "Jupyter Notebook":
        display(HTML(html))
    if ENV == "Python CLI":
        serve(html)
    return html
