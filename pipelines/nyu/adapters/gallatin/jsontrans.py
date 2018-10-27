import pandas as pd
import json

def format_data(unformatted_json):
	# This function takes in a JSON string in the API's format
	# and returns a JSON string in Yacs format

	# TODO Figure out how to divide work
	# between into pandas and json effectively
	data = json.loads(unformatted_json)

	df = pd.from_json(unformatted_json)

	return "FORMATTED_JSON_STRING"

def rename_attributes(unformatted_json):
	return "correctly named attributes"

def filter_results(unfiltered_json):
	return "filtered JSON"
