import { Router } from 'express'
import { indexController } from '../Controllers/indexController'

class router {
    public router: Router = Router();
    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', indexController.prueba);
        this.router.post('/interpretar', indexController.interpretar)
        this.router.get('/getAST', indexController.arbolAST)
        this.router.get('/getErrores', indexController.getListaErrores)
    }
}

const indexRouter = new router();
export default indexRouter.router; 