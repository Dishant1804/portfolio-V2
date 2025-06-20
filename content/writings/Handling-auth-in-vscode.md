---
title: "Handling Authentication In VS Code Extension"
excerpt: "Managing authentication in a VS Code extension can be frustrating. Here's a practical solution using JWT tokens."
author: Dishant Miyani
date: "2024-10-30"
---

First things first while developing a VS Code extension, Don't use Normal VS Code, Instead use [VS Code Insiders](https://code.visualstudio.com/insiders/) which is a development version of VS Code specially built to test the changes when you want to build something that is related to VS Code.

Managing authentication in a VS Code extension can be frustrating. There aren't many tutorials that cover this topic in depth; most only explain basic concepts like registering a command and a small use case, without going into CRUD operations.

---

## The Challenge

I wanted to perform CRUD operations from my VS Code extension, which means I needed to send authenticated requests to the back-end. There are two main ways to do this:

- Using Cookies
- Using JWT token

Cookies is way too complicated when it comes to accessing it and storing the info in the global storage of VS Code. So, I decided to move with JWT token. After extensively researching about how to handle the authentication in the VS Code, I finally came up with a solution that works pretty well.

---

## Step-by-Step Solution

### Step 1: Create an Extension Project Ready for Development

```bash
npx --package yo --package generator-code -- yo code
```

### Step 2: Handling the Authentication with Express

We will fire up a local-server when there is a request to authenticate the user, (expecting a token from back-end in the URL parameters) we will get the token and extract it from URL and store it in VS Code.

The purpose of firing up the server is to just have a safe local server that will get the token without any tampering of security.

```javascript
//Authentication file
const vscode = require("vscode");
const express = require("express");
const { TokenManager } = require("./TokenManager.js"); // Token Manager explained below

const authenticate = (fn) => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  
  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.send(`<h1>Something went wrong</h1>`);
      return;
    }
    
    await TokenManager.setToken(token);
    fn();
    res.send(`<h1>Authentication was successful, you can close this now</h1>`);
    server.close();
  });
  
  const server = app.listen(54321, (err) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.env.openExternal(vscode.Uri.parse(`http://localhost:54321`));
    }
  });
};
```

---

## Token Manager Implementation

So what is Token Manager that I am using? Don't worry, it's just a custom file that handles the token and stores it in VS Code.

```javascript
//TokenManager file
const KEY = "your_token_name";

class TokenManager {
  static globalState;
  
  static setToken(token) {
    return this.globalState.update(KEY, token);
  }
  
  static getToken() {
    return this.globalState.get(KEY);
  }
  
  static removeToken() {
    return this.globalState.update(KEY, null);
  }
}

module.exports = { TokenManager };
```

---

## How It Works

1. **Local Server Setup**: When authentication is needed, we spin up a local Express server on port 54321
2. **Token Extraction**: The server listens for a GET request with the token as a URL parameter
3. **Token Storage**: Once received, the token is stored using VS Code's global state management
4. **Cleanup**: The server automatically closes after successful authentication

This approach provides a secure way to handle JWT tokens in VS Code extensions without the complexity of cookie management.