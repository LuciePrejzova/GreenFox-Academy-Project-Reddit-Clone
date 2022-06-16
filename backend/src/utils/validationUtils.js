"use strict";

class ValidationUtils {

    fieldIsNotBlank(stringInput) {
        return stringInput != null && stringInput.trim().length > 0;
    };

    isValidEmail(stringInput) {
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return mailRegex.test(stringInput);
    };

    isValidNumber(input) {
        let reg = new RegExp("^[0-9]*$");
        if (reg.test(input) === false) {
            return false;
        } else {
            return true;
        }
    };

    isValidString(input) {
        return typeof input === "string" && !this.isValidNumber(input);
    };

    // Generate random x-long character string as long as it is not different from existingToken
    generateRandomToken(x) {
        var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(x)].reduce(a => a + p[~~(Math.random() * p.length)], '');
    };

    generateRandomTokenToMatchRegex(charactersCount, regex) {
        do {
            var generatedPassword = this.generateRandomToken(charactersCount);
        } while (!regex.test(generatedPassword));
        return generatedPassword;
    }

    // Compare date of now with given date. Return false if (date of now - given date > duration). Duration given in hours.
    isTimeValid(duration, givenDate) {
        let createdAt = new Date(givenDate);
        let currentDate = Date.now();
        // 1 hour = 3600000 ms.
        if ((currentDate.valueOf() - createdAt.valueOf()) / 3600000 > duration) {
            return false;
        }
        return true;
    };

    isValidFieldInChannel(input) {
        const channelFields = [
            "id",
            "name",
            "backgroundImage",
            "description",
            "createdAt",
            "post"
        ];
        return channelFields.includes(input);
    };

    isValidOrderValue(input) {
        const orderValues = [
            "asc",
            "desc"
        ];
        return orderValues.includes(input);
    };

    isValidCountValue(input) {
        const countValues = [
            "false",
            "true",
            false,
            true
        ];
        return countValues.includes(input);
    };

    objectIsBlank(obj) {
        const isEmpty = Object.keys(obj).length === 0;
        const isNullOrUndefined = obj == null;
        return isEmpty || isNullOrUndefined;
    }

    itemHasBase64Encoding(item) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(item);
    }

    onlyLettersAndNumbers(str) {
        return /^[A-Za-z0-9]*$/.test(str);
    }

}

const validationUtils = new ValidationUtils();
export { validationUtils, ValidationUtils };
