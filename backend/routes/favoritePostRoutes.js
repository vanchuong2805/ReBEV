import express from 'express';
import getAllController from '../controllers/favorite/getAllController.js';
import getFavoriteController from '../controllers/favorite/getFavoriteController.js';
import createFavoritePost from '../controllers/favorite/createFavoriteController.js';
import deleteFavoriteController from '../controllers/favorite/deleteFavoriteController.js';

const favoritePostRouter = express.Router();

favoritePostRouter.get('/', getAllController);
favoritePostRouter.get('/:userId', getFavoriteController);
favoritePostRouter.post('/:user_id', createFavoritePost);
favoritePostRouter.delete('/delete/:post_id', deleteFavoriteController);


export default favoritePostRouter;





