"""
    __init__.py for the config package
"""

# config.py
import os
import sys

import tempfile
import os

# Get the path of the system's temporary directory
work_dir = tempfile.gettempdir()


# Some global parameters
WF_STATE_CACHE_KEY = "caches"
WF_STATE_MEMORY_KEY = "memory_manager"
WF_STATE_EXTRACTOR_KEY = "pdf_extractor"
WF_DATA_DIR = os.path.join(work_dir, "graphyourdata")
WF_OUTPUT_DIR = os.path.join(WF_DATA_DIR, "output")
WF_VECTDB_DIR = os.path.join(WF_DATA_DIR, "vectdb")
WF_UPLOADS_DIR = os.path.join(WF_DATA_DIR, "uploads")
WF_DOWNLOADS_DIR = os.path.join(WF_DATA_DIR, "downloads")
WF_IMAGE_DIR = os.path.join(WF_DATA_DIR, "img_store")
WF_WEBDATA_DIR = os.path.join(WF_DATA_DIR, "webdata")
WF_PDF_DOWNLOAD_DIR = os.path.join(WF_DATA_DIR, "navigator")
