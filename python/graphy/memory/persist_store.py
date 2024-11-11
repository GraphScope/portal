from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

import logging

logger = logging.getLogger(__name__)


class PersistentStore(ABC):
    @abstractmethod
    def get_state(self, id: str, key: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def save_state(self, id: str, key: str, state: Dict[str, Any]) -> None:
        pass


import os
import json
from typing import Any, Dict, Optional


class JsonFilePersistentStore(PersistentStore):
    def __init__(self, output_dir: str):
        self.output_dir = output_dir

    def get_state(self, id: str, key: str) -> Optional[Dict[str, Any]]:
        filename = os.path.join(self.output_dir, id, f"{key}.json")
        if not os.path.exists(filename):
            return None

        try:
            with open(filename, "r") as f:
                return json.load(f)
        except (IOError, json.JSONDecodeError) as e:
            logger.error(f"Error reading file {filename}: {e}")
            return None

    def save_state(self, id: str, key: str, state: Dict[str, Any]) -> None:
        output_dir = os.path.join(self.output_dir, id)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        filename = os.path.join(output_dir, f"{key}.json")
        try:
            with open(filename, "w") as f:
                json.dump(state, f, indent=4)
        except IOError as e:
            logger.error(f"Error writing file {filename}: {e}")
