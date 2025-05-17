🚀 Getting Started
Follow these steps to set up and run the XutaBE backend service:


✅ Prerequisites
Ensure you have the following installed on your system:

Node.js (version specified in .nvmrc, e.g., v14.17.0)

Yarn package manager

Docker (for database and other services, if applicable)


📦 Installation
Clone the Repository:

git clone https://github.com/FilipeBispo/XutaBE.git

cd XutaBE


Install Dependencies:

yarn install


⚙️ Configuration
Environment Variables:

Create a .env file in the root directory and define the necessary environment variables. For example:

env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/xutabe
Adjust the variables according to your environment and requirements.

Database Setup:

If the project uses a database, ensure it's running and accessible. You may need to run migrations or seed the database, depending on the setup.


🏗️ Build and Run
Build the Project:

yarn build
Start the Server:


yarn start
The server should now be running on the port specified in your .env file (default is 3000).



