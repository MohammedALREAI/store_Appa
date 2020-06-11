const AccessControl = require('accesscontrol')

const grantsObject = {
    admin: {
        book: {
            'create:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
            'read:any': ['*'],
        },
        user: {
            'update:any': ['*'],
            'delete:any': ['*'],
            'read:any': ['*'],
        },
    },
    user: {
        book: {
            'create:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*'],
            'read:any': ['*', '!id'],
        },
    },
}

const ac = new AccessControl(grantsObject)
module.exports = ac
