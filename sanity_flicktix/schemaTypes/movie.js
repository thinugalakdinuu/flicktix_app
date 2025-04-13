import { v4 as uuidv4 } from 'uuid';

const movieId = uuidv4();

export default {
    name: 'movie',
    title: 'Movie',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'uuid',
            title: 'Movie ID',
            type: 'string',
            readOnly: true,
            initialValue: movieId,
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name'
            }
        },
        {
            name: 'duration',
            title: 'Duration (in minutes)',
            type: 'number',
            validation: Rule => Rule.min(1).max(600)
        },
        {
            name: 'releaseDate',
            title: 'Released date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM-DD'
            },
        },
        {
            name: 'stars',
            title: 'Stars',
            type: 'array',
            of: [{ type: 'boolean' }],
            validation: Rule => Rule.max(5)
        },
        {
            name: 'language',
            title: 'Language',
            type: 'string',
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string',
        },
        {
            name: 'poster',
            title: 'Poster',
            type: 'image',
            options: {
                hotspot: true,
            }
        },
        {
            name: 'banner',
            title: 'Banner',
            type: 'image',
            options: {
                hotspot: true,
            }
        },
        {
            name: 'trailer',
            title: 'Trailer',
            type: 'url',
            validation: Rule => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] })
        },
    ]
}