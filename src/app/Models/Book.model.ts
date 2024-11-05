import { Genre } from "../enums/enums";

export interface Book {
	id: number;
	title: string;
	description: string;
	author: string;
	genre: Genre;
	publishedDate?: Date;
}