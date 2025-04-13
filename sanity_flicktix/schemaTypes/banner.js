export default {
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
        name: 'movie',
        title: 'Movie',
        type: 'string',
    },
    {
      name: 'midText',
      title: 'MidText',
      type: 'string',
    },
    {
      name: 'movieSelect',
      title: 'Select Movie',
      type: 'reference',
      to: [{ type: 'movie' }],
      validation: Rule => Rule.required(),
      description: 'Select an already uploaded movie'
    },
  ],
}
