import os

def in_notebook():
    """Check if the code is running in a Jupyter Notebook."""
    try:
        from IPython import get_ipython
        if 'IPKernelApp' in get_ipython().config:
            return True
    except:
        pass
    return False

def in_ipython():
    """Check if the code is running in an IPython environment."""
    try:
        from IPython import get_ipython
        return get_ipython() is not None
    except ImportError:
        return False

def in_python_cli():
    """Check if the code is running in the standard Python CLI."""
    return not in_notebook() and not in_ipython()

def is_running_in_jupyter_env_var():
    """Check if the code is running in Jupyter by looking for a specific environment variable."""
    return os.getenv('RUNNING_IN_JUPYTER') == 'yes'

def detect_environment():
    """Detect the current Python running environment."""
    if in_notebook():
        return "Jupyter Notebook"
    elif in_ipython():
        return "IPython"
    elif in_python_cli():
        return "Python CLI"
    elif is_running_in_jupyter_env_var():
        return "Jupyter (via env var)"
    else:
        return "Unknown"

 
