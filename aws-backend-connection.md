# Connecting to AWS Backend

This guide explains how to connect your frontend application to backends hosted on AWS.

## Prerequisites

1. Backend services deployed on AWS with proper API endpoints
2. API Gateway, ALB, or other public entry points configured for your backend services
3. CORS configured on your backend to allow requests from your frontend domain

## Configuration Steps

### 1. Environment Configuration

Create a `.env.production` file in your project root with your AWS endpoints:

```
# AWS Backend URLs
VITE_USER_SERVICE_URL=https://your-aws-api-gateway.execute-api.region.amazonaws.com/user-service
VITE_ORDER_SERVICE_URL=https://your-aws-api-gateway.execute-api.region.amazonaws.com/order-service
VITE_BILL_SERVICE_URL=https://your-aws-api-gateway.execute-api.region.amazonaws.com/bill-service

# Other configuration
VITE_API_TIMEOUT=30000
```

Replace the placeholder URLs with your actual AWS endpoints.

### 2. Build for Production

When building for production, the environment variables will be injected into your application:

```bash
npm run build
```

Or if you're using Yarn:

```bash
yarn build
```

### 3. Testing AWS Connection

To test your AWS connection:

1. Set up your environment variables
2. Run a development build pointing to AWS:
   ```bash
   # With npm
   npm run dev -- --mode production
   
   # With yarn
   yarn dev --mode production
   ```
3. Check the browser console for any CORS or connection errors

### 4. Troubleshooting

#### CORS Issues

If you encounter CORS errors:

1. Ensure your AWS backend has the following CORS headers:
   ```
   Access-Control-Allow-Origin: https://your-frontend-domain.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

2. For API Gateway, configure CORS in the API Gateway console or via CloudFormation

#### Authentication Issues

If your tokens aren't being accepted:

1. Check the token format matches what your AWS backend expects
2. Ensure the proper Authorization header is being sent
3. Verify token expiration and refresh logic

#### Network Errors

For timeouts or network errors:

1. Verify your API endpoints are publicly accessible
2. Check that your AWS security groups allow traffic from your frontend
3. Increase the `VITE_API_TIMEOUT` if necessary

## AWS Backend Considerations

### API Gateway

If using API Gateway:

1. Create a custom domain for your API to avoid CORS issues
2. Configure proper stages (dev, prod)
3. Set up request validation
4. Consider using API keys for additional security

### Load Balancers

If using Application Load Balancer:

1. Configure health checks
2. Set up proper target groups
3. Configure SSL/TLS for secure communication

### Security

1. Use HTTPS for all communication
2. Implement proper JWT validation on the backend
3. Consider using AWS WAF for additional protection
4. Set up proper IAM roles and permissions

## Deploying the Frontend

For deploying your frontend:

1. Consider using AWS Amplify for seamless deployment
2. Alternatively, use S3 + CloudFront for static hosting
3. Set up proper CI/CD pipelines for automated deployments 