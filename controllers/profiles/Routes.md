# Routes

## Posts

GET /posts => render page to display all posts (pagination)
POST /posts => handle form submission to create a new post
GET /posts/:id => render page to display one post
GET /posts/:id/edit => render page with form to edit one post
PATCH /posts/:id => handle form submission to PARTIAL update to post
PUT /posts/:id => handle form submission to FULL update to post
DELETE /posts/:id => handle form submission to delete post

{
    _id: String,
    title: String,
    content: String,
    author: userId
}

### PATCH request
{
    content: "this is updated content of a post"
}

### PUT request
{
    title: "unchanged",
    content: "this is updated content of a post",
    author: "unchanged"
}

## Posts has comments

GET /posts/:id/comments => render page to display all comments of 1 post
GET /posts/:id/comments/new => render page to display form to create new comment
POST /posts/:id/comments => create new comment for a post
GET /posts/:id/comments/:commentId/edit => render page with form to edit one comment of 1 post
PATCH /posts/:id/comments/:commentId => handle form submission to PARTIAL update 1 comment in a post
PUT /posts/:id/comments/:commentId => handle form submission to FULL update 1 comment in a post
DELETE /posts/:id/comments/:commentId => handle form submission to delete comment in a post

## Authentication

authController

GET /login
POST /login
GET /register
POST /register
DELETE /logout

## Authorised Routes

usersController

isAdmin => GET /users
isAdmin => GET /users/:id
.
.
