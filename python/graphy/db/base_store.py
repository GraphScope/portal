from abc import ABC, abstractmethod

import os
import json
import re
import logging
import threading

logger = logging.getLogger(__name__)


class PersistentStore(ABC):
    @abstractmethod
    def save_state(self, name: str, node_key: str, state: dict):
        pass

    @abstractmethod
    def get_state(self, name: str, node_key: str) -> dict:
        pass

    @abstractmethod
    def save_query(self, name: str, node_key: str, query: str):
        pass


class JsonFileStore(PersistentStore):
    def __init__(self, output_folder: str, lock=None):
        self.output_folder = output_folder
        self.lock = threading.Lock()

    def use(self, name: str) -> str:
        current_folder = os.path.join(self.output_folder, name)
        if not os.path.exists(current_folder):
            os.makedirs(current_folder, exist_ok=True)
        return current_folder

    def save_state(self, name: str, node_key: str, state: dict):
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_name = re.sub(r"[^a-zA-Z0-9]", "_", node_key.strip())
            file_path = os.path.join(current_folder, f"{file_name}.json")
            current_folder = self.use(name)
            # Save the state to a JSON file
            with open(file_path, "w+") as json_file:
                json.dump(state, json_file, indent=4)

    def get_state(self, name: str, node_key: str) -> dict:
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_name = re.sub(r"[^a-zA-Z0-9]", "_", node_key.strip())
            file_path = os.path.join(current_folder, f"{file_name}.json")

            if not os.path.exists(file_path):
                return None

            try:
                with open(file_path, "r") as f:
                    json_data = json.load(f)
                    return json_data
            except (IOError, json.JSONDecodeError) as e:
                logger.error(f"Error reading file {file_path}: {e}")
                return None

    def save_query(self, name: str, node_key: str, query: str):
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_name = re.sub(r"[^a-zA-Z0-9]", "_", node_key.strip())
            file_name = "query_" + file_name
            file_path = os.path.join(current_folder, f"{file_name}.txt")

            # Save the state to a JSON file
            with open(file_path, "w+") as f:
                f.write(query)

    def save_text(self, name: str, node_key: str, content: str):
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_name = re.sub(r"[^a-zA-Z0-9]", "_", node_key.strip())
            file_path = os.path.join(current_folder, f"{file_name}")
            # Save the state to a JSON file
            with open(file_path, "w+") as fw:
                fw.write(content)

    def get_text(self, name: str, node_key: str) -> str:
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_name = re.sub(r"[^a-zA-Z0-9]", "_", node_key.strip())
            file_path = os.path.join(current_folder, f"{file_name}")
            if not os.path.exists(file_path):
                return None
            try:
                with open(file_path, "r") as f:
                    data = "".join(f.readlines())
                    return data
            except (IOError, json.JSONDecodeError) as e:
                logger.error(f"Error reading file {file_path}: {e}")
                return None
