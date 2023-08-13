# Get Plan Details
```
/event/distance/?plan_id=1
```

Retrieve details of a specific travel plan.

## Endpoint


## Query Parameters

| Parameter | Type   | Description                 |
|-----------|--------|-----------------------------|
| id        | number | ID of the travel plan      |

## Response

```json
{
    "plan": {
        "id": 1,
        "user_id": 1,
        "name": "Cox's Bazar",
        "start_date": "2023-08-22T18:00:00.000Z",
        "end_date": "2023-08-26T18:00:00.000Z",
        "description": "Cox's Bazar in 5 days",
        "public": true
    }
}
```
# Get Events by Plan ID
```
/event?plan_id=1
```

Retrieve a list of events for a specific travel plan.

## Endpoint


## Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| plan_id   | number | ID of the travel plan  |

## Response

```json
{
    "plan": [
        {
            "id": 1,
            "plan_id": 1,
            "start_time": "2023-08-23T04:00:00.000Z",
            "end_time": "2023-08-23T12:38:30.000Z",
            "order": 1,
            "place_id": 4,
            "activity_id": 40,
            "description": null
        },
        {
            "id": 2,
            "plan_id": 1,
            "start_time": "2023-08-24T04:38:47.000Z",
            "end_time": "2023-08-24T12:38:59.000Z",
            "order": 2,
            "place_id": 5,
            "activity_id": 42,
            "description": null
        },
        {
            "id": 3,
            "plan_id": 1,
            "start_time": "2023-08-25T04:39:10.000Z",
            "end_time": "2023-08-25T12:39:21.000Z",
            "order": 3,
            "place_id": 6,
            "activity_id": 34,
            "description": null
        },
        {
            "id": 4,
            "plan_id": 1,
            "start_time": "2023-08-26T04:39:32.000Z",
            "end_time": "2023-08-26T12:39:39.000Z",
            "order": 4,
            "place_id": 7,
            "activity_id": 39,
            "description": null
        },
        {
            "id": 5,
            "plan_id": 1,
            "start_time": "2023-08-27T04:40:35.000Z",
            "end_time": "2023-08-27T12:40:47.000Z",
            "order": 5,
            "place_id": 8,
            "activity_id": 36,
            "description": null
        }
    ]
}
```
# Get Distance between Places by Plan ID
```
/event/distance/?plan_id=1
```

Retrieve a list of distances between places for a specific travel plan.

## Endpoint


## Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| plan_id   | number | ID of the travel plan  |

## Response

```json
{
    "distance": [
        {
            "first_place_id": 4,
            "second_place_id": 5,
            "journey_type": "car",
            "distance": "20.30",
            "estimated_time": "00:30:00"
        },
        {
            "first_place_id": 5,
            "second_place_id": 6,
            "journey_type": "car",
            "distance": "20.30",
            "estimated_time": "00:30:00"
        },
        {
            "first_place_id": 6,
            "second_place_id": 7,
            "journey_type": "car",
            "distance": "20.30",
            "estimated_time": "00:30:00"
        },
        {
            "first_place_id": 7,
            "second_place_id": 8,
            "journey_type": "car",
            "distance": "20.30",
            "estimated_time": "00:30:00"
        }
    ]
}
```
# Get Place Details by ID
```
/place/?id=5
```

Retrieve details of a specific place.

## Endpoint


## Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the place   |

## Response

```json
{
    "place": {
        "data": {
            "id": 5,
            "region_id": "1",
            "name": "Gol Dighi - গোল দিঘি",
            "type": 1,
            "latitude": "21.44013335724268000000",
            "longitude": "91.97964258623468000000",
            "rating": "4.2",
            "description": "Turist Attraction",
            "rating_count": 800,
            "address": "Cox's Bazar",
            "contact": null,
            "website": "https://gol-dighi.business.site/?utm_source=gmb&utm_medium=referral",
            "images": [
                "https://lh5.googleusercontent.com/p/AF1QipPd5EMZITpGwrMQwF_w1XATL85z0zgu13xT-9Z5=w408-h306-k-no"
            ]
        }
    }
}
```
# Get Event Detail by ID
```
/event/detail/?id=3
```

Retrieve details of a specific event.

## Endpoint


## Query Parameters

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| id        | number | ID of the event    |

## Response

```json
{
    "event_detail": {
        "event_details": {
            "event_id": 3,
            "checked": true,
            "note": "had so much fun.",
            "generated_detail": "This was a visit to some place",
            "expenditure": "1000.00",
            "event_images": [
                {"image": "https://picsum.photos/200"},
                {"image": "https://picsum.photos/200"}
            ]
        }
    }
}
```
# Get Activities for a Place
```
/activity/?id=40
```

Retrieve activities associated with a specific place.

## Endpoint


## Query Parameters

| Parameter | Type   | Description           |
|-----------|--------|-----------------------|
| id        | number | ID of the activity    |

## Response

```json
{
    "activity": {
        "id": 40,
        "name": "relaxing",
        "max_time": "05:00:00",
        "min_time": "03:00:00"
    }
}
```
# Get Reviews for a Place
```
/review/?place_id=5
```

Retrieve reviews for a specific place.

## Endpoint


## Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| place_id  | number | ID of the place         |

## Response

```json
[
    {
        "id": 2,
        "place_id": 5,
        "username": "Buddhist Bangladeshi",
        "coment": "Nice public place with a nice restaurant by the side of it. The water seems a bit... odd, I wouldn't dip my toe in it, but a nice place to spend some leisurely time.\n\nOne bad thing: Very hot. The sun seems to burn the skin.",
        "review_image": [
            {
                "image": "https://lh5.googleusercontent.com/p/AF1QipM-MhrDZjPGhsRz6zR7G2VsUFzjjmKpieB1OjC2=w300-h450-p-k-no"
            }
        ]
    }
]
```
# Get User Information
```
/user/?id=1
```

Retrieve information about a specific user.

## Endpoint

## Query Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| id        | number | ID of the user    |

## Response

```json
{
    "username": "user2",
    "first_name": "User",
    "last_name": "Two",
    "email": "user2@example.com",
    "profile_pic": "https://picsum.photos/400",
    "cover_pic": "https://picsum.photos/400"
}
```


