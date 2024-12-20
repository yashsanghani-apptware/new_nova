
# Query Listings API Documentation

## Overview

The `queryListings` API allows you to search for listings based on various query parameters. You can perform simple searches, nested searches, and use comparison operators to filter the listings based on your requirements.

## Simple Search

You can perform a simple search by specifying key-value pairs in the query string. For example, to search for listings by name:

```bash
GET {{url}}/api/listings/query?name=exampleName
```

## Nested Search

To search within nested fields, use dot notation in the query string. For example, to search for listings by the city in the address:

```bash
GET {{url}}/api/listings/query?address.city=Springfield
```

## Using Comparison Operators

You can use comparison operators to perform advanced searches by filtering based on specific conditions. The following are some common comparison operators and examples of how to use them:

- **$eq**: Matches values of the fields that are equal to a specified value.
- **$ne**: Matches all values of the field that are not equal to a specified value.
- **$gt**: Matches values of the fields that are greater than a specified value.
- **$gte**: Matches values of the fields that are greater than or equal to a specified value.
- **$lt**: Matches values of the fields that are less than a specified value.
- **$lte**: Matches values of the fields that are less than or equal to a specified value.
- **$in**: Matches any of the values specified in an array.
- **$nin**: Matches none of the values specified in an array.

### Examples of Using Comparison Operators

- To find listings that have been on the market for more than 90 days:
  
  ```bash
  GET {{url}}/api/listings/query?days_on_market[$gt]=90
  ```

- To find listings with a price less than $500,000:

  ```bash
  GET {{url}}/api/listings/query?price[$lt]=500000
  ```

- To find listings in specific cities:

  ```bash
  GET {{url}}/api/listings/query?address.city[$in]=[NewYork,LosAngeles]
  ```
