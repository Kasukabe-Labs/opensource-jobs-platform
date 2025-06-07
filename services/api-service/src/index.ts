import fastify from "fastify";

const server = fastify({
    logger: true,
});

const PORT = process.env.PORT || 8001;

server.get("/", async(request, reply) => {
    return{
        message: "API Service running"
    }
})

server.listen({port: PORT as number}, (err, address) => {
    if(err){
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Server is running at ${address}`)
})