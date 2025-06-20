// src/project_conductor.js

export class ProjectConductor {
  constructor(state, env) {
    this.state = state; // Instance of DurableObjectState, used for storage
    this.env = env;     // Contains environment bindings (e.g., this.env.DB for D1)

    // Example: Initialize some state when the DO is first created (optional)
    // this.state.blockConcurrencyWhile(async () => {
    //   let initialised = await this.state.storage.get("initialised");
    //   if (!initialised) {
    //     await this.state.storage.put("initialised", true);
    //     console.log("ProjectConductor instance created and initialised storage.");
    //   }
    // });
  }

  // This is the required 'fetch' handler for the Durable Object.
  // It's called when your main Worker (or another service) sends a request to this DO instance.
  async fetch(request) {
    const url = new URL(request.url);

    // Example: Simple request routing based on path
    if (url.pathname === "/status") {
      const storedValue = await this.state.storage.get("status_message") || "Not set";
      return new Response(`ProjectConductor status: ${storedValue}`);
    }

    if (url.pathname === "/set-status") {
      if (request.method === "POST") {
        try {
          const data = await request.json();
          if (data && typeof data.message === 'string') {
            await this.state.storage.put("status_message", data.message);
            return new Response(`Status updated to: ${data.message}`);
          } else {
            return new Response("Invalid request body: JSON with 'message' string expected.", { status: 400 });
          }
        } catch (e) {
          return new Response("Failed to parse JSON body.", { status: 400 });
        }
      } else {
        return new Response("Method not allowed. Use POST to set status.", { status: 405 });
      }
    }

    // Example: Accessing D1 binding (ensure 'DB' is configured in wrangler.jsonc)
    // if (url.pathname === "/query-db") {
    //   try {
    //     // Make sure you have a table, e.g., 'example_table'
    //     const { results } = await this.env.DB.prepare("SELECT * FROM example_table LIMIT 1").all();
    //     return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' }});
    //   } catch (e) {
    //     console.error("D1 query failed:", e.stack);
    //     return new Response(`Error querying database: ${e.message}`, { status: 500 });
    //   }
    // }

    return new Response("Welcome to ProjectConductor! Path not found.", { status: 404 });
  }

  // You can add other methods here for the DO's internal logic
  // async someInternalTask(details) {
  //   await this.state.storage.put("last_task", details);
  //   console.log("Performed internal task:", details);
  // }

  // If you plan to use Alarms:
  // async alarm() {
  //   console.log("Alarm triggered in ProjectConductor!");
  //   // Perform periodic tasks, cleanup, etc.
  //   let count = await this.state.storage.get("alarm_count") || 0;
  //   await this.state.storage.put("alarm_count", ++count);
  // }
}
