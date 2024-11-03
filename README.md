# Questions

This app allows users to create and vote in polls.

Stack:

- Nest.js
- React
- Ts
- TailwindCSS
- PostgreSQL
- Docker

## Backend API endpoints (and what for):

```
/api/polls - main endpoint
```

`GET` - returns this oject `{ success: true, count: polls.length, data: polls }`

`POST` - expects object like this `{ name: title, questions: questions[], votes: [] }`

`Pagination` - expects start and end numbers.

`/api/polls/0/5` - picks from 0 to 5th poll

`Votes` - are all live for every user, through `websocket`

`DELETE` - You can delete a poll, but I never used this in frontend :p

## How to run docker