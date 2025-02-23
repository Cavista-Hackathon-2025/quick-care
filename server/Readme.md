# Smart Medication Reminder System - Pharmacy API

This repository contains the backend API for the Smart Medication Reminder System. The Pharmacy API allows you to store and retrieve pharmacy records, which include user information (such as a Google user ID), patient details, relative contact information, and associated drug data.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [POST /api/pharmacy](#post-apipharmacy)
  - [GET /api/pharmacy](#get-apipharmacy)
  - [GET /api/pharmacy/:id](#get-apipharmacyid)
- [Usage Examples](#usage-examples)
- [Additional Notes](#additional-notes)

## Overview

The Pharmacy API is part of the Smart Medication Reminder System. It is used to create and manage pharmacy records. Each record is associated with a user (e.g., a Google user) and contains details such as:

- **User ID**: Unique identifier of the authenticated user.
- **Patient Information**: Patient name and phone number.
- **Relative Information**: Optional relative or next-of-kin name and phone number.
- **Drug Details**: An array of drug objects with details like category, number of packs, drug name, dosage, and time of administration.

## Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd quick-care/server
npm install
Configuration
Create a .env file in the project root and set your environment variables. For example:

env
Copy
MONGO_URI=your_mongodb_connection_string
PORT=5000

POST /api/pharmacy

{
  "userId": "string",           
  "patientName": "string",      
  "patientPhone": "string",     
  "relativeName": "string",     
  "relativePhone": "string",    
  "drugs": [
    {
      "category": "string",     
      "numberOfPacks": number,  
      "drugName": "string",     
      "dosage": "string",       
      "time": "string"          
    }
  ]
}

GET /api/pharmacy
[
  {
    "_id": "60c72b2f4f1a4e3fbc2f1234",
    "userId": "google-user-id-12345",
    "patientName": "John Doe",
    "patientPhone": "1234567890",
    "relativeName": "Jane Doe",
    "relativePhone": "0987654321",
    "drugs": [ ... ],
    "createdAt": "2025-02-23T02:28:05.746Z",
    "updatedAt": "2025-02-23T02:28:05.746Z",
    "__v": 0
  }
  // Additional records...
]


GET /api/pharmacy/:id
{
  "_id": "60c72b2f4f1a4e3fbc2f1234",
  "userId": "google-user-id-12345",
  "patientName": "John Doe",
  "patientPhone": "1234567890",
  "relativeName": "Jane Doe",
  "relativePhone": "0987654321",
  "drugs": [
    {
      "_id": "60c72b2f4f1a4e3fbc2f1235",
      "category": "Pill",
      "numberOfPacks": 2,
      "drugName": "Paracetamol",
      "dosage": "Twice daily",
      "time": "Morning and Night"
    }
  ],
  "createdAt": "2025-02-23T02:28:05.746Z",
  "updatedAt": "2025-02-23T02:28:05.746Z",
  "__v": 0
}
