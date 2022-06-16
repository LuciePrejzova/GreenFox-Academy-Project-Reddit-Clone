"use strict";

// TODO: rename it to "okLoginResponse"
function successResponse(statusCode, successMsg) {
  return { statusCode, responseObject: { message: successMsg } };
}

function okResponse(token) {
  return { statusCode: 200, responseObject: { status: "ok", token } };
}

function okJwtResponse(responseObject) {
  return { statusCode: 200, responseObject };
}

function resourceCreatedResponse() {
  return { statusCode: 201 };
}

function resourceUpdatedResponse() {
  return { statusCode: 204 };
}

function failResponse(statusCode, errorMsg) {
  return { statusCode, responseObject: { error: errorMsg } };
}

function notFoundResponse() {
  return failResponse(404, "not found");
}

function serverErrorAdminResponse(errorMsg) {
  return failResponse(500, errorMsg);
}

function serverErrorResponse() {
  return failResponse(500, "Server error");
}

export {
  okResponse,
  failResponse,
  serverErrorResponse,
  okJwtResponse,
  resourceCreatedResponse,
  serverErrorAdminResponse,
  notFoundResponse,
  resourceUpdatedResponse,
  successResponse
};
