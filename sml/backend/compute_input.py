## compute_input.py

import sys, json, numpy as np
import pandas as pd

#Read data from stdin
def read_in(lines):
	#lines = [1,2,3,4]
	return json.loads(lines)

def main():

	#print("Running Python")

	#print("This is the name of the script: ", sys.argv[0])
	#print("This is the name of the script: ", sys.argv[1])
	#print("This is the name of the script: ", sys.argv[2])

	#parameters
	#need to set parameters... will hardcode for now... btu this needs to come in another argument
	#i think the idea is to create a string that will ge texecuted


	
	code = sys.argv[1]
	
	exec(code)


	#get our data as an array from read_in()
	lines = [1,2,3,4]



	morelines = sys.stdin.readline();



	jlist = json.loads(morelines)
	

	data = pd.DataFrame(jlist)

	datajson = data.to_json(orient='records')

	dataout = json.loads(datajson)
	result = f(data)

	print(result.to_json(orient='records'))

#start process
if __name__ == '__main__':
	main()