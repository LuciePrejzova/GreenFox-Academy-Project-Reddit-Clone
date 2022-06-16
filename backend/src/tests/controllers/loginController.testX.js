import request from "supertest";
import { app } from "../../server.js";
import 'regenerator-runtime/runtime.js'
import {jest} from '@jest/globals';
jest.useFakeTimers()
jest.setTimeout(20000)

describe("one or multiple required attributes are missing", () => {
  
  const missingCredentialsResponse = { error: "missing credentials" };

  it("POST /login -> body with credentials is not provided", () => {
    return request(app)
      .post("/login")
      .expect("Content-Type", /json/)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual(missingCredentialsResponse);
      });
  });

  it("POST /login -> missing password and email", () => {
    return request(app)
      .post("/login")
      .send({ username: "Lojza" })
      .expect("Content-Type", /json/)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual(missingCredentialsResponse);
      });
  });

  it("POST /login -> missing email and username", () => {
    return request(app)
      .post("/login")
      .send({ password: "unodostres" })
      .expect("Content-Type", /json/)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual(missingCredentialsResponse);
      });
  });
});

