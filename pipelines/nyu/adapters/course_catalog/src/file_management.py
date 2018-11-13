from queue import Queue
import threading
import os


data_queue = Queue() # Scrapers add to this, data formatters consume from this
write_queue = Queue() # Data formatters produce to this, file writer consumes from this
file_dict = {} # Dictionary of which files are available and which are not
file_dict_lock = threading.Lock() # Lock to use/write to file_dictionary

def add_entry(entry_dict):
    data_queue.put(entry)

def get_entry():
    return data_queue.get()

def add_filedata(path, data):
    write_queue.put((path, data))

def get_filedata():
    return write_queue.get()

# Open a file at a path safely
def opens(path,mode = 'r'):
    global file_dict_lock
    path = os.path.abspath(path)
    with file_dict_lock:
        if path in file_dict:
            file_lock = file_dict[path]
        else:
            file_lock = threading.Lock()
            file_dict[path] = file_lock
    with file_lock:
        file = open(path, mode)
    return file

# Simply way to update a file. Ideally this would write to a temp file then perform a swap,
# but that's annoyingly complicated
def update_file(from,to):
    with opens(from,'r') as f:
        data = f.read()
    with opens(to,'w') as f:
        f.write(data)


# To use threading effectively, we want to stay hyper-IO bound
#

# Information queue (Tuples of catalog number and json entries)
# Producer: scraper(s)
# Consumer: file writer(s)

# Filename queue (which file to read/write to)
# Producer/Consumer: File writer
# Producer/Consumer: get request handler

# Write to /temp/:term_shortname files
# When possible and necessary, do a swap operation to changed files (This operation must be thread safe)
# Otherwise, just sit still
# Rate limit the swapping (can only happen after x many seconds)
