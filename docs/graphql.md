# GraphQL API

## Overview

Dokumentasi ini menjelaskan GraphQL API yang digunakan dalam proyek ini.

## Endpoint

GraphQL endpoint tersedia di:

- **Development:** `http://localhost:4000/graphql`
- **Production:** sesuai konfigurasi deployment

## Schema

Semua query, mutation, dan subscription didefinisikan di `src/graphql/schema/`.

## Authentication

Setiap request GraphQL memerlukan token JWT yang dikirim via header:

```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

## Contoh Query

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

## Contoh Mutation

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```
