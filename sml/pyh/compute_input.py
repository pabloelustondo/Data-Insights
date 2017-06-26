## compute_input.py

import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = [1,2,3,4]
    return json.loads(lines)

def main():

    print("Running Python")

    print("This is the name of the script: ", sys.argv[0])
    print("Number of arguments: ", len(sys.argv))
    print("The arguments are: " , str(sys.argv))

    #get our data as an array from read_in()
    lines = [1,2,3,4]

    morelines = sys.stdin.read(2);

    #create a numpy array
    print(lines)

    np_lines = np.array(lines)

    #use numpys sum method to find sum of all elements in the array
    lines_sum = np.sum(np_lines)

    #return the sum to the output stream
    print(lines_sum)

#start process
if __name__ == '__main__':
    main()