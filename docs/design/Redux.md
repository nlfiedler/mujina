# Redux

## Why Redux?

It most closely resembles Elm in terms of how it manages the application state.
Considering that state is the most difficult aspect of an application to manage,
it is important to use a system that manages it very carefully.

## Why One Store Per Renderer Process?

There is a redux store per renderer process because the majority of the state
is specific to the browser window. The rest of the shared application state
lives in the backend.
