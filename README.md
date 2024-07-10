# Cineside

Cineside is a responsive movie application built using React JS, Express, Tailwind CSS, and Flowbite components. It utilizes The Movie Database (TMDb) API to fetch movie data, allowing users to browse trending movies, top-rated movies, upcoming movies, search movies by genre, and manage favorites.

## Features

Trending Movies: Displaying currently popular movies fetched from TMDb API.

Top Rated Movies: Showing highest-rated movies according to user ratings.

Upcoming Movies: Listing movies scheduled for release in the near future.

Search Movies by Genre: Filter movies based on selected genres.

Favorites: Allowing users to add movies to their favorites list.


## Technologies Used

Frontend: React JS, Tailwind CSS, Flowbite components.

Backend: Express (for API requests to TMDb).

API: The Movie Database (TMDb) API.

## Installation

### Prerequisites:

Node.js (version >= 12.0.0).

npm or yarn package manager.

### Clone the repository:

```bash
git clone git@github.com:AnthonyChampion/CinesideV2.git
cd CinesideV2
```

### Install dependencies

```bash
npm install
or
yarn install
```

### Set up TMDb API on client folder:

Get your API key from TMDb website.

Create a .env like .env.sample and add your API key:

```
.env 

VITE_API_KEY=YOUR_VITE_API_KEY

VITE_API_URL=YOUR_VITE_API_URL

SERVER_PORT=YOUR_SERVER_PORT
```

### Set up server folder:

Create a .env file like .env.sample  and add your datas:

```
.env 

DB_HOST=DB_HOST
DB_PORT=DB_PORT
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DB_DATABASE=DB_NAME
JWT_SECRET=JWT_SECRET
PORT=PORT
```

## Start the application

```
npm run dev
```

## Enjoy !

### License: [MIT](https://choosealicense.com/licenses/mit/)