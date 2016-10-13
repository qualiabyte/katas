
# Stock Prices Kata (Amazon EC2)

Question: How would you design a system for providing access to simple stocks data? Assume the data includes the following daily prices for each stock: open, close, high, low.

## Overview

Solution 1: Use an EC2 instance to both store data and handle client requests.

Tools:

+ OS - Ubuntu Linux 16.04 LTS
+ Platform - Node.js
+ Language - JavaScript
+ REST API - Express
+ Database - MongoDB / PostgreSQL
+ Caching  - Redis / Memcached
+ Search   - ElasticSearch

Solution 2: An alternative is to store data separately, which has the advantage of separation of concerns, scalability, and data integrity, but trade-offs of possibly increased cost and complexity.

Storage: Amazon offers the following storage services, among others.

+ S3 - Simple Storage Service for object data
+ RDS - Relational Database Service for managed databases
+ DynamoDB - NoSQL Database for schema-less data
+ EBS - Elastic Block Store for EC2 instances
+ EFS - Elastic File System for multiple EC2 instances
+ Redshift - Data warehousing for large amounts of data
+ Glacier - Archival of infrequently accessed data

Analytics: Amazon also offers the following tools for analytics.

+ HBase - Petabyte-scale, consistent, NoSQL database
+ Elasticsearch - Search and analytics for logs, real-time monitoring, event streams
+ Kinesis - Load, process, analyze high-volume datastreams

## Details

The original question in CtCI states the service is used by 1000 client applications. Possible solutions explored included storing the stocks data in simple files (FTP), in a database server (SQL), or an XML file.

A natural alternative is a REST API, serving stock information in a client-readable format (JSON), allowing queries for data about individual stocks or multiple stocks via portfolios, indexes, or custom searches.

## Data Size

Sampling some of the large stock markets and popular indexes in the U.S., we find a little over 5,000 publicly traded companies.

    NASDAQ: 3058
    NYSE: 2400
    Dow Jones: 30
    S&P 500: 505

With 6,000 U.S. stocks and 4 bytes of information per stock, we can store a daily summary of their performance in a mere 24 KB! This is an optimistic estimate, which assumes we can store stock prices as 32-bit values, for example an integer representing the number of cents per share. Note that when represented in non-binary format like JSON, each value would require more space.

    Database Size = 6000 stocks * 4 bytes/stock = 24 KB

## Response Format

A convenient response format would be a JSON dictionary which maps stock names to another object with the daily prices for that stock.

{
  "ADBE": { "open": 107.65, "close": 108.05, "high": 108.60, "low": 106.20 },
  "AMD": { "open": 6.64, "close": 6.62, "high": 6.77, "low": 6.42 },
  "AAPL": { "open": 117.36, "close": 117.34, "high": 117.98, "low": 116.75 },
  "GOOG": { "open": 811.96, "close": 811.77, "high": 814.50, "low": 808.5545 },
  ...
}
