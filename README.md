# A API for gympass services that provides access to gyms, studios, and wellness facilities close to the user. It caters to individuals looking for diverse fitness options and companies aiming to offer wellness benefits to their employees.

##  Business Rules

- [x] The user must not be able to register with a duplicate email;
- [x] The user cannot make 2 check-ins on the same day;
- [x] The user cannot check in if they are not near (100m) the gym;
- [x] The check-in can only be validated up to 20 minutes after it is created;
- [x] The check-in can only be validated by administrators;
- [x] The user profile can only be consulted using the user email by administrators;
- [x] The gym can only be registered by administrators;

## Functional Requirements

- [x] It must be possible to register;
- [x] It must be possible to authenticate;
- [x] It must be possible to get the profile of a logged-in user;
- [x] It must be possible to get the number of check-ins made by the logged-in user;
- [x] It must be possible for the user to get their check-in history;
- [x] It must be possible for the user to search for gyms nearby (within 10km);
- [x] It must be possible for the user to search for gyms by name;
- [x] It must be possible for the user to check in at a gym;
- [x] It must be possible to validate a user's check-in;
- [x] It must be possible to register a gym;

## Non-Functional Requirements

- [x] The user's password needs to be encrypted;
- [x] The application data needs to be persisted in a PostgreSQL database;
- [x] All data lists need to be paginated with 20 items per page;
- [x] The user must be identified by a JWT (JSON Web Token);

## ✨ Technologies

- [ ] Fastify
- [ ] TypeScript
- [ ] Docker
- [ ] Postgres
- [ ] Redis
- [ ] Zod
- [ ] Prisma ORM
- [ ] Vitest
- [ ] Supertest
- [ ] Husky

## ✨ Design Patterns

- [ ] Strategy
- [ ] Adapter
- [ ] Proxy
- [ ] Abstract Factory
- [ ] Simple Factory
- [ ] Repository

## ✨ Design Approaches

- [ ] Domain-driven development (DDD)

## ✨ Development Approaches

- [ ] Test-driven development (TDD)

## ✨ Test Approaches

- [ ] In Memory DataBase Test

## ✨ Test Patterns

- [ ] Fake
- [ ] Stub

## ✨ Test Conventions

- [ ] System Under Test (SUT)
