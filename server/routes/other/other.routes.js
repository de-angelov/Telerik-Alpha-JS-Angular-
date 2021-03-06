const {
    Router,
} = require('express');
const passport = require('passport');
const otherController = require('./other.controller');

const init = (app, data) => {
    const router = new Router();
    const controller = otherController.init(app, data);

    router
        .get('/links', passport.authenticate('jwt', {
            session: false,
        }), async (req, res) => {
            const allLinks = await controller.getAllLinks(req.body);
            res.status(200).json(allLinks);
        })
        .get('/contacts', async (req, res) => {
            console.log('! ! ! contacts ! ! !');
            const allContacts = await controller.getAllContacts(req.body);
            res.status(200).json(allContacts);
        })
        .get('/categories', async (req, res) => {
            const allCategories = await controller.getAllCategories();
            // allCategories.map((x)=> {
            //     return x.name;
            // });
            res.status(200).json({
                msg: 'success',
                categories: allCategories,
            });
        })
        .post('/contacts/add', passport.authenticate('jwt-admin', {
            session: false,
        }, async (req, res) => {
            await controller.createContact(req.body);
        }))
        .post('/contacts/edit', passport.authenticate('jwt-admin', {
            session: false,
        }, async (req, res) => {
            await controller.editContact(req.body);
        }))
        .post('/links/add', passport.authenticate('jwt-admin', {
            session: false,
        }, async (req, res) => {
            await controller.createLink(req.body);
        }))
        .post('/links/edit', passport.authenticate('jwt-admin', {
            session: false,
        }, async (req, res) => {
            await controller.editLink(req.body);
        }))
        .post('/links/delete', passport.authenticate('jwt-admin', {
            session: false,
        }, async (req, res) => {
            console.log('------------->Delete link request id ',
            req.body, ' to server confirmed! Passing to controller!');
            await controller.deleteLink(req.body);
        }))
        ;
    app.use('/', router);
};

module.exports = {
    init,
};
