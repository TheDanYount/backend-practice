# backend-practice
## httPIE commands (for testing) & output:
### For adding a movie:
#### Input
http localhost:8080/api/create-movie title="Example 1" summary="An example movie #1." link="www.examplemovie.com" rating=3.3
#### Output
"movieId": 2, "title": "Example 1"
### For getting movies:
#### Input
http get localhost:8080/api/read-movies
#### Output
"link": "www.examplemovie.com", "movieId": 2, "rating": "3.3", "summary": "An example movie #1.", "title": "Example 1"
### For updating a movie:
#### Input
http put localhost:8080/api/update-movie/2 title="Example 1" summary="An example movie #1." link="www.examplemovie.com" rating=3.6
#### Output
"link": "www.examplemovie.com", "movieId": 2, "rating": "3.6", "summary": "An example movie #1.", "title": "Example 1"
### For deleteing a movie:
#### Input
http delete localhost:8080/api/delete-movie/2
#### Output
A response without a body, but with the heading "HTTP/1.1 204 No Content"