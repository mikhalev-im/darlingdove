Scale services:

```
docker-compose up --scale darlingdove_backend=2 darlingdove_frontend=2
```

Always restart container:

```
restart: always
```

Production mode:

```
NODE_ENV=production
```

TODO:

- collect logs
  - nginx
  - mongo
  - backend
  - frontend
- auto start on system reboot
- https://docs.docker.com/compose/production/
