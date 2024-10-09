import os
from .render import render, get_html


def modeling():
    template_content = get_html("modeling")
    render(template_content)


def querying():
    template_content = get_html("querying")
    render(template_content)
