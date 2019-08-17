# Best pracitcies for node in docker in production

Best pracitcies (https://www.youtube.com/watch?v=Zgx0o8QjJk4&feature=youtu.be):

- use stretch slim jessie (e.g. node:12-slim)
- put node_modules to .dockerignore
- use `node` user, adjust permissions
- handle shutdown signals (`SIGINIT`)
  - run with node, not npm, because node will not get the signal
- set `NODE_ENV=production`

## How to

### Scale services:

```
docker-compose up --scale darlingdove_backend=2 darlingdove_frontend=2
```

### Always restart container:

```
restart: always
```

## TODO:

- collect logs
  - nginx
  - mongo
  - backend
  - frontend
- auto start on system reboot
- https://docs.docker.com/compose/production/
