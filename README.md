# 📚 Information Retrieval System (IR)

This is a Python-based Information Retrieval (IR) system that reads a collection of `.txt` documents, computes a vector space model using TF-IDF, and ranks documents by cosine similarity to a user query. The system is connected to a frontend user interface and backend database that allows real-time querying and document link retrieval.

---

## 🚀 Overview

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

## 🧰 Prerequisites

- Python 3.7+
- Libraries:
  ```bash
  pip install nltk pandas numpy natsort

# ⚙️ Setup Instructions

### 1. Clone the repository or download the source files.

### 2. Place all your `.txt` documents in the `Documents/` directory.

### 3. Open `retrieval.py` and update the path:
- path = "Your path to documents directory"

### 4. Login or Signup on the Portal

### 5. Post the query on user interface.