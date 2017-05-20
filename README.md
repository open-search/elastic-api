# Elasticsearch API

An API to Elasticsearch.

## GET /search[/?q=query[&type=type1,type2][&from=10][&size=10][&sort=asc][&filter=field][&lte=value][&gte=value]]

## GET /search/:index/:type/:id

Get by id. The id is the Elasticsearch id and must have an index and type.

## GET /more

More like this.

## GET /indices

## Running

When running locally, make sure an Elasticsearch instance is running. Environment variables that need to be set are:

```
ELASTICSEARCH_HOST=http://localhost
ELASTICSEARCH_PORT=9200
PORT=3333
```

Example docker run command (assuming you are in the api directory):

```
docker run --name test-api \
  -e "ELASTICSEARCH_HOST=test-elasticsearch" \
  -e "ELASTICSEARCH_PORT=9200" \
  -e "PORT=3333" \
  --link test-elasticsearch \
  -p 3333:3333 \
  -v `pwd`:/usr/src/app \
  elasticsearch-api
```

Example docker-compose:

```
test-api:
  build: ./api
  volumes:
    - ./api/app:/usr/src/app
  links:
    - test-elasticsearch
  environment:
    - ELASTICSEARCH_HOST=test-elasticsearch
    - ELASTICSEARCH_PORT=9200
    - PORT=3333
  ports:
    - "3333:3333"
```

## Testing

```
npm run test
```
