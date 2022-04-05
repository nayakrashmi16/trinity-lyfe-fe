import { ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';

export class PasswordValidator {
    static checkPasswords(password, confirmPassword): ValidatorFn  { 
        return (): ValidationErrors | null => {
            return password.value === confirmPassword.value ? null : { notSame: true }
          };
    }
}

