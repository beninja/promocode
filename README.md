# Promocode test

To run the micro-service:
```
npm start
```
To run the micro-service in dev env:
```
npm run start-dev
```

# Endpoints

* POST/promocodes
* POST/promocodes/validations

* /admin => For admin view with real-time logs and stats

# Using dotenv

This code using dotenv package.
To set your env vars on dev you can create a `.env` file in the root directory like this one:

```
DATABASE=mongodb://localhost:27017/promocode
OPENWEATHER_API_KEY=d0562f476913da692a065c608d0539f6
```
