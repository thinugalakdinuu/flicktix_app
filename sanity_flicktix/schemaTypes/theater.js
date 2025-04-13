export default {
  name: 'theater',
  title: 'Theater',
  type: 'document',
  fields: [
    {
      name: 'theaterName',
      title: 'Theater Name',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'stripeAccountId',
      title: 'Stripe Account ID',
      type: 'string',
      description: 'The Stripe Connect account ID for payments (e.g., acct_12345ABCDE)',
      validation: (Rule) => Rule.required().error('Stripe Account ID is required for payouts.'),
    },
    {
      name: 'pricing',
      title: 'Pricing(LKR)',
      type: 'object',
      fields: [
        {
          name: 'adultPrice',
          title: 'Adult Ticket Price',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).error('Amount must be a positive number.'),
        },
        {
          name: 'childPrice',
          title: 'Child Ticket Price',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).error('Amount must be a positive number.'),
        },
      ],
    },
    {
      name: 'dates',
      title: 'Select Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'date',
              title: 'Date',
              type: 'date',
              options: { dateFormat: 'YYYY-MM-DD' },
            },
            {
              name: 'showMovie',
              title: 'Show Movie',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'movieName',
                      title: 'Select Movie',
                      type: 'reference',
                      to: [{ type: 'movie' }],
                      validation: (Rule) => Rule.required(),
                      description: 'Select an already uploaded movie',
                    },
                    {
                      name: 'showtimes',
                      title: 'Show Times',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            {
                              name: 'time',
                              title: 'Showtime',
                              type: 'string',
                            },
                            {
                              name: 'reservedSeats',
                              title: 'Reserved/Unavailable Seats',
                              type: 'array',
                              of: [
                                {
                                  type: 'string',
                                  validation: (Rule) =>
                                    Rule.max(5)
                                      .error('Maximum length is 5 characters.')
                                      .regex(/^[a-zA-Z0-9]*$/, 'Only letters and digits are allowed.'),
                                },
                              ],
                              validation: (Rule) => Rule.unique(),
                            },
                          ],
                        },
                      ],
                      validation: (Rule) => Rule.min(1),
                    },
                  ],
                },
              ],
              validation: (Rule) => Rule.min(1),
            },
          ],
        },
      ],
    },
  ],
};