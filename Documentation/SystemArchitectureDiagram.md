# System Architecture Diagram

![Scholarslee System Architecture Diagram](scholarslee_system_architecture.png)

## Mermaid Source Code (Reference)

```mermaid
graph TB
    %% Styling
    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef frontend fill:#b3e5fc,stroke:#0277bd,stroke-width:2px,color:#000
    classDef backend fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#000
    classDef db fill:#dcedc8,stroke:#558b2f,stroke-width:2px,color:#000
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef network stroke-dasharray: 5 5,stroke:#9e9e9e

    subgraph "Client Layer"
        User((User))
        Browser[Web Browser]
        
        subgraph "Frontend Application (React/Vite)"
            MenteeApp[Mentee Panel]
            MentorApp[Mentor Panel]
            AdminApp[Admin Panel]
            
            Router[React Router]
            Context[Context API/State]
            Axios[Axios Client]
            SocketClient[Socket.io Client]
        end
    end

    subgraph "Network Layer"
        LB{Load Balancer / CDN}
    end

    subgraph "Backend Layer (Node.js/Express)"
        subgraph "API Server"
            Express[Express App]
            Middleware[Middleware Stack]
            Auth[Auth Service]
            Controllers[Controllers]
            Services[Business Services]
        end
        
        subgraph "Real-time Server"
            SocketServer[Socket.io Server]
        end
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB Atlas)]
        Redis[(Redis Cache - Optional)]
    end

    subgraph "External Services"
        Stripe[Stripe Payments]
        Cloudinary[Cloudinary Media]
        Google[Google APIs]
        Email[Email Service]
    end

    %% Client Interactions
    User -->|Interacts| Browser
    Browser -->|Loads| MenteeApp
    Browser -->|Loads| MentorApp
    Browser -->|Loads| AdminApp

    %% Frontend Internal
    MenteeApp & MentorApp & AdminApp --> Router
    Router --> Context
    Context --> Axios
    Context --> SocketClient

    %% Network Flow
    Axios -->|HTTPS/REST| LB
    SocketClient -->|WebSocket| LB
    LB -->|Forward| Express
    LB -->|Forward| SocketServer

    %% Backend Flow
    Express --> Middleware
    Middleware --> Auth
    Auth --> Controllers
    Controllers --> Services
    
    %% Real-time Flow
    SocketServer <-->|Events| Client
    SocketServer -->|Broadcast| SocketClient

    %% Database Interactions
    Services -->|Mongoose ODM| MongoDB
    Auth -->|User Data| MongoDB

    %% External Service Interactions
    Services -->|Process Payment| Stripe
    Services -->|Upload/Serve| Cloudinary
    Services -->|Calendar/Meet| Google
    Services -->|Send Notifications| Email

    %% Classes
    class User client
    class MenteeApp,MentorApp,AdminApp,Router,Context,Axios,SocketClient,Browser frontend
    class Express,Middleware,Auth,Controllers,Services,SocketServer backend
    class MongoDB,Redis db
    class Stripe,Cloudinary,Google,Email external
```

## Data Flow Description

### 1. User Interaction
- Users interact with one of three panels: **Mentee**, **Mentor**, or **Admin**.
- **React Router** handles client-side navigation.
- **Context API** manages global state (User, Auth, Notifications).

### 2. Network Communication
- **Axios** sends secure HTTPS REST requests for data operations.
- **Socket.io Client** establishes a persistent WebSocket connection for real-time features.
- Traffic passes through the network layer (CDN/Load Balancer) to the backend.

### 3. Backend Processing
- **Express Server** receives HTTP requests passing them through the **Middleware Stack** (CORS, Helium, Auth).
- **Controllers** handle request logic and validation.
- **Services** encapsulate business logic and communicate with external APIs and the database.
- **Socket.io Server** handles real-time events (Chat, Notifications) and broadcasts updates.

### 4. Data Persistence
- **MongoDB Atlas** stores all persistent data using **Mongoose** schemas.
- Collections include Users, Profiles, Bookings, Services, Messages, etc.

### 5. Third-Party Integrations
- **Stripe**: Handles secure payment processing and payouts.
- **Cloudinary**: Manages image and file uploads/delivery.
- **Google APIs**: Manages Login, Calendar events, and Meet links.
- **Notification Services**: Sends transactional emails and alerts.
