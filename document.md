# User

## [POST] Create User
```
/api/user
```
Create a new user.

### Endpoint

### Auth
- Not Required

### Body Parameters
```json
{
    "username": "niananto",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "password": "something",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

### Response
```json
{
    "id": 27,
    "username": "niananto",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "password": "$2b$10$9AYpPMadcHoYgLIGteQ9m.B2d2xd7Flz3XIAmibIZFtj7M/0ovpDm",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

## [Get] User Information
```
/api/user?id=27
```

Retrieve information about a specific user.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the user    |

### Response

```json
{
    "id": 27,
    "username": "niananto",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "password": "$2b$10$9AYpPMadcHoYgLIGteQ9m.B2d2xd7Flz3XIAmibIZFtj7M/0ovpDm",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

## [POST] User Login
```
/api/user/login
```

Login a user.

### Endpoint

### Body Parameters
```json
{
    "username": "niananto",
    "password": "something"
}
```

### Response
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6h3nHeS8dhfjm8NY8VyUw3_IUz0CcY6Y"
}
```

## [PUT] Edit User
```
/api/user
```
Edit user information.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the user    |

### Body Parameters
```json
{
    "username": "nazmul",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

### Response
```json
{
    "id": 27,
    "username": "nazmul",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "password": "$2b$10$oR3KZi2pyUzilVKS/hbZyumAxzbPUiIn0C1O4oNBPowrltKLlgaCO",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

## [PUT] Update Password
```
/api/user/password
```
Update user password.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the user    |

### Body Parameters
```json
{
    "old_password": "something",
    "new_password": "anything"
}
```

### Response
```json
{
    "id": 27,
    "username": "niananto",
    "first_name": "Nazmul",
    "last_name": "Ananto",
    "email": "nazmulislamananto@gmail.com",
    "password": "$2b$10$gd/THvtUVLJnWf8VUYVppOpyy0TU8rHkRp2.Ik3Hnir7LVCw2sHJS",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```

# Plan
## [POST] Create Plan
```
/api/plan
```
Create a new travel plan.

### Endpoint

### Auth
- Required
- Not Required [public]

### Body Parameters
```json
{
    "start_date" : "13-07-2023",
    "end_date" : "17-07-2023",
    "regions" : [1],
    "tags" : [1, 5]
}
```

### Response
```json
{
    "id": 1,
    "user_id": 1,
    "title": "Cox's Bazar",
    "start_date": "2023-08-22T18:00:00.000Z",
    "end_date": "2023-08-26T18:00:00.000Z",
    "description": "Cox's Bazar in 5 days",
    "public": true,
    "image": "https://picsum.photos/400"
}
```

## [Get] Plan Details
```
/api/plan?id=1
```
Retrieve details of a specific travel plan.

### Endpoint

### Auth
- Required
- Not Required [public]

### Query Parameters

| Parameter | Type   | Description                 |
|-----------|--------|-----------------------------|
| id        | number | ID of the travel plan      |

### Response

```json
{
    "id": 1,
    "title": "Cox's Bazar",
    "start_date": "2023-08-25T00:00:00.391Z",
    "end_date": "2023-08-27T00:00:00.951Z",
    "description": "3 days in Cox's Bazar. Fun Stuff",
    "public": true,
    "image": "https://lh5.googleusercontent.com/p/AF1QipMI30IqgSPF0LvwCWyD3a5WMHl51B3KAeMuQCrL=w408-h306-k-no",
    "user_id": 27
}
```

# Event
## [Get] Day by Day Events by Plan ID
```
/api/event?plan_id=1&day=1
```

Retrieve a list of events for a specific travel plan.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| plan_id   | number | ID of the travel plan  |

### Response

```json
[
    {
        "journey": {
            "journey_type": "car",
            "distance": 7.6,
            "est_time": 24
        },
        "event": {
            "id": 1,
            "start_time": "2023-08-25T10:00:00.122Z",
            "end_time": "2023-08-25T13:00:00.814Z",
            "place_id": 15
        }
    },
    {
        "journey": {
            "journey_type": "car",
            "distance": 2.1,
            "est_time": 5
        },
        "event": {
            "id": 2,
            "start_time": "2023-08-25T15:00:00.413Z",
            "end_time": "2023-08-25T18:00:00.559Z",
            "place_id": 16
        }
    }
]
```

## [Get] All Days Events List
```
/api/event?plan_id=1
```
Retrieve a list of events for a specific travel plan.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| plan_id   | number | ID of the travel plan  |

### Response
```json
[
    [
        {
            "journey": {
                "journey_type": "car",
                "distance": 7.6,
                "est_time": 24
            },
            "event": {
                "id": 1,
                "start_time": "2023-08-25T10:00:00.122Z",
                "end_time": "2023-08-25T13:00:00.814Z",
                "place_id": 15
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": 2.1,
                "est_time": 5
            },
            "event": {
                "id": 2,
                "start_time": "2023-08-25T15:00:00.413Z",
                "end_time": "2023-08-25T18:00:00.559Z",
                "place_id": 16
            }
        }
    ],
    [
        {
            "journey": {
                "journey_type": "car",
                "distance": 1.4,
                "est_time": 5
            },
            "event": {
                "id": 3,
                "start_time": "2023-08-26T10:00:00.267Z",
                "end_time": "2023-08-26T13:00:00.984Z",
                "place_id": 17
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": 1.1,
                "est_time": 4
            },
            "event": {
                "id": 4,
                "start_time": "2023-08-26T15:00:00.018Z",
                "end_time": "2023-08-26T18:00:00.636Z",
                "place_id": 18
            }
        }
    ],
    [
        {
            "journey": {
                "journey_type": "car",
                "distance": 5.4,
                "est_time": 14
            },
            "event": {
                "id": 5,
                "start_time": "2023-08-27T10:00:00.498Z",
                "end_time": "2023-08-27T13:00:00.734Z",
                "place_id": 19
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": 3.4,
                "est_time": 9
            },
            "event": {
                "id": 6,
                "start_time": "2023-08-27T15:00:00.428Z",
                "end_time": "2023-08-27T18:00:00.560Z",
                "place_id": 20
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": 4.8,
                "est_time": 18
            },
            "event": null
        }
    ]
]
```

## [Get] Event Detail by ID (or Create)
```
/api/event/detail?event_id=1
```

Retrieve details of a specific event.

### Endpoint

### Auth
- Required
- Not Required [public]

### Query Parameters

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| id        | number | ID of the event    |

### Response

```json
{
    "event_id": 1,
    "checked": true,
    "note": "had so much fun.",
    "generated_details": "This was a visit to some place",
    "expenditure": "1000.00",
    "images": [
        "https://picsum.photos/200",
        "https://picsum.photos/200"
    ]
}
```

## [PUT] Update Event Detail by ID
```
/api/event/detail?event_id=1
```

Retrieve details of a specific event.

### Endpoint

### Auth
- Required

### Query Parameters

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| id        | number | ID of the event    |

### Body Parameters
```json
{
    "checked": true,
    "note": "had NOT so much fun.",
    "generated_details": "This was a visit to some place",
    "expenditure": "22000.00",
    "images": [
        "https://picsum.photos/200",
        "https://picsum.photos/200"
    ]
}
```

### Response

```json
{
    "id": 1,
    "event_id": 1,
    "checked": true,
    "note": "had NOT so much fun.",
    "generated_details": "This was a visit to some place",
    "expenditure": "22000.00",
    "images": [
        "https://picsum.photos/200",
        "https://picsum.photos/200"
    ]
}
```




# Public
## [Get] Place Details by ID
```
/api/public/place?id=1
```

Retrieve details of a specific place.

### Endpoint

### Auth
- Not Required

### Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the place   |

### Response

```json
{
    "id": 1,
    "title": "Cox's Bazar",
    "description": "Cox’s Bazar is a town on the southeast coast of Bangladesh. It’s known for its very long, sandy beachfront, stretching from Sea Beach in the north to Kolatoli Beach in the south. Aggameda Khyang monastery is home to bronze statues and centuries-old Buddhi",
    "type": "spot",
    "latitude": 21.42711346360012,
    "longitude": 92.00390984644827,
    "rating": 4.6,
    "rating_count": 39,
    "address": "Cox's Bazar 4700",
    "contact": null,
    "website": null,
    "region_id": 1,
    "images": [
        "https://picsum.photos/200"
    ]
}
```


## [Get] Reviews for a Place
```
/api/public/place/review?place_id=14
```

Retrieve reviews for a specific place.

### Endpoint

### Auth
- Not Required

### Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| place_id  | number | ID of the place         |

### Response

```json
[
    {
        "id": 4,
        "username": "Khaled Mohammad",
        "comment": "Cox’s Bazar is a beautiful coastal town in Bangladesh. It is one of the longest sea beaches in Asia. Cox's Bazar has emerged as an attractive tourist destination by virtue of its enchanting natural beauty, sandy beaches, marine drive, hill tracts, local c",
        "place_id": 15,
        "images": [
            "https://lh5.googleusercontent.com/p/AF1QipOJ89YykSTNI-UyydCm6mWjHlemTG0iqGgTawuH=w300-h225-p-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipMRqF5Y3v_x8V8W18qB2uMR0bzZeYTj2PuaQ216=w300-h225-p-k-no"
        ]
    }
]
```


## [Get] Tags
```
/api/public/tags
```
Send the first 10 tags.

### Endpoint

### Auth
- Not Required

### Response

```json
[
    {
        "id": 1,
        "title": "Popular"
    },
    {
        "id": 2,
        "title": "Hidden gems"
    },
    {
        "id": 3,
        "title": "Culture"
    },
    {
        "id": 4,
        "title": "Relaxing"
    },
    {
        "id": 5,
        "title": "Romantic"
    },
    {
        "id": 6,
        "title": "Beaches"
    },
    {
        "id": 7,
        "title": "Historic sites"
    },
    {
        "id": 8,
        "title": "Museums"
    },
    {
        "id": 9,
        "title": "Shopping"
    },
    {
        "id": 10,
        "title": "Wildlife"
    }
]
```

## [Get] Regions
```
/api/public/regions
```
Send all the regions.

### Endpoint

### Auth
- Not Required

### Response

```json
[
    {
        "id": 1,
        "title": "Cox's Bazar"
    },
    {
        "id": 2,
        "title": "Bandarban"
    }
]
```

## [GET] Nearby Restaurant
```
/api/public/nearby/restaurant?place_id=16
```
Retrieve nearby restaurant for a specific place.

### Endpoint

### Auth
- Not Required

### Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| place_id  | number | ID of the place         |

### Response
```json
{
    "id": 34,
    "title": "Poushee Hotel & Restaurant",
    "description": "",
    "type": "restaurant",
    "latitude": 21.4423011,
    "longitude": 91.9705256,
    "rating": 4.2,
    "rating_count": 4429,
    "address": "",
    "contact": "",
    "website": "",
    "region_id": 1,
    "PlaceImage": {
        "link": "https://lh5.googleusercontent.com/p/AF1QipOvPV75R4lfhH-hglOGJOQlSMffIMzq0tXWTydq=w427-h240-k-no"
    }
}
```