import { Router } from 'express';
import express, {json} from "express";
import { genericControler } from '../controllers/generic.controller.js';
import books from '../controllers/booksController.js';
import movies from '../controllers/moviesController.js';
import music from '../controllers/musicController.js';

const router = Router();

//Enpoint de conexion
router.get('/geekmedia', genericControler);
router.get('/geekmedia/books/all-books', books.allBooks);
router.get('/geekmedia/movies/all-movies', movies.allMovies);
router.get('/geekmedia/music/all-music', music.allMusic);

export { router };