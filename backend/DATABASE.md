# MySQL Database Setup for Quiz Game

## Database Configuration with Sequelize ORM

### 1. Create Database

```sql
CREATE DATABASE quiz_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_game;
```

### 2. Tables Structure

The application uses **Sequelize ORM** and will automatically create/sync the following tables when started:

#### Questions Table
Stores quiz questions with options and correct answers.
```sql
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    time_limit INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Game Sessions Table
Tracks game sessions and their status.
```sql
CREATE TABLE game_sessions (
    id VARCHAR(100) PRIMARY KEY,
    status ENUM('waiting', 'active', 'paused', 'ended') DEFAULT 'waiting',
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Participants Table
Stores participant information and scores.
```sql
CREATE TABLE participants (
    id VARCHAR(100) PRIMARY KEY,
    session_id VARCHAR(100),
    nickname VARCHAR(50) NOT NULL,
    socket_id VARCHAR(100),
    total_score INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    total_time_taken DECIMAL(10,2) DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);
```

#### Answers Table
Records all answer submissions.
```sql
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id VARCHAR(100),
    question_id VARCHAR(50),
    selected_answer VARCHAR(10),
    is_correct BOOLEAN,
    time_taken DECIMAL(10,2),
    points_earned INT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quiz_game
```

### 4. Features

- ✅ **Sequelize ORM** - No raw SQL queries, type-safe operations
- ✅ Automatic table creation and migration on startup
- ✅ Graceful fallback to in-memory storage if database unavailable
- ✅ Connection pooling for optimal performance
- ✅ Questions persist across server restarts
- ✅ JSON storage for question options
- ✅ Proper model associations and foreign key relationships
- ✅ BuiSequelize Models

The application includes the following Sequelize models:

- **QuestionModel** - Quiz questions with JSON options
- **GameSessionModel** - Game session tracking
- **ParticipantModel** - Player data with associations
- **AnswerModel** - Answer submissions with relationships

All models include proper associations, indexes, and validations.

### 6. Running the Application

The application will:
1. Initialize Sequelize connection pool
2. Test database connectivity
3. Sync models (creates/updates tables automatically)
4. Load questions from database if available
5. Fall back to default questions if database is empty
6. Continue working in memory-only mode if database is unavailable

**No manual SQL setup required** - Sequelize handles all migrations automatically

No manual setup required - just ensure MySQL is running and credentials are correct!
