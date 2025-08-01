# IPL Players Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required for the API endpoints.

## Endpoints

### 1. List All Players
**GET** `/players`

Retrieve a paginated list of IPL players with filtering and sorting options.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Number of results per page (max: 100) |
| `team` | string | - | Filter players by team name |
| `search` | string | - | Search players by name |
| `sortBy` | string | createdAt | Sort field (name, team, runs, salary, createdAt) |
| `sortOrder` | string | desc | Sort order (asc, desc) |

#### Example Request
```bash
GET /api/players?page=1&limit=5&team=RCB&sortBy=runs&sortOrder=desc
```

#### Example Response
```json
{
  "page": 1,
  "limit": 5,
  "total": 15,
  "players": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Virat Kohli",
      "image": "http://localhost:3000/uploads/player-image.jpg",
      "role": "Batsman",
      "team": "RCB"
    }
  ]
}
```

### 2. Create Player
**POST** `/players`

Add a new IPL player to the database.

#### Request Body (Form Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Player's full name |
| `team` | string | Yes | Team name |
| `country` | string | Yes | Player's country |
| `runs` | number | Yes | Total runs scored |
| `role` | string | Yes | Player role (Batsman, Bowler, All-rounder) |
| `salary` | number | Yes | Player's salary |
| `image` | file | No | Player's image (max 5MB) |

#### Example Request
```bash
curl -X POST http://localhost:3000/api/players \
  -F "name=Virat Kohli" \
  -F "team=RCB" \
  -F "country=India" \
  -F "runs=6624" \
  -F "role=Batsman" \
  -F "salary=150000000" \
  -F "image=@player-image.jpg"
```

#### Example Response
```json
{
  "message": "Player created successfully"
}
```

### 3. Update Player
**PATCH** `/players/:id`

Update an existing IPL player's information.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Player's unique ID |

#### Request Body (Form Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Player's full name |
| `team` | string | No | Team name |
| `country` | string | No | Player's country |
| `runs` | number | No | Total runs scored |
| `role` | string | No | Player role (Batsman, Bowler, All-rounder) |
| `salary` | number | No | Player's salary |
| `image` | file | No | Player's image (max 5MB) |

#### Example Request
```bash
curl -X PATCH http://localhost:3000/api/players/550e8400-e29b-41d4-a716-446655440000 \
  -F "runs=6700" \
  -F "salary=160000000"
```

#### Example Response
```json
{
  "message": "Player updated successfully"
}
```

### 4. Delete Player
**DELETE** `/players/:id`

Remove an IPL player from the database.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Player's unique ID |

#### Example Request
```bash
curl -X DELETE http://localhost:3000/api/players/550e8400-e29b-41d4-a716-446655440000
```

#### Example Response
```json
{
  "message": "Player deleted successfully"
}
```

### 5. Get Player Description
**GET** `/players/:id/description`

Retrieve detailed information about a specific player.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Player's unique ID |

#### Example Request
```bash
GET /api/players/550e8400-e29b-41d4-a716-446655440000/description
```

#### Example Response
```json
{
  "name": "Virat Kohli",
  "team": "RCB",
  "country": "India",
  "runs": 6624,
  "image": "http://localhost:3000/uploads/player-image.jpg",
  "role": "Batsman",
  "salary": 150000000
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "message": "Name is required"
}
```

### Not Found Error (404)
```json
{
  "error": "NotFoundError",
  "message": "Player not found"
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## Data Validation Rules

### Player Fields
- **name**: Required, 1-100 characters
- **team**: Required, 1-50 characters
- **country**: Required, 1-50 characters
- **runs**: Required, non-negative integer
- **role**: Required, must be one of: "Batsman", "Bowler", "All-rounder"
- **salary**: Required, positive number
- **image**: Optional, max 5MB, supported formats: JPEG, PNG, WebP

### Query Parameters
- **page**: Minimum 1
- **limit**: 1-100
- **sortBy**: name, team, runs, salary, createdAt
- **sortOrder**: asc, desc

## Examples

### Get all players from RCB sorted by runs
```bash
GET /api/players?team=RCB&sortBy=runs&sortOrder=desc
```

### Search for players by name
```bash
GET /api/players?search=Virat
```

### Get players with pagination
```bash
GET /api/players?page=2&limit=5
```

### Get top 10 highest paid players
```bash
GET /api/players?sortBy=salary&sortOrder=desc&limit=10
```

## Rate Limiting
Currently, no rate limiting is implemented.

## CORS
CORS is enabled for all origins in development mode.

## File Upload
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, WebP
- Images are automatically resized to 300x300 pixels
- Images are stored in the `/uploads` directory
- Image URLs are returned in the format: `http://localhost:3000/uploads/filename.jpg` 