# Authentication Package

This package provides user authentication functionalities for the backend, including JWT verification middleware, service functions for user management, and routes for handling authentication-related requests.

## Features

- JWT verification middleware to protect routes
- Service functions to manage user data
- Routes for authentication-related endpoints

## Installation

To install the package, run the following command:

```
npm install
```

## Usage

### Middleware

The `requireAuth` middleware can be used to protect routes that require authentication. It verifies the JWT and adds the user object to the request.

```typescript
import { requireAuth } from './src/middleware/jwtMiddleware';
```

### Service Functions

The package includes service functions to interact with user data:

- `getUserFromToken(token: string): Promise<User>`: Retrieves user information from the provided token.
- `isAdmin(user): boolean`: Checks if the user has admin privileges.

### Routes

The package provides a route handler for the `/api/me` endpoint, which returns the authenticated user's information.

```typescript
import { authRoutes } from './src/routes/authRoutes';
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.