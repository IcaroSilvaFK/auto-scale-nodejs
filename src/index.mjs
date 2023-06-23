import fastify from "fastify";
import { cpus } from "node:os";
import cluster from "node:cluster";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    console.log(`worker ${i} died`);
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  (async () => {
    const app = fastify();

    app.get("/", (req, reply) => {
      console.log(
        `request: ${req.method} ${req.url} worker: ${cluster.worker.id}`
      );
      reply.send("ok");
    });

    await app.listen({ port: 3000 });
  })();
}
