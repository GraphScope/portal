from abc import ABC, abstractmethod
from typing import List, Set

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
    def get_states(self, name: str, node_keys: List[str]) -> List[dict]:
        pass

    @abstractmethod
    def get_total_data(self) -> List[str]:
        pass

    @abstractmethod
    def get_total_states(self, name: str) -> List[str]:
        pass


class JsonFileStore(PersistentStore):
    def __init__(self, output_folder: str, lock=None):
        self.output_folder = output_folder
        self.current_name = ""
        self.current_folder = ""
        self.lock = threading.Lock()

    def use(self, name: str) -> str:
        """
        Set and retrieve the current folder for the given name. If the folder does not exist, it will be created.

        Args:
            name (str): The name used to determine the folder.

        Returns:
            str: The path to the current folder.
        """
        if name == self.current_name:
            return self.current_folder

        self.current_name = name
        self.current_folder = os.path.join(self.output_folder, name)

        os.makedirs(self.current_folder, exist_ok=True)
        return self.current_folder

    def save_state(self, name: str, node_key: str, state: dict):
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_path = os.path.join(current_folder, f"{node_key}.json")
            current_folder = self.use(name)
            # Save the state to a JSON file
            with open(file_path, "w+") as json_file:
                json.dump(state, json_file, indent=4)

    def get_state(self, name: str, node_key: str) -> dict:
        with self.lock:
            current_folder = self.use(name)
            # Create a safe file name
            file_path = os.path.join(current_folder, f"{node_key}.json")

            if not os.path.exists(file_path):
                return None

            try:
                with open(file_path, "r") as f:
                    json_data = json.load(f)
                    return json_data
            except (IOError, json.JSONDecodeError) as e:
                logger.error(f"Error reading file {file_path}: {e}")
                return None

    def get_states(self, name: str, node_keys: List[str]) -> List[dict]:
        with self.lock:
            current_folder = self.use(name)
            results = []
            for node_key in node_keys:
                # Create a safe file name
                file_path = os.path.join(current_folder, f"{node_key}.json")
                if not os.path.exists(file_path):
                    continue
                try:
                    with open(file_path, "r") as f:
                        json_data = json.load(f)
                        results.append(json_data)
                except (IOError, json.JSONDecodeError) as e:
                    logger.error(f"Error reading file {file_path}: {e}")
                    continue
            return results

    def save_data(self, name: str, node_key: str, content: str, extension: str = "txt"):
        with self.lock:
            current_folder = self.use(name)
            file_path = os.path.join(current_folder, f"{node_key}.{extension}")

            # Save the state to a JSON file
            with open(file_path, "w+") as f:
                f.write(content)

    def get_total_data(self) -> List[str]:
        """
        Retrieves the list of non-hidden files and directories in the output folder.
        Ensures thread-safe access using a lock.

        Returns:
            List[str]: A list of visible file and directory names in the output folder.
        """
        with self.lock:
            try:
                # List all files and directories in the output folder
                items = os.listdir(self.output_folder)
                # Filter out items starting with a dot (e.g., hidden files/folders)
                visible_items = [
                    item
                    for item in items
                    if not item.startswith((".", "_"))
                    and item != "navigator"
                    and os.path.isdir(os.path.join(self.output_folder, item))
                ]
                return visible_items
            except Exception as e:
                return []

    def get_total_states(self, name: str) -> List[str]:
        with self.lock:
            current_folder = self.use(name)
            try:
                # List all files in the current folder and filter for .json files
                items = os.listdir(current_folder)
                json_items = [
                    os.path.splitext(item)[0]  # Get the file name without extension
                    for item in items
                    if item.endswith(".json") and not item.startswith((".", "_"))
                ]
                return json_items
            except Exception as e:
                return []
