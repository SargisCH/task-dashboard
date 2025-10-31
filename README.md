# Task monorepo
## NX | NestJS | Vue 3 | TypeScript 

## Description

Monorepo project with NX Workspaces, Vue 3, NestJS and TypeScript.

* [NX workspace](https://nx.dev/getting-started/intro) to manage monorepo
* Full Stack: Front-end, Back-end, Shared/Utils module packages 
* Front-end package: [Vue 3](https://vuejs.org/guide/introduction.html) | [Vite](https://vitejs.dev/guide/)
* Back-end package: [NestJS](https://docs.nestjs.com)
* Shared package: shared code used in all packages
* Docker support

## Quick start

```bash
# 1. Install the project and build packages in libs folder
npm install

# 2. Dev: Run frontend with hot reload 
npm run web:dev

# 3. Dev: Run backend with hot reload 
# Note that you need to create the .env file in the project root directory beforehand
# You can copy the .env.example file and rename it to .env
# Then you can configure database access and other server settings
npm run server:dev

# 4. Or run backend and frontend with hot reload parallel
npm run apps:dev

# 5. Seed the users into database
npm run server:seed

# 6. Login with admin user
email: admin@admin.com
password: 123456

```

## Run with docker

```bash
# 1. Install the project and build packages in libs folder
npm install

# 2. Build   
npm run build

# 3. run docker containers for mysql instance and server app
docker compose up -d 

# 4. Seed the users into database
npm run server:seed

```
## Environment variables

### .env.example did


A Monorepo project for completing tasks project assignment. This is monorepo bootstraped in nx workspaces with Nest.js, Vue.js. 

Frontend: For ui composition I used quasar as I didn't need much customization and Quasar can deliver ui very fast and don't have worry about accesbilities and styling, I could customize some components though if I had to. For the store I went with pinia as I don't have much experience in vue, pinia looked very straightforward to me to define a store and the account sessions in store and make available for all part of the app.

Backend: I choosed Nest.js, I have actually copied one of my templates from my earlier side projects, I have also completed all the setups there like pipes, validations, middlewares to skip some setup curves. The dependenies are a little bit outdated like I used Yup bit I could use Zod but the already is using Yup, so it gave me head start to jump right to the development and in this tight deadline it was making perfect sense to me.
Authentication is simple just jwt, I didn't create a signup functionality to not lose time there instead I am generating admin user in seeds. Please check   `apps/server/src/app/cli/seed/seed-data.ts`. Currently I seed only users, but the service is extensible so there will be no issues to add other seed functinality in the future. I will need just a function to get the data and insert ot db. The other user actually can login too but the roles and services are not configured to show them content exactly for them. The role compatrison mechanism is there bot  fot frontend routes and backend endpoints. I just haven't used them. 
