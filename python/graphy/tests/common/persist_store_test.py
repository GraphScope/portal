import os
import pytest
import json
import shutil

from tempfile import TemporaryDirectory

from db import JsonFileStore  # Replace `your_module` with the actual module name


@pytest.fixture(scope="session")
def setup_test_environment():
    """
    Set up a temporary test environment shared across all tests.
    """
    temp_dir = TemporaryDirectory()
    output_folder = os.path.join(temp_dir.name, "graphyourdata", "persist_store_test")
    os.makedirs(output_folder, exist_ok=True)
    store = JsonFileStore(output_folder)
    yield output_folder, store
    # Cleanup after all tests are done
    temp_dir.cleanup()


@pytest.fixture
def mock_states():
    """
    Create mock states for testing purposes.
    """
    return {
        "Paper": {"data": {"id": "paper1", "content": "This is a test paper content."}},
        "Challenge": {
            "data": {"id": "challenge1", "details": "Challenge description."}
        },
        "Contribution": {
            "data": {"id": "contribution1", "summary": "Contribution summary."}
        },
        "Background": {"data": {"id": "background1", "context": "Background context."}},
        "Experiment": {"data": {"id": "experiment1", "results": "Experiment results."}},
    }


def test_save_and_get_state(setup_test_environment, mock_states):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    for node_key, state in mock_states.items():
        store.save_state(name, node_key, state)
        retrieved_state = store.get_state(name, node_key)
        assert retrieved_state == state


def test_get_state_nonexistent(setup_test_environment):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    node_key = "NonexistentNode"
    state = store.get_state(name, node_key)
    assert state is None


def test_get_states(setup_test_environment, mock_states):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    for node_key, state in mock_states.items():
        store.save_state(name, node_key, state)
    retrieved_states = store.get_states(name, list(mock_states.keys()))
    assert len(retrieved_states) == len(mock_states)
    for state in retrieved_states:
        assert state in mock_states.values()


def test_save_and_get_total_data(setup_test_environment, mock_states):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    for node_key, state in mock_states.items():
        store.save_state(name, node_key, state)
    total_data = store.get_total_data()
    assert name in total_data


def test_get_total_states(setup_test_environment, mock_states):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    for node_key, state in mock_states.items():
        store.save_state(name, node_key, state)
    total_states = store.get_total_states(name)
    assert sorted(total_states) == sorted(mock_states.keys())


def test_save_data(setup_test_environment):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    node_key = "TestNode"
    content = "This is test content for the node."
    store.save_data(name, node_key, content, extension="txt")
    file_path = os.path.join(temp_dir, name, f"{node_key}.txt")
    assert os.path.exists(file_path)
    with open(file_path, "r") as file:
        assert file.read() == content


def test_get_total_data_with_hidden_files(setup_test_environment):
    temp_dir, store = setup_test_environment
    os.makedirs(os.path.join(temp_dir, "_NAVIGATOR"), exist_ok=True)
    os.makedirs(os.path.join(temp_dir, "_hidden_folder"), exist_ok=True)
    os.makedirs(os.path.join(temp_dir, ".hidden_file"), exist_ok=True)
    total_data = store.get_total_data()
    assert "_NAVIGATOR" not in total_data
    assert "_hidden_folder" not in total_data
    assert ".hidden_file" not in total_data


def test_get_total_states_with_hidden_files(setup_test_environment, mock_states):
    temp_dir, store = setup_test_environment
    name = "test_workflow"
    for node_key, state in mock_states.items():
        store.save_state(name, node_key, state)
    with open(os.path.join(temp_dir, name, "_hidden.json"), "w") as f:
        json.dump({"hidden": "data"}, f)
    total_states = store.get_total_states(name)
    assert "_hidden" not in total_states
    assert sorted(total_states) == sorted(mock_states.keys())


def test_use_method_creates_directory(setup_test_environment):
    temp_dir, store = setup_test_environment
    name = "new_folder"
    folder_path = store.use(name)
    assert os.path.exists(folder_path)
    assert folder_path == os.path.join(temp_dir, name)


def test_use_method_same_folder(setup_test_environment):
    temp_dir, store = setup_test_environment
    name = "test_folder"
    folder_path1 = store.use(name)
    folder_path2 = store.use(name)
    assert folder_path1 == folder_path2
