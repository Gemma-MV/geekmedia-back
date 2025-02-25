import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.URI_MONGOLOCAL;

export async function mongoconnection() {
	const client = new MongoClient(url);
		await client.connect();

		return client;
}

export async function closeMongo() {
	const client = new MongoClient(url);
		await client.close();

		return client;
}