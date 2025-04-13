export default {
  name: 'editorsChoice',
  title: 'Editor\'s Choice',
  type: 'document',
  fields: [
    {
      name: 'refNo',
      title: 'Reference Number',
      type: 'string',
    },
    {
      name: 'movieSelect',
      title: 'Select Movies',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'movie' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).unique(), // Prevents duplicate movies
      description: 'Select one or more already uploaded movies',
    },
  ],
};