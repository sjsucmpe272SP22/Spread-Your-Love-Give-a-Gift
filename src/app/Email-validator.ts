import { AbstractControl } from "@angular/forms";
import { ValidationErrors } from "@angular/forms";

export class CustomEmailValidator{
    static checkemail(control : AbstractControl):ValidationErrors|null{        
        let input:string = control.value as string;     
        let regex:string="^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$";   
        if(input.match(regex))
        return null;
        else return {'email':true};
    }
}