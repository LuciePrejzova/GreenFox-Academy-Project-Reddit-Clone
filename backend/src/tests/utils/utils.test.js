import {validationUtils} from "../../utils/validationUtils.js";

test("'1' is a valid number", () => {
  expect(validationUtils.isValidNumber("1")).toBe(true);
});

test("1 is a valid number", () => {
  expect(validationUtils.isValidNumber(1)).toBe(true);
});

test("'Bilbo' is not a number", () => {
  expect(validationUtils.isValidNumber("Bilbo")).toBe(false);
});

test("-1 is not a valid number", () => {
  expect(validationUtils.isValidNumber(-1)).toBe(false);
});

test("generateRandomToken(24) returns a 24-long string made of uppercase, lowercase and numbers", () => {
  let pattern = /^[a-zA-Z0-9]{24}$/g;
  expect(pattern.test(validationUtils.generateRandomToken(24))).toBe(true);
});

test("'dog' is a valid string", () => {
  expect(validationUtils.isValidString("dog")).toBe(true);
});

test("1 is not a valid string", () => {
  expect(validationUtils.isValidString(1)).toBe(false);
});

describe("'fieldIsNotBlank' function should return desired output", () => {
  // should return true
  expect(validationUtils.fieldIsNotBlank("field")).toBe(true);

  // should return false
  expect(validationUtils.fieldIsNotBlank("")).toBe(false);
  expect(validationUtils.fieldIsNotBlank("   ")).toBe(false);
  expect(validationUtils.fieldIsNotBlank(null)).toBe(false);
  expect(validationUtils.fieldIsNotBlank(undefined)).toBe(false);
})

describe("'isValidEmail' function should return desired output", () => {
  // should return true
  expect(validationUtils.isValidEmail("test@gmail.com")).toBe(true);
  expect(validationUtils.isValidEmail("test.abc@seznam.cz")).toBe(true);

  // should return false
  expect(validationUtils.isValidEmail("test")).toBe(false);
  expect(validationUtils.isValidEmail("@")).toBe(false);
  expect(validationUtils.isValidEmail("test@gmail@.com")).toBe(false);
})

test("'name' is a valid field in channel", () => {
  expect(validationUtils.isValidFieldInChannel("name")).toBe(true);
});

test("'dog' is not a valid field in channel", () => {
  expect(validationUtils.isValidFieldInChannel("dog")).toBe(false);
});

test("'new channel' is not a valid string for channelName", () => {
  expect(validationUtils.onlyLettersAndNumbers("new channel")).toBe(false);
});

test("'new@channel' is not a valid string for channelName", () => {
  expect(validationUtils.onlyLettersAndNumbers("new@channel")).toBe(false);
});

test("'newChannel4' is a valid string for channelName", () => {
  expect(validationUtils.onlyLettersAndNumbers("newChannel4")).toBe(true);
});
