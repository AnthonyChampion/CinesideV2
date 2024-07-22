const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'MovieList',
    tableName: 'movie_lists',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
        },
        description: {
            type: 'text',
            nullable: true,
        },
        user_id: {
            type: 'int',
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: {
                name: 'user_id',
            },
            inverseSide: 'movieLists',
        },
        favorites: {
            target: 'Favorite',
            type: 'many-to-many',
            joinTable: {
                name: 'movie_list_favorites',
                joinColumn: {
                    name: 'listId',
                    referencedColumnName: 'id'
                },
                inverseJoinColumn: {
                    name: 'favoriteId',
                    referencedColumnName: 'movie_id'
                }
            },
            cascade: true
        }
    }
});
