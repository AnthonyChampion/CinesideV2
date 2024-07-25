const { EntitySchema } = require('typeorm');

// l'entité défini le modèle de données

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        password: {
            type: 'varchar',
        },
        isAdmin: {
            type: 'bool',
            default: false
        }
    },
});
