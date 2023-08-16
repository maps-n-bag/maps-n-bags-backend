# Get Plan Details
```
/api/plan?id=1
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
# Get Day by Day Events by Plan ID
```
/api/event?plan_id=1&day=1
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
    [
        {
            "journey": {
                "journey_type": "car",
                "distance": "20.30",
                "estimated_time": "00:30:00"
            },
            "event": {
                "id": 1,
                "plan_id": 1,
                "start_time": "2023-08-23T04:00:00.000Z",
                "end_time": "2023-08-23T12:38:30.000Z",
                "place_id": 4,
                "activity": "swimming",
                "description": null
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": "20.30",
                "estimated_time": "00:30:00"
            },
            "event": {
                "id": 2,
                "plan_id": 1,
                "start_time": "2023-08-23T04:38:47.000Z",
                "end_time": "2023-08-23T12:38:59.000Z",
                "place_id": 5,
                "activity": "swimming",
                "description": null
            }
        },
        {
            "journey": {
                "journey_type": "car",
                "distance": "20.30",
                "estimated_time": "00:30:00"
            },
            "event": {
                "id": 3,
                "plan_id": 1,
                "start_time": "2023-08-23T04:39:10.000Z",
                "end_time": "2023-08-23T12:39:21.000Z",
                "place_id": 6,
                "activity": "swimming",
                "description": null
            }
        }
    ]
}
```
# Get Place Details by ID
```
/api/place?id=5
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
    "id": 5,
    "region_id": "1",
    "title": "Gol Dighi - গোল দিঘি",
    "type": 1,
    "latitude": "21.44013335724268000000",
    "longitude": "91.97964258623468000000",
    "rating": "4.2",
    "description": "Tourist Attraction",
    "rating_count": 800,
    "address": "Cox's Bazar",
    "contact": null,
    "website": "https://gol-dighi.business.site/?utm_source=gmb&utm_medium=referral",
    "images": [
        "https://lh5.googleusercontent.com/p/AF1QipPd5EMZITpGwrMQwF_w1XATL85z0zgu13xT-9Z5=w408-h306-k-no"
    ]
}
```
# Get Event Detail by ID
```
/api/event/detail?event_id=3
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
    "event_id": 3,
    "checked": true,
    "note": "had so much fun.",
    "generated_detail": "This was a visit to some place",
    "expenditure": "1000.00",
    "event_images": [
        "https://picsum.photos/200",
        "https://picsum.photos/200"
    ]
}
```

# Get Reviews for a Place
```
/api/review?place_id=5
```

Retrieve reviews for a specific place.

## Endpoint


## Query Parameters

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| place_id  | number | ID of the place         |

## Response

```json
{
    [
        {
            "id": 2,
            "place_id": 5,
            "username": "Buddhist Bangladeshi",
            "comment": "Nice public place with a nice restaurant by the side of it. The water seems a bit... odd, I wouldn't dip my toe in it, but a nice place to spend some leisurely time.\n\nOne bad thing: Very hot. The sun seems to burn the skin.",
            "review_image": [
                "https://lh5.googleusercontent.com/p/AF1QipM-MhrDZjPGhsRz6zR7G2VsUFzjjmKpieB1OjC2=w300-h450-p-k-no",
                "https://lh5.googleusercontent.com/p/AF1QipM-MhrDZjPGhsRz6zR7G2VsUFzjjmKpieB1OjC2=w300-h450-p-k-no"
            ]
        }
    ]
}
```
# Get User Information
```
/api/user?id=1
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
    "id": 1,
    "username": "admin",
    "first_name": "admin",
    "last_name": "User",
    "email": "admin@example.com",
    "password": "password",
    "profile_pic": "https://picsum.photos/200",
    "cover_pic": "https://picsum.photos/200"
}
```


