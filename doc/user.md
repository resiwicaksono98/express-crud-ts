# User Api Spec

## Register User

Endpoint : Post /api/users

```json
{
  "username": "Resi",
  "password": "password",
  "name": "Resi Wicaksono"
}
```

Response Body (success) :

```json
{
  "data": {
    "username": "Resi",
    "name": "Resi Wicaksono"
  }
}
```

Response Body (failed) :

```json
    "errors" : "username must not blank"
```

## Login User

## Get User

## Update User

## Logout User
