import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

// Validate user name only if not existing in database
export function usernameValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return authService.fetchAll()
    .pipe(
      map(users => {
        const user = users.find(user => user.name == control.value);
        return user ? {userExists: true} : null;
      })
    )
  }
}

// Validate user email only if not existing in database
export function emailValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return authService.fetchAll()
    .pipe(
      map(users => {
        const user = users.find(user => user.email === control.value);
        return user ? {userExists: true} : null;
      })
    )
  }
}
