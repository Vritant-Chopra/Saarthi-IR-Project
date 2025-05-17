# 📚 Information Retrieval System (IR)

Saarthi Information Retrieval WebApp project is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) for the course `CS F469`. This is a Python-based Information Retrieval (IR) system that reads a collection of `.txt` documents, computes a vector space model using TF-IDF, and ranks documents by cosine similarity to a user query. The system is connected to a frontend user interface and backend database that allows real-time querying and document link retrieval.

## Prerequisites

Before running this project, ensure that you have the following tools installed on your local system:

- **Node.js** - Required for running JavaScript server-side and managing project dependencies.
- **PostgreSQL** - Used for managing the database.
- Python 3.7+
- Libraries:
  ```bash
  pip install nltk pandas numpy natsort

## Installation and Local Setup

To set up and run this web app locally, follow these steps:

### Clone the GitHub Repository

Clone this repository and navigate into the project directory:

```bash
git clone https://github.com/softwareinnovationslabBITS/PlantML_WebApp.git
cd PlantML_WebApp
```
### Install Dependencies
Install the required dependencies using npm:

```bash
npm install
```
### Configure Environment Variables
This project requires certain environment variables to be configured before running the application. Create a `.env` file in the root of the project and add the following variables:

| Variable        | Description                           | Example Value                             |
|-----------------|---------------------------------------|-------------------------------------------|
| `DATABASE_URL`  | PostgreSQL database connection string | `postgresql://username:password@host:port/db_name` |
| `NEXTAUTH_SECRET` | Secret used by NextAuth.js for signing tokens | `your-secret-key-here`                    |
| `NEXTAUTH_URL`  | URL where the application is running   | `http://localhost:3000`                   |


Note: 
```bash
openssl rand -base64 32
``` 
use this command to get your `NEXTAUTH_SECRET.`

### Start the Development Server
Once the environment variables are set up, you can start the development server:

```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the application.


## Setting Up PostgreSQL and Prisma
### Install PostgreSQL
If PostgreSQL is not already installed, follow the instructions from the official PostgreSQL website to install it.

### Start PostgreSQL
Ensure that your PostgreSQL server is running:

```bash
sudo service postgresql start
```
### Create a Database
Use the PostgreSQL CLI or a database management tool like pgAdmin to create a new database for your project:
### Run Prisma Migrations
To create the actual tables in PostgreSQL based on the schema, run:

```bash
npx prisma migrate dev --name init
```
This will apply your Prisma schema and create the necessary tables in the database.

## Running the Project
Once the database is configured and Prisma migrations are applied, you can start the development server:

```bash
npm run dev
```
Open http://localhost:3000 to view the app in your browser.

## Additional Information
- `Prisma`: Prisma is an ORM (Object Relational Mapper) that simplifies database access and management. For more details, refer to the Prisma documentation.
- `NextAuth.js`: Used for authentication in the application. Refer to the NextAuth.js documentation for more details on configuring providers and securing authentication.

---

## 🚀 IR System Overview

This project implements:
- Document preprocessing (tokenization, stopword removal)
- Positional indexing for each token
- TF-IDF matrix construction and normalization
- Cosine similarity-based ranking of documents
- Integration with a web frontend and a PostgreSQL database for displaying document links

---

## 🔍 Features

- ✅ Tokenization and stopword removal using NLTK
- ✅ Stemming and Lemmatization done
- ✅ Positional index construction
- ✅ Term Frequency–Inverse Document Frequency (TF-IDF) scoring
- ✅ Cosine similarity computation
- ✅ Top-k document retrieval (default: 10)
- ✅ Database and frontend integration for displaying document links and posting user query

---

# ⚙️ Setup Instructions

### 1. Place all your `.txt` documents in the `Documents/` directory.

### 2. Open `retrieval.py` and update the path:
- path = "Your path to documents directory"

### 3. Login or Signup on the Portal

### 4. Post the query on user interface.
