import os
from flask import Flask, Response


def serve(html_content):
    app = Flask(__name__)

    @app.route("/")
    def home():
        return Response(html_content, mimetype="text/html")

    app.run(debug=True, port=9999)
