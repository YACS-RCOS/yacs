require 'concurrent'
require 'oj'
require_relative 'concurrent_helper'

# Simple polling interface. Pollable#poll and Pollable#poll_with_retry, which asynchronously
# perform a network request to a JSON resource and resolve with the parsed response body
class Pollable
	include Concurrent::Promises::FactoryMethods
	include Concurrent::Promises::CustomHelpers

	attr_reader :name, :url

	# Creates a new Pollable
	#
	# @param [String] name the name of the source
	# @param [String] url the url of the source
	# @param [Config] config to be used by this instance
	def initialize name:, url:, config:
		@name = name
		@url = url
		@logger = config.logger.with_fields log_fields
		@connection = Faraday.new url: @url
	end

	# Polls the source url once
	#
	# @return [Future<Hash>]
	def poll 
		future { request }
			.then { |response| parse response }
			.then { |result| log_pass :info, :pollable_poll_success, result }
			.rescue { |reason| log_raise :warn, :pollable_poll_failure, reason }
	end

	# Polls the source, and retries if the request fails
	#
	# @param [Integer] delay how long we should wait between retries
	# @param [Integer] count how many times we should retry
	def poll_with_retry count:, delay:
		poll.rescue do
			if (count > 0) poll_with_retry delay: delay, count: count - 1
			else log_raise :error, :pollable_retries_exceeded
		end.flat
	end

	def log_fields
		{ pollable: { name: @name, url: @url } }
	end

	private

	# Makes a request to @url
	#
	# @return [Faraday::Response] the response from the request
	def request
		@connection.get
	end

	# Parses the JSON in the response body
	#
	# @param [Faraday::Response] response the response to parse
	# @return [Hash] parsed_response a hash containing the response data
	def parse response
		Oj.load response.body
	end
end
