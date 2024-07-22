const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Favorite',
    tableName: 'favorites',
    columns: {
        movie_id: {
            primary: true,
            type: 'int',
        },
        user_id: {
            type: 'int',
        },
        title: {
            type: 'varchar',
        },
        thumbnail: {
            type: 'varchar',
        }
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: { name: 'user_id' },
            onDelete: 'CASCADE',
        },
        movieLists: {
            target: 'MovieList',
            type: 'many-to-many',
            joinTable: {
                name: 'movie_list_favorites',
                joinColumn: {
                    name: 'favoriteId',
                    referencedColumnName: 'movie_id'
                },
                inverseJoinColumn: {
                    name: 'listId',
                    referencedColumnName: 'id'
                }
            },
            cascade: true
        }
    }
});
