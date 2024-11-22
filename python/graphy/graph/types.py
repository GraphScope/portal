from typing import Dict, Any, TypeAlias, Generator

DataType: TypeAlias = Dict[str, Any]
DataGenerator: TypeAlias = Generator[DataType, None, None]
