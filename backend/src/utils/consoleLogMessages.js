"use strict";

// colored custom console.log messages
class LogMessage {
    static DB_CONNECTION_SUCCESS = () =>
        console.log(
            LogColor.GREEN,
            "---------- Connection to database was successfull ----------"
        );

    static DB_CONNECTION_ERROR = () =>
        console.log(
            LogColor.RED,
            "----------------- No connection to database ------------------"
        );

    static MODEL_SYNCED_SUCCESS = () =>
        console.log(
            LogColor.GREEN,
            "------------- Table and model synced successfully -------------"
        );

    static MODEL_SYNCED_ERROR = () =>
        console.log(
            LogColor.RED,
            "---------------- Table and model was not synced ----------------"
        );
}

class LogColor {
    static GREEN = "\x1b[32m";
    static RED = "\x1b[31m";
}

export { LogMessage };