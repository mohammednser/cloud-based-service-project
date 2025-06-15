# Cloud-Based Document Analysis System

This project is a cloud-based document analysis system built with React and AWS Amplify. It provides functionalities for document upload, search, sort, classification, and statistics.

## Features

- Document upload to AWS S3
- Text search with highlighted results
- Document sorting by title
- Automatic document classification
- Statistics dashboard
- Web crawling integration (placeholder)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- AWS Account
- AWS Amplify CLI
- Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cloud-based-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Amplify:
   ```bash
   amplify init
   ```

4. Add necessary Amplify resources:
   ```bash
   amplify add auth
   amplify add storage
   amplify add api
   ```

5. Push Amplify changes:
   ```bash
   amplify push
   ```

6. Create a `.env` file in the root directory and add your API keys:
   ```
   REACT_APP_NLP_CLOUD_API_KEY=your_api_key_here
   ```

7. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/
│   ├── Upload.tsx
│   ├── Search.tsx
│   ├── Sort.tsx
│   └── Stats.tsx
├── graphql/
│   ├── queries.ts
│   └── mutations.ts
├── App.tsx
└── aws-exports.js
```

## Deployment

1. Connect your repository to AWS Amplify Console
2. Configure build settings
3. Deploy the application

## Environment Variables

The following environment variables are required:

- `REACT_APP_NLP_CLOUD_API_KEY`: API key for NLP Cloud
- AWS credentials (configured via Amplify)

## Performance Considerations

- Documents are processed in chunks to optimize memory usage
- Search operations use efficient DynamoDB queries
- UI components implement lazy loading
- API calls are minimized and batched where possible

## Security

- All AWS resources are protected with appropriate IAM roles
- API keys are stored securely in environment variables
- File uploads are validated for type and size
- Authentication is handled by AWS Cognito

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
