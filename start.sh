#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Force nvm to use the correct version
nvm use 22.0.0

# Get the absolute path to the correct Node.js executable
NODE_PATH="/Users/andreloureiro/.nvm/versions/node/v22.0.0/bin/node"

# Print debugging information
echo "Using Node.js from: $NODE_PATH"
echo "Node.js version: $($NODE_PATH --version)"

# Run the application with the correct Node.js version
exec "$NODE_PATH" --env-file=.env dist/src/index.js