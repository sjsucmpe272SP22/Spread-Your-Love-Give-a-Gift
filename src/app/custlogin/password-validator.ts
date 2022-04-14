import { AbstractControl } from "@angular/forms";
import { ValidationErrors } from "@angular/forms";

export class PasswordValidator{
    static passwordcheck(control : AbstractControl):ValidationErrors|null{        
        let input:string = control.value as string;     
        let regex:string="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W])[0-9a-zA-Z\\W]{1,}$";   
        if(input.match(regex))
        return null;
        else return {'passwordcheck':true};
    }
}