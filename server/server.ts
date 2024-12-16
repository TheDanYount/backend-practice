import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());

app.post('/api/create-movie', async (req, res, next) => {
  try {
    const {title ,summary, link, rating} = req.body;
    if(typeof title !== 'string' || typeof summary !== 'string' || 
      typeof link !== 'string' || typeof rating !== 'string'
    ) throw new ClientError(400, 'missing data');
    const sql = `
    insert into "movies" ("title", "summary", "link", "rating")
    values ($1, $2, $3, $4)
    returning "title", "movieId"
    `;
    const result = await db.query(sql, [title, summary, link, rating]);
    if(!result.rows[0]) throw new ClientError(404, 'movie entry creation failed');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get('/api/read-movies', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "movies"
    `;
    const result = await db.query(sql);
    if(!result.rows[0]) throw new ClientError(404, 'fetch all movie entries failed');
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.put('/api/update-movie/:movieId', async (req, res, next) => {
  try {
    const {title, link, summary, rating} = req.body;
    const {movieId} = req.params;
    if(typeof title !== 'string' || typeof summary !== 'string' || 
      typeof link !== 'string' || typeof rating !== 'string'
    ) throw new ClientError(400, 'missing data');
    if(!Number.isInteger(Number(movieId))) throw new ClientError(400, 'movieId must be an integer');
    const sql = `
    update "movies"
    set "title" = $1, "link" = $2, "summary" = $3, "rating" = $4
    where "movieId" = $5
    returning *
    `;
    const result = await db.query(sql, [title, link, summary, rating, movieId]);
    if(!result.rows[0]) throw new ClientError(404, 'movie entry update failed');
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/delete-movie/:movieId', async (req, res, next) => {
  try {
    const {movieId} = req.params;
    if(!Number.isInteger(Number(movieId))) throw new ClientError(400, 'movieId must be an integer');
    const sql = `
    delete
    from "movies"
    where "movieId" = $1
    returning *
    `;
    const result = await db.query(sql, [movieId]);
    if(!result.rows[0]) throw new ClientError(404, 'movie entry deletion failed');
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});

//review me please!