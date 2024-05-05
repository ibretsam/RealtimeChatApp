# Chat Application

This is a simple chat application built with React Native. It allows users to send and receive messages in real-time. Users can also send images along with their messages.

## Technologies Used

- **State Management**: The application uses Zustand for global state management. Zustand is a small, fast and scaleable bearbones state-management solution. It has a simple and intuitive API that allows for a clear understanding of when and where state changes occur.
- **Authentication**: The application uses JWT (JSON Web Tokens) for user authentication, along with react-native-encrypted-storage for secure storage of user credentials. JWT is a compact, URL-safe means of representing claims to be transferred between two parties. This library provides a simple, easy-to-use API for storing data securely.
- **Real-time Features**: The chat functionality in the application is real-time, powered by WebSockets. This allows users to send and receive messages instantly without needing to refresh or reload the application.

## Features

- Real-time messaging: Send and receive messages in real-time.
- Image messaging: Send images along with your messages.
- Image viewing: View images in full screen with the ability to swipe through all images sent in the chat.
- Find users: Search for other users to chat with.
- Send connect requests: Send connect requests to other users to start a chat.
- Accept connect requests: Accept connect requests from other users to start a chat.
- User authentication: Securely log in and log out of the application.
- Secure storage: User credentials are securely stored on the device using react-native-encrypted-storage.

## Project Structure

- `src/screens/Login.tsx`: This is the login screen where users can enter their credentials to log in.
- `src/screens/Message.tsx`: This is the main chat screen where users can send and receive messages.
- `src/components/MyMessageBubble.tsx`: This component represents a message bubble for messages sent by the current user. It includes the message text and optionally an image.

## How to Run

1. Clone the repository: `git clone https://github.com/yourusername/chat-app.git`
2. Install the dependencies: `npm install`
3. Start the application: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.