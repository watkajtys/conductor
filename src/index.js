// src/index.js

import { ProjectConductor } from './project_conductor.js';

export default {
  async fetch(request, env, ctx) {
    // You can choose a consistent name for your DO instance,
    // or generate IDs dynamically based on request parameters, etc.
    // For this example, we'll use a fixed name.
    const doId = env.PROJECT_CONDUCTOR.idFromName("default-conductor-instance");

    // Get the Durable Object stub.
    const stub = env.PROJECT_CONDUCTOR.get(doId);

    // Forward the request to the Durable Object instance.
    // The DO's fetch handler (in ProjectConductor class) will take over.
    return stub.fetch(request);
  },
};

// Important: Export the Durable Object class itself so that Cloudflare can instantiate it.
export { ProjectConductor };
