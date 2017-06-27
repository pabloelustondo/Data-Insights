def read(filename):
    try:
        file = open(filename).read()
        return 0, file
    except FileNotFoundError:
        return -1, None


