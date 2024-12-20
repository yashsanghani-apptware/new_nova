1. **user create**

curl --location 'http://localhost:4000/v1/users' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
     "name": "John Doe",
     "givenName": "John",
     "familyName": "Doe",
     "email": "john-3.doe@example.com",
     "telephone": "+1234567890",
     "username": "johndoe-2",
     "password": "securePassword123",
     "address": {
       "streetAddress": "123 Main St",
       "addressLocality": "Springfield",
       "addressRegion": "IL",
       "postalCode": "62701",
       "addressCountry": "USA"
     },
     "contactPoint": {
       "telephone": "+1234567890",
       "contactType": "personal",
       "email": "john.doe@example.com"
     },
    
    
     "organization": "60b5ed9b9c25d532dc4a6f35",
     "attr": {
       "department": "Engineering"
     }
   }'

2. **login**

curl --location 'http://localhost:4000/v1/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "johndoe-2",
    "password": "securePassword123"
}'

3. **create listing**

curl --location 'http://localhost:6000/api/listings' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw' \
--data-raw '{
    "name": "test-7",
    "address": {
        "house_number": "123",
        "street": "Main Street",
        "apartment": "A1",
        "city": "Springfield",
        "state": "Illinois",
        "zip": "62701"
    },
    "property_description": "A beautiful farmhouse with modern amenities and spacious land.",
    "property_highlights": {
        "total_acres": 150,
        "tillable": 100,
        "woodland": 30,
        "wetland": 20,
        "deed_restrictions": "None",
        "barns": [
            {
                "size": "20x30",
                "description": "Large barn for storage and livestock."
            },
            {
                "size": "15x20",
                "description": "Smaller barn for tools and equipment."
            }
        ]
    },
    "days_on_market": 30,
    "type": "Farm",
    "built_on": "2022-05-15",
    "renovated_on": [
        "2010-06-15",
        "2018-08-30"
    ],
    "listing_agent": {
        "name": "John Doe",
        "company": "Real Estate Inc.",
        "phone_number": "555-1234",
        "email": "johndoe@example.com"
    },
    "dataroom_id": "66d6dfdf8aec4ff610cb5ae1",
    "workflows": {
        "step1": "Initial screening",
        "step2": "Financial review"
    },
    "images": [],
    "videos": [
        "https://example.com/videos/property1.mp4"
    ],
    "maps": [],
    "property_details": {
        "parking": {
            "number_of_spaces": 2,
            "type": "Garage"
        },
        "exterior": {
            "features": {
                "garden": true,
                "swimming_pool": "Yes"
            },
            "property_information": {
                "fencing": "Wood",
                "driveway": "Paved"
            },
            "lot_information": {
                "size": "3 acres",
                "zoning": "Residential"
            }
        },
        "financial": {
            "price": 450000,
            "taxes": "Annual: $3000"
        },
        "utilities": {
            "heating_and_cooling": {
                "heating_type": "Forced air",
                "cooling_type": "Central"
            },
            "utility": {
                "electricity": "Available",
                "water": "City water",
                "sewage": "Septic system"
            }
        },
        "location": {
            "school_information": {
                "district": "Springfield",
                "elementary_school": "Springfield Elementary"
            },
            "location_information": {
                "latitude": 39.7817,
                "longitude": -89.6501
            }
        },
        "other": {
            "notes": "Recent renovation on the kitchen and bathrooms."
        }
    },
    "sales_and_tax": {
        "sales_history": {
            "last_sold_date": "2018-07-01",
            "last_sold_price": 400000
        },
        "tax_history": {
            "2020": {
                "assessed_value": 450000,
                "tax_amount": 3000
            }
        }
    },
    "public_facts": {
        "bedrooms": 4,
        "square_feet": "3500 sq ft",
        "year_built": 2001
    },
    "schools": {
        "elementary_school": "Springfield Elementary",
        "high_school": "Springfield High School"
    },
    "listing_source": "REALTOR",
    "status": "SOURCED"
}'

4. **get all listings**

curl --location 'http://localhost:6000/api/listings' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw'

5. **get listing**

curl --location 'http://localhost:6000/api/listings/66db138e44e5797f21f25254' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw'

6. **update listing**

curl --location --request PUT 'http://localhost:6000/api/listings/66db148c44e5797f21f25280' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw' \
--data '{
    "address": {
        "house_number": "123",
        "street": "Main Street",
        "apartment": "A1",
        "city": "UK",
        "state": "Illinois",
        "zip": "62701",
        "_id": "66db148c44e5797f21f25282"
    }
}'

7. **search listing**

curl --location --request POST 'http://localhost:6000/api/listings/search?name=abc&status=SCREENED' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw'

8. **media listing**

curl --location 'http://localhost:6000/api/listings/media/66db138e44e5797f21f25254/image' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw' \
--form 'image=@"/Users/yash/Downloads/IMG-20240830-WA0003__01-removebg-preview (1).png"'

9. **query Listing**

curl --location --globoff 'http://localhost:6000/api/listings/query?property_highlights.total_acres[%24gt]=100' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw'

10.  **delete listing**

curl --location --request DELETE 'http://localhost:6000/api/listings/66db138e44e5797f21f25254' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ1YzQ3M2U1ODI0M2FhMTAyZjViYWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UtMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTYzMzI3NiwiZXhwIjoxNzI1NjM2ODc2fQ.DgIemgIAP37og6rrtKjpuATJ_us_vHpXltUNipqQ_Cw'

