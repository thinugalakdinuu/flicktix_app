import imageUrlBuilder from '@sanity/image-url';

import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: '0wp724s1',
    dataset: 'production',
    apiVersion: '2025-03-25',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);