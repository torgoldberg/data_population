export const userSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "username": {
            "type": "string"
        },
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        },
        "phone": {
            "type": "integer"
        },
        "userStatus": {
            "type": "integer"
        }
    },
    "additionalProperties": false,
    "required": [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "password",
        "phone",
        "userStatus"
    ]
}
