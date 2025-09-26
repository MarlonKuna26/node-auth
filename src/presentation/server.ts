import express, { Router } from 'express';

interface Options {
    port?: number;
    routes: Router;
}

export class Server {
    public readonly app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port = 3100, routes } = options;
        this.port = port;
        this.routes = routes;

        // Middleware para parsear JSON
        this.app.use(express.json());
    }

    async start() {

        //middleware
        // Este middleware ya está en el constructor, no es necesario repetirlo aquí.
         this.app.use(express.json());
         this.app.use(express.urlencoded({extended:true}));
        // Usar las rutas definidas
        this.app.use(this.routes);

        // Escuchar el puerto
        this.app.listen(this.port, () => {
            console.log(`server running on port ${this.port}`);
        });
    }
}