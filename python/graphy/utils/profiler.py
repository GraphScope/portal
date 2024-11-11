import time
import functools
import threading


class Profiler:
    def __init__(self):
        self.enabled = False
        self.records = threading.local()
        self.records.data = []

    def start(self):
        self.enabled = True
        if not hasattr(self.records, "data"):
            self.records.data = []

    def stop(self):
        self.enabled = False

    def profile(self, func=None, name=None):
        if func is None:
            return lambda f: self.profile(f, name)

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if self.enabled:
                start_time = time.time()
                result = func(*args, **kwargs)

                # Handle generator functions
                if hasattr(result, "__iter__") and not isinstance(result, (str, bytes)):

                    def generator_wrapper():
                        try:
                            for value in result:
                                yield value
                        finally:
                            end_time = time.time()
                            elapsed_time = end_time - start_time
                            func_name = name if name else func.__name__
                            self.records.data.append((func_name, elapsed_time))

                    return generator_wrapper()  # Return a generator wrapper
                else:  # Non-generator case
                    end_time = time.time()
                    elapsed_time = end_time - start_time
                    func_name = name if name else func.__name__
                    self.records.data.append((func_name, elapsed_time))

                return result
            else:
                return func(*args, **kwargs)

        return wrapper

    def report(self):
        print("Profiling report:")
        if not hasattr(self.records, "data"):
            print("No profiling data available.")
            return

        thread_id = threading.get_ident()
        for func_name, elapsed_time in self.records.data:
            print(
                f"Thread ID: {thread_id}, Function '{func_name}' took {elapsed_time:.6f} seconds."
            )


profiler = Profiler()
