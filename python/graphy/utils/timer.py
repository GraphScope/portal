import time


class TimeRecord:
    def __init__(self, record_name: str) -> None:
        self.start_time = None
        self.end_time = None
        self.name = record_name

    def get_start_time(self):
        if self.start_time is None:
            print("Start time is not set")
            return -1
        else:
            return self.start_time

    def get_end_time(self):
        if self.end_time is None:
            print("End time is not set")
            return -1
        else:
            return self.end_time

    def set_start_time(self, time):
        self.start_time = time

    def set_end_time(self, time):
        self.end_time = time

    def get_interval(self):
        if self.start_time is None:
            print("Start time is not set")
            return -1
        elif self.end_time is None:
            print("End time is not set")
            return -1
        else:
            return self.end_time - self.start_time

    def reset(self):
        self.start_time = None
        self.end_time = None


class Timer:
    def __init__(self):
        # record_name -> TimeRecord
        self.record_times = {}

    def _get_current_time(self):
        return time.time()

    def start(self, name):
        if name not in self.record_times:
            self.record_times[name] = TimeRecord(name)

        self.record_times[name].set_start_time(self._get_current_time())
        return self.record_times[name].get_start_time()

    def stop(self, name):
        if name not in self.record_times:
            print("Time record named " + name + " is not found")
            return -1

        self.record_times[name].set_end_time(self._get_current_time())
        return self.record_times[name].get_end_time()

    def delete(self, name):
        if name in self.record_times:
            self.record_times.pop(name)

    def reset(self, name):
        if name not in self.record_times:
            print("Time record named " + name + " is not found")
            return -1

        self.record_times[name].reset()

    def print(self):
        return
        print("The time costs are as follows: ")
        for k, v in self.record_times.items():
            print(k + ": " + str(v.get_interval()))
