import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-candidatelogin',
  templateUrl: './candidatelogin.component.html',
  styleUrls: ['./candidatelogin.component.css']
})
export class CandidateloginComponent implements OnInit {
  @ViewChild(DxFormComponent) form: DxFormComponent
  constructor() { }
  buttonOptions: any = {
    type: "success",
    text: "Login",
    width: "100%",

    useSubmitBehavior: true

  }
  buttonOptions1: any = {
    type: "default",
    text: "Login with Facebook",
    width: "100%",
    useSubmitBehavior: true

  }
  buttonOptions2: any = {
    type: "danger",
    text: "Login with Google",
    width: "100%",
    useSubmitBehavior: true

  }

  password = "";
  passwordOptions: any = {
    type: "required",
    value: this.password
  };

  Login: any =
    {
      "Email": "",
      "Password": ""
    }
  ngOnInit() {

  }
  onFormSubmit = function (e, Login) {
    console.log("Modal data ==>", e);
    console.log("Modal data ==>", Login);
    notify({
      message: "You have submitted the form",
      position: {
        my: "center top",
        at: "center top"
      }
    }, "success", 3000);

    e.preventDefault();
  }

}
