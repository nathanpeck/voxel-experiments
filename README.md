## Introduction

Testbed project for messing around with WebGL, and client server architecture in an MMORPG game.

Goals:

* Experiment with WebGL frameworks
* Learn a bit more about Postgres
* Create efficient game server model
* Play around with interesting alternative MMORPG ideas that I have.

## Project Structure

```
.
├── README.md
├── client - Code for the browser client
├── server - Code for the server side component
└── shared - Code that is shared by both server and client
```

# Getting Started

To launch the project:

```bash
./build.sh
```

This will start a Vagrant instance (assuming that you have a provider to actually start the Vagrant with). Once the Vagrant is started you can access the following services:

* http://localhost:8080 - The game client is served here
* http://localhost:8081 - The game server runs here

To SSH into the guest Vagrant:

```bash
vagrant ssh
```

The project can be found at `/vagrant`
