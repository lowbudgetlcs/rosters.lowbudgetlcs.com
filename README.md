# rosters.lodbugetlcs.com

This is an internal roster management portal, which uses Vue for a SPA frontend and Express,js for an EXTREMELY simple CRUD-backend. The complexity of this project will likely increase in the future, but for now this is all it is.

This project is split into two parts- frontend and backend. These are self explanatory, and are expected to be deployed as two separate processes. However, they depend on each other and as such have been bundled together in this repository. There is a docker-compose.yaml file that will deploy both in the same docker network so they can communicate- the backend is not a public-facing service.
