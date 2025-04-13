export default {
  name: 'partner',
  type: 'document',
  title: 'Partner',
  fields: [
    // Theater data
    {
      name: 'theaterName',
      type: 'string',
      title: 'theater Name',
    },
    {
      name: 'theaterAddress',
      type: 'string',
      title: 'Theater Address',
    },
    {
      name: 'contactTheater',
      type: 'string',
      title: 'Contact Number(Theater)',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
        name: 'password',
        type: 'string',
        title: 'Password',
    },

    // Admin data
    {
      name: 'adminName',
      type: 'string',
      title: 'Theater Admin Name',
    },
    {
        name: 'contactAdmin',
        type: 'string',
        title: 'Contact Number(Owner)',
    },
    {
        name: 'registrationDoc',
        type: 'file',
        title: 'Registration Document',
    },
    {
      name: 'owner',
      title: 'Partner Owner',
      type: 'reference',
      to: [{type: 'theater'}],
      description: 'This links the theater to a partner account.',
    //   validation: (Rule) => Rule.required().error('Each theater must have an owner.'),
    },
    {
      name: 'status',
      title: 'Approved by Admin',
      type: 'string',
      initialValue: 'pending',
      description: 'Admin must approve this account before login access.',
      options: {
        list: ['pending', 'approved', 'denied'],
      },
    },
  ],
}
