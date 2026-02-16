# 🖼️ Visual Product Matcher

### AI-Powered Image Similarity Search Platform

The **Visual Product Matcher** is a full-stack, microservices-based AI system that identifies visually similar products using high-dimensional vector embeddings and cosine similarity search.

This project demonstrates strong fundamentals in:

* Distributed system design
* Cross-language microservices communication
* Vector database implementation
* Backend API orchestration
* Image feature engineering
* Docker-based multi-container deployment

It is designed not just as a UI project, but as a scalable, production-oriented architecture for image-based product discovery.

---

# 🚀 Problem Statement

Modern e-commerce platforms require intelligent visual search capabilities. Instead of relying only on text metadata, users should be able to:

* Upload an image
* Generate a feature representation
* Search for visually similar products
* Receive ranked, confidence-based results

This project implements a complete end-to-end solution for that workflow.

---

# 🏗️ System Architecture Overview

```
User
  ↓
React Frontend
  ↓
Spring Boot Backend (Orchestrator)
  ↓
Flask Similarity API (ML Processing Layer)
  ↓
PostgreSQL with pgvector
  ↓
Supabase Storage
```

The system follows a **layered microservices architecture** to ensure separation of concerns, scalability, and maintainability.

---

# 🧠 Architectural Design Philosophy

Instead of building everything inside a single monolithic backend, the system separates responsibilities across services:

* The **Frontend** handles presentation and user interaction.
* The **Spring Boot Backend** manages business logic and API orchestration.
* The **Flask Service** handles ML-specific image processing.
* The **Database Layer** performs efficient vector similarity search.
* The **Storage Layer** manages persistent image hosting.

This separation ensures flexibility — especially if we later replace handcrafted embeddings with deep learning models like CLIP or ResNet.

---

# ⚛️ Frontend Layer (React + Vite)

The frontend is built using **React 19** with **Vite** for fast development and optimized builds.

The interface allows users to:

* Upload product images
* Provide image URLs
* Adjust similarity threshold dynamically
* View real-time previews
* See ranked similarity scores

Tailwind CSS is used for rapid UI styling and consistent design.

The frontend does not handle business logic. Instead, it acts as a clean presentation layer that communicates with the backend via REST APIs.

---

# ☕ Backend Layer (Spring Boot)

The Spring Boot application acts as the **system orchestrator**.

It is responsible for:

1. Accepting search requests from the frontend
2. Validating input
3. Forwarding image data to the Flask similarity API
4. Receiving similarity results
5. Filtering results using a configurable `minScore`
6. Mapping embeddings to structured product metadata
7. Returning clean JSON responses

This layered structure follows:

```
Controller → Service → Repository
```

This ensures clear separation between:

* API layer
* Business logic
* Data access layer

### Why Java & Spring Boot?

* Strong type safety
* Clean enterprise architecture patterns
* Easy integration with PostgreSQL
* Production-grade REST support
* Clear scalability path

---

# 🐍 Similarity Service (Flask Microservice)

The Flask API is dedicated exclusively to image processing and similarity computation.

Separating ML logic into a Python service was a deliberate architectural decision.

### Responsibilities:

* Accept image file or URL
* Convert image into 1280-dimensional feature vector
* Execute vector similarity query in PostgreSQL
* Return ranked similarity scores

### Feature Extraction

Images are converted into embeddings using statistical feature extraction (mean + standard deviation across grid regions).
This produces a fixed-size 1280-dimension vector suitable for vector search.

### Why Separate ML Service?

* Python ecosystem is better for ML
* Allows swapping handcrafted features with deep learning later
* Keeps backend independent of ML framework dependencies
* Enables independent scaling of compute-heavy tasks

---

# 🗄️ Database Layer (PostgreSQL + pgvector)

The system uses PostgreSQL with the `pgvector` extension to store and query embeddings.

Instead of using external vector databases (like Pinecone or Weaviate), this project integrates vector search directly into PostgreSQL to keep infrastructure lightweight.

### Enable Extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Products Table

Stores:

* Product metadata
* Image URL
* Vector embedding (`VECTOR(1280)`)

---

## Similarity Query

Cosine similarity is calculated using:

```sql
SELECT *, 1 - (embedding <=> query_vector) AS similarity
FROM products
ORDER BY embedding <=> query_vector
LIMIT 10;
```

The `<=>` operator computes cosine distance efficiently at the database level.

This design minimizes data transfer and keeps ranking close to the storage layer.

---

# ☁️ Storage Layer (Supabase)

Images are uploaded and stored in Supabase Storage.

The system:

* Saves the file
* Generates a public URL
* Stores the URL in the database
* Returns it to frontend for display

This avoids storing binary images in PostgreSQL and keeps database optimized for embeddings.

---

# 🔄 End-to-End Request Flow

1. User uploads image in React UI
2. React sends request to Spring Boot
3. Spring Boot forwards image to Flask API
4. Flask:

   * Extracts embedding
   * Executes similarity search
   * Returns ranked matches
5. Spring Boot filters by threshold (`minScore`)
6. React displays ranked results with similarity percentages

---

# 🛠️ Tech Stack Summary

### Frontend

* React 19
* Vite
* Tailwind CSS

### Backend

* Java 17
* Spring Boot 3
* Spring Data JPA
* Maven

### ML Service

* Python 3.10
* Flask
* NumPy
* Pillow
* Psycopg2

### Database

* PostgreSQL
* pgvector

### DevOps

* Docker
* Docker Compose

---

Tell me what you want next, Shreya 🚀
