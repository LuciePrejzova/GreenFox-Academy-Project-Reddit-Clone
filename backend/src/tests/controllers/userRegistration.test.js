import request from "supertest";
import { app } from "../../server.js";
import 'regenerator-runtime/runtime.js'
import {jest} from '@jest/globals';
jest.useFakeTimers()
jest.setTimeout(20000)

describe("one or more attributes are missing", () => {

  it("POST /registration -> all attributes are missing", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({})
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({ error: "missing credentials" });
  });

  it("POST /registration -> username is missing", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({
        email: "test@email.com",
        password: "PwTest01",
        password_repeat: "PwTest01"
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({ error: "missing credentials" });
  });

  it("POST /registration -> password and email are missing", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({
        username: "userTest",
        password_repeat: "PwTest01"
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({ error: "missing credentials" });
  });

});

describe("password does not match required conditions", () => {

  it("POST /registration -> password is less than 8 character-long", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({
        username: "userTest",
        email: "test@email.com",
        password: "PwT01",
        password_repeat: "PwT01"
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({
      msg: 'Please enter a password with min. 8 chars, 1 uppercase and 1 number'
    });
  });

  it("POST /registration -> password doesn't contain a number", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({
        username: "userTest",
        email: "test@email.com",
        password: "PasswordTest",
        password_repeat: "PasswordTest"
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({
      msg: 'Please enter a password with min. 8 chars, 1 uppercase and 1 number'
    });
  });

  it("POST /registration -> password doesn't contain min. 1 uppercase", async () => {
    const { body } = await request(app)
      .post("/registration")
      .send({
        username: "userTest",
        email: "test@email.com",
        password: "pwtest01",
        password_repeat: "pwtest01"
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(body).toEqual({
      msg: 'Please enter a password with min. 8 chars, 1 uppercase and 1 number'
    });
  });

});

//THIS NEEDS TO BE COMMENTED OUT UNTIL A MOCK DB CAN BE USED
// describe("all attributes are correct", () => {
//   it("POST /resgistration -> all attributes are correct", async () => {
//     const response = await request(app)
//       .post("/registration")
//       .send({
//         username: "userTest2",
//         email: "test2@email.com",
//         password: "PwTest01",
//         password_repeat: "PwTest01"
//       })
//       .expect("Content-Type", /json/)
//       .expect(201);
//     expect(response.statusCode).toBe(201)
//     expect(body).toEqual({
//       id: expect.any(Number),
//       status: 'Successfully created new user userTest'
//     });
//   });
// });



