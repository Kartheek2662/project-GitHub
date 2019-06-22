import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '../../../node_modules/@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../shared/data-service.service';
import { CommonService } from '../shared/common.service';
import * as Quill from 'ngx-quill';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  @Output() msgEvent = new EventEmitter<string>();
  bsValue = new Date();
  maxDate = new Date();
  //bsRangeValue: date[];
  datePickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  submitted = false;
  domainList = [];
  industryList = [];
  v_addList = [];
  YearList = [];
  MonthList = [];
  passYear = [];
  vAddressList = [];
  comUserList = [];
  compInfo: any = [];
  userInfo: any;
  uID: any = [];
  eUserList: any = [];
  eUserRole: any = [];
  WorkFlowList: any = [];
  AssessmentList: any = [];
  roleField: boolean = false;
  dateError: string;
  expError: string;
  dateComp: boolean = false;
  expComp: boolean = false;
  max = 5;
  EventSkill: any = [];
  skillViewList: any = [];
  eduViewList: any = [];
  eduList: any = [];
  eduErr: boolean = false;
  skillFamily: any = [];
  skillList: any = [];
  courseList: any = [];
  isEventUserEdit: boolean = false;
  cnfDeleteEdu: boolean = false;
  cnfDeleteSkill: boolean = false;
  isSkillShow: boolean = false;
  isAddSkill: boolean = false;
  addSkillError: string;
  isUserAdd: boolean = false;
  isEduAdd : boolean =false;
  skillErr: boolean = false;
  skillFamilyErr: boolean = false;
  overStar: number;
  isReadonly: boolean = true;
  skillField: boolean = false;
  isSkillEdit: boolean = false;
  userRoll: boolean = false;
  roleTitle: boolean = false;
  fieldShow: any = [];
  workflow: any = [];

  eventCreateModel: any = {
    "rid": "0",
    "cid": "",
    "title": "",
    "industry": "",
    "domain": "",
    "keyWords": "",
    "sDate": "",
    "eDate": "",
    "jobDescription": "",
    "passoutYear": "",
    "exp_From": "",
    "exp_To": "",
    "AssessmentID": "",
    "WorkflowID": "",
    "EventUser": [],
    "EventSkill": [],
    "EventEdu": [],
    "CUser": "",
    "V_Address": "",
    "JobType": "2",
    "JobTime": "2"
  }

  fnResetEventModel(eventForm: NgForm) {
    this.eventCreateModel = {
      "rid": "0",
      "cid": "",
      "title": "",
      "industry": "",
      "domain": "",
      "keyWords": "",
      "sDate": "",
      "eDate": "",
      "jobDescription": "",
      "passoutYear": "",
      "exp_From": "",
      "exp_To": "",
      "AssessmentID": "",
      "WorkflowID": "",
      "EventUser": [],
      "EventSkill": [],
      "EventEdu": [],
      "CUser": "",
      "V_Address": "",
      "JobType": "2",
      "JobTime": "2"
    }
    eventForm.reset();
    eventForm.resetForm();
  }

  constructor(private router: Router, private http: HttpClient, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService, private dataservice: DataServiceService, private common: CommonService) {

    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'DD-MMM-YYYY'
      });
    this.maxDate.setDate(this.maxDate.getDate() + 10);
    this.minDate = new Date();
    //this.bsRangeValue = [this.maxDate];
    this.eventCreateModel.sDate = this.bsValue;
    this.eventCreateModel.eDate = this.maxDate;
    this.eUserList = [];
    this.skillViewList = [];
  }

  ngOnInit() {
    this.common.currentMessage.subscribe(data => this.userInfo = data);
    let currentDate = new Date();
    this.getDomainList();
    this.getIndustyList();
    this.compInfo = this.common.getLoginUserInfo();
    this.uID = JSON.parse(atob(sessionStorage.getItem('userInfo')));
    this.getVaddressList(this.uID.companyId);
    this.getCUserListByID(this.uID.companyId);
    this.getAssessmentList();
    this.getWorkflowList();
    this.fnSkillFamily();
    this.fnGetCourseList();
    this.v_addList = this.dataservice.v_addList;
    this.YearList = this.dataservice.fnExpYearList();
    this.passYear = this.common.fnPassoutYearList();
    this.eUserRole = this.dataservice.eUserRole;
    let currentYear = currentDate.getFullYear();
    this.eventCreateModel.passoutYear = currentYear - 1;
    this.eventCreateModel.JobType = "0";
    this.eventCreateModel.JobTime = "0";
  }
  ngAfterViewInit() {
    /* $(document).ready(function () {
      $("p").click(function () {
        $(this).hide();
      });
    }); */
  }

  fnValidateEventForm(data) {
    let isvalidate = false;
    if (data.title && data.industry && data.domain && data.keyWords && data.sDate && data.eDate && data.jobDescription && data.passoutYear && (data.exp_From >= 0) && (data.exp_To >= 0) && data.EventUser && data.AssessmentID && data.WorkflowID && data.CUser && data.EventSkill && data.EventEdu && data.V_Address && data.JobType && data.JobTime) {
      let startDate = new Date(data.sDate);
      let endDate = new Date(data.eDate);
      if (startDate > endDate) {
        this.dateError = "End date should be greater than start date";
        this.dateComp = true;
        return false;
      }
      else {
        isvalidate = true;
        this.dateComp = false;
      }
      if (parseInt(data.exp_From) == 0 && parseInt(data.exp_To) == 0) {
        this.expError = "Both field can't select as 0";
        this.expComp = true;
        isvalidate = false;
        return false;
      }
      else if (parseInt(data.exp_From) > parseInt(data.exp_To)) {
        this.expError = "Experience From must be less then experience To!";
        this.expComp = true;
        isvalidate = false;
        return false;
      }
      else if (parseInt(data.exp_From) == parseInt(data.exp_To)) {
        this.expError = "Both field can't select same value!";
        this.expComp = true;
        isvalidate = false;
        return false;
      }
      else {
        this.expComp = false;
        isvalidate = true;
      }
      if(data.EventEdu.length != 0)
      {
        isvalidate = true;
        this.isEduAdd = false;
      }
      else
      {
        isvalidate = false;
        this.isEduAdd = true;
        return false;
      }
      //data.EventSkill && data.V_Address && data.JobType && data.JobTime
      if (data.EventSkill.length != 0) {
        isvalidate = true;
        this.isAddSkill = false;
      }
      else {
        isvalidate = false;
        this.isAddSkill = true;
        return false;
      }

      if (data.EventUser.length != 0) {
        isvalidate = true;
        this.isUserAdd = false;
      }
      else {
        isvalidate = false;
        this.isUserAdd = true;
        return false;
      }

      if (data.V_Address >= 0) {
        isvalidate = true;
      }
      else {
        isvalidate = false;
        return false;
      }

      if (data.AssessmentID >= 0 && data.WorkflowID >= 0 && data.CUser >= 0) {
        isvalidate = true;
      }
      else {
        isvalidate = false;
        return false;
      }
    }
    else {
      isvalidate = false;
    }
    return isvalidate;
  }
  eventSubmit(form) {
    this.eventCreateModel.cid = this.uID.companyId;
    this.eventCreateModel.CUser = this.uID.rid;
    this.eventCreateModel.EventUser = Object.assign(this.eUserList);
    this.eventCreateModel.EventSkill = Object.assign(this.EventSkill);
    this.eventCreateModel.EventEdu = Object.assign(this.eduList);
    console.log("Event Create MOdel ==>",this.eventCreateModel)
    if (this.fnValidateEventForm(this.eventCreateModel)) {
      this.spinnerService.show();
      this.common.fnPostAPI('/Events/SaveEventsInfo', this.eventCreateModel)
        .subscribe((data: any) => {
          this.spinnerService.hide();
          if (data && data.status && data.code === this.dataservice.status.success) {
            this.toastr.success("Event Created Successfully");
            const eCode =
            {
              "eId": data.rid,
              "eCode": data.refID
            }
            localStorage.setItem("eCreate", JSON.stringify(eCode));
            this.fnResetEventModel(form);
            this.router.navigate(['/event-success']);
            this.eUserList = [];
          }
          else {
            //error toaster
            this.toastr.error(data.message);
          }
        });
    }
  }

  getDomainList() {
    this.spinnerService.show();
    this.http.get('/Common/GetDomainList')
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.domainList = data;
      });
  }
  fnGetCourseList() {
    this.spinnerService.show();
    this.common.fnGetAPI('/Candidate/GetCourseList')
      .subscribe((data: any) => {
        if (data && data.status && data.code === this.dataservice.status.success) {
          this.courseList = data.resObject;
        }
        else {
          this.courseList = [];
        }
      });
  }
  getVaddressList(companyId) {

    if (companyId) {
      const getVaddress = {
        "RID": companyId
      }
      this.spinnerService.show();
      this.common.fnPostAPI('/Events/GetVenueAddressListByID', getVaddress)
        .subscribe((data: any) => {
          this.spinnerService.hide();

          if (data && data.status && data.code === this.dataservice.status.success) {
            this.vAddressList = data.resObject;
          }
          else {
            //error toaster
          }
        });
    }
  }

  getCUserListByID(companyId) {
    if (companyId) {
      const getCompUser = {
        "CID": companyId
      }
      this.spinnerService.show();
      this.common.fnPostAPI('/Events/GetCUserListByID', getCompUser)
        .subscribe((data: any) => {
          this.spinnerService.hide();
          if (data && data.status && data.code === this.dataservice.status.success) {
            this.comUserList = data.resObject;
          }
          else {
            //error toaster
            this.comUserList = [];
          }
        });
    }
  }
  getIndustyList() {
    this.spinnerService.show();
    this.common.fnGetAPI('/Common/GetIndustryList')
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.industryList = data;
      });
  }
  getWorkFlow(fId) {
    if (fId) {
      const flowInfo =
      {
        "RID": fId
      }
      this.spinnerService.show();
      this.common.fnPostAPI('/Events/GetWorkflowListByID', flowInfo)
        .subscribe((data: any) => {
          this.spinnerService.hide();
          this.workflow = data.resObject
        });
    }


  }
  getWorkflowList() {
    this.spinnerService.show();
    this.common.fnGetAPI('/Events/GetWorkflowList')
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.WorkFlowList = data.resObject;
      });
  }

  getAssessmentList() {
    this.spinnerService.show();
    this.common.fnGetAPI('/Events/GetAssessmentList')
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.AssessmentList = data.resObject;
      });
  }

  backToDashboard(createEvent) {
    this.fnResetEventModel(createEvent);
    this.router.navigate(['/event-list']);
  }

  fnValidateEventUsersForm(data: any) {
    let isValid = false;
    if (data && data.UserID && data.Role) {
      if (data.UserID >= 0 && data.Role >= 0) {
        isValid = true;
        return true;
      }
      else {
        isValid = false;
        return false;
      }
    }
    else {
      isValid = false;
    }
    return isValid;
  }
  eventUserRole: any =
    {
      "UserID": "",
      "Role": ""
    }
  fnResetUserRole(eventUser) {
    eventUser.reset();
    eventUser.resetForm();
    this.eventUserRole =
      {
        "UserID": "",
        "Role": ""
      }
  }

  isAddUserCan: boolean = false;
  fnAddEventUserRole() {
    this.roleField = false;
    this.isAddUserCan = true;
    this.userRoll = false;
    this.roleTitle = false;
    this.isEventUserEdit = false;
    this.eventUserRole.Role = "";
    this.eventUserRole.UserID = "";
  }
  fnUserRoleCancel() {
    this.roleField = true;
    this.isAddUserCan = false;
    this.roleError = false;
    this.userRoll = false;
    this.roleTitle = false;
    this.isEventUserEdit = false;
    this.eventUserRole.Role = "";
    this.eventUserRole.UserID = "";
  }
  arrUserRole: any = [];
  userRoleError: string;
  uRoleReq: string;
  roleReq: string;
  roleError: boolean = false;
  fnAddEventUser() {

    if (this.eventUserRole.UserID > 0 && this.eventUserRole.Role != "") {
      this.roleField = true;
      let tempUname: string;
      let tempUrole: string;
      let match = Boolean(this.eUserList.find((o) => {
        if ((o.UserID === this.eventUserRole.UserID && o.Role === this.eventUserRole.Role)) {
          return true;
        }
        else {
          return false;
        }
      }));

      if (match == false) {
        this.eUserList.push({ "UserID": this.eventUserRole.UserID, "Role": this.eventUserRole.Role });
        this.eventCreateModel.EventUser = Object.assign(this.eUserList);
        let tempUname: string;
        let tempUrole: string

        for (let i = 0; i < this.comUserList.length; i++) {
          if (this.comUserList[i].rid == this.eventUserRole.UserID) {
            tempUname = this.comUserList[i].cUser;
          }
        }

        for (let i = 0; i < this.eUserRole.length; i++) {
          if (this.eUserRole[i].id == this.eventUserRole.Role) {
            tempUrole = this.eUserRole[i].title;
          }
        }

        this.arrUserRole.push({ UserID: tempUname, Role: tempUrole });
        this.userRoll = false;
        this.roleTitle = false;
        this.roleError = false;
        this.roleField = true;
        this.isEventUserEdit = false;
        this.eventUserRole.UserID = "";
        this.eventUserRole.Role = "";
        //this.fnResetUserRole();
      }
      else {
        let errorUrole;
        let errorUname;
        this.roleError = true;
        for (let i = 0; i < this.comUserList.length; i++) {
          if (this.comUserList[i].rid == this.eventUserRole.UserID) {
            errorUname = this.comUserList[i].cUser;
          }
        }
        for (let i = 0; i < this.eUserRole.length; i++) {
          if (this.eUserRole[i].id == this.eventUserRole.Role) {
            errorUrole = this.eUserRole[i].title;
          }
        }
        this.userRoleError = "This User " + errorUname + " already assign for " + errorUrole + " !";
        this.roleField = false;
      }
    }
    else if (this.eventUserRole.UserID == 0 && this.eventUserRole.Role == 0) {
      this.userRoll = true;
      this.roleTitle = true;
      this.uRoleReq = "User is required.";
      this.roleReq = "Role is required.";
    }
    else if (this.eventUserRole.UserID == 0) {
      this.userRoll = true;
      this.uRoleReq = "User is required.";
    }
    else if (this.eventUserRole.Role == 0) {
      this.roleTitle = true;
      this.roleReq = "Role is required.";
    }
    else {
      this.userRoll = true;
      this.roleTitle = true;
    }
  }
  delIndex: any;
  delIndexSkill: any;
  fnDeleteEventUserRole(index) {
    this.cnfDeleteEdu = true;
    this.delIndex = index;
  }
  fnCNFDelete(val: boolean) {
    if (val) {
      this.eUserList.splice(this.delIndex, 1);
      this.arrUserRole.splice(this.delIndex, 1);
      this.cnfDeleteEdu = false;
      if (this.eUserList.length == 0) {
        this.roleField = false;
      }
      else {
        this.roleField = true;
      }
    }
  }

  fnEditEventUserRole(index) {
    this.roleField = false;
    this.isEventUserEdit = true;
    this.isAddUserCan = false;
    let userVal = this.eUserList[index];
    this.eventUserRole.UserID = userVal.UserID;
    this.eventUserRole.Role = userVal.Role;
    this.eUserList.splice(index);
    this.arrUserRole.splice(index);
  }
  /* Skill List start from here */
  eventSkillModel: any =
    {
      "SkillID": "",
      "SkillRating": "0",
      "title": "",
      "SFID": ""
    }

  SkillRatingerr: string;
  skillSelErr: string;
  fnResetSkill() {
    this.eventSkillModel =
      {
        "SkillID": "",
        "SkillRating": "0",
        "title": "",
        "SFID": ""
      }
    this.skillDataList = [];
  }

  skillExitErr: boolean = false;
  skillAddErr: string;
  fnAddEventSkill() {
    if (this.eventSkillModel.SkillID > 0 && this.eventSkillModel.SkillRating >= 0 && this.eventSkillModel.SFID > 0) {
      this.skillErr = false;
      this.skillFamilyErr = false;
      //this.ratingError = false;
      this.skillExitErr = false;

      let match = Boolean(this.EventSkill.find((idFind) => {
        if ((idFind.SkillID === this.eventSkillModel.SkillID)) {
          return true;
        }
        else {
          return false;
        }
      }));

      if (match == false) {
        this.EventSkill.push({ "SkillID": this.eventSkillModel.SkillID, "SkillRating": this.eventSkillModel.SkillRating, "SFID": this.eventSkillModel.SFID });
        this.skillViewList.push({ "title": this.eventSkillModel.title, "SkillID": this.eventSkillModel.SkillID, "SkillRating": this.eventSkillModel.SkillRating, "SFID": this.eventSkillModel.SFID });
        this.isSkillShow = true;
        this.eventSkillModel.SkillID = "";
        this.eventSkillModel.title = "";
        this.eventSkillModel.SkillRating = "0";
        this.eventSkillModel.SFID = "";
        this.skillDataList = [];
        this.skillField = true;
        this.isSkillEdit = false;
      }
      else {
        this.skillExitErr = true;
        this.skillAddErr = "This skill already exists!";
        this.skillField = false;
      }
    }
    else if (this.eventSkillModel.SkillID == 0 && this.eventSkillModel.SFID == "") {
      this.skillFamilyErr = true;
      this.skillSelErr = "Skill family is required.";
    }
    else if (this.eventSkillModel.SkillID == "") {
      this.skillErr = true;
      this.skillSelErr = "Select Skill";
    }
    else {
      this.skillErr = true;
      this.skillFamilyErr = true;
    }
  }

  isCanshow: boolean = false;
  fnAddSkill() {
    this.skillField = false;
    this.isCanshow = true;
    this.skillErr = false;
    this.skillFamilyErr = false;
    //this.ratingError = false;
    this.eventSkillModel.SkillID = "";
    this.eventSkillModel.title = "";
    this.eventSkillModel.SkillRating = "0";
    this.eventSkillModel.SFID = "";
    this.isSkillEdit = false;
  }
  fnSkillRateCancel() {
    this.skillField = true;
    this.isCanshow = false;
    this.skillExitErr = false;
    this.isSkillEdit = false;
    this.skillDataList = [];
    this.eventSkillModel.SkillID = "";
    this.eventSkillModel.title = "";
    this.eventSkillModel.SkillRating = "0";
    this.eventSkillModel.SFID = "";
  }
  fnEditSkill(sIndex) {
    this.skillField = false;
    this.isSkillShow = true;
    this.roleField = false;
    this.isSkillEdit = true;
    this.isCanshow = false;
    let skillsInfo = this.skillViewList[sIndex];
    let sID = this.EventSkill[sIndex];
    this.fnSkillList(skillsInfo.SFID);
    this.eventSkillModel.title = skillsInfo.title;
    this.eventSkillModel.SkillRating = skillsInfo.SkillRating;
    this.eventSkillModel.SkillID = sID.SkillID;
    this.eventSkillModel.SFID = skillsInfo.SFID;
    this.skillViewList.splice(sIndex, 1);
    this.EventSkill.splice(sIndex, 1);
  }
  fnDeleteSkill(dIndex) {
    this.cnfDeleteSkill = true;
    this.delIndexSkill = dIndex;
  }

  fnCNFSkillDelete(val: boolean) {
    if (val) {
      this.skillViewList.splice(this.delIndexSkill, 1);
      this.EventSkill.splice(this.delIndexSkill, 1);
      this.cnfDeleteSkill = false;
      if (this.skillViewList.length == 0) {
        this.skillField = false;
      }
      else {
        this.skillField = true;
        this.skillSelErr = "Skill not Found!";
      }
    }
  }
  skillDataList: any = [];
  fnSkillList(sFID) {
    if (sFID) {
      const skills = {
        "RID": sFID
      };
      this.spinnerService.show();
      this.common.fnPostAPI('/Events/GetSkilllist', skills)
        .subscribe((data: any) => {
          this.spinnerService.hide();
          if (data && data.status && data.code === this.dataservice.status.success) {
            this.skillDataList = data.resObject;
          }
          else {
            this.skillDataList = [];
          }
        });
    }
  }
  fnSkillFamily() {
    this.spinnerService.show();
    this.http.get('/Events/GetSkillFamily')
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.skillFamily = data.resObject;
      });
  }

  fnEventId(event) {
    if (event)
      event = event || window.event; // IE
    var target = event.target || event.srcElement; // IE

    var id = target.id;

  }

  isSkillselected: boolean = false;
  fnFindSkillId(val) {
    if (val) {
      let skillId = this.skillDataList.find((skillInfo) => { if ((skillInfo.rid == val)) { return true; } });
      if (skillId.rid) {
        this.eventSkillModel.title = skillId.title;
      }
    }
  }

  hoveringOver(value: number): void {
    this.overStar = value;
  }

  courseModel =
    {
      "courseID": "",
      "courseTitle": ""
    }

  fnEduTitile(eduId: string) {
    if (eduId) {
      let eduTitle = this.courseList.find((eduInfo) => { if ((eduInfo.rid == eduId)) { return true; } });
      if (eduTitle.rid) {
        this.courseModel.courseTitle = eduTitle.title;
      }
    }
  }
  eduSelectErr: string;
  eduAddErr: string;
  eduExists: boolean = false;
  isEduEdit: boolean = false;
  isEduShow: boolean = false;
  eduField: boolean = false;
  fnAddCourse() {
    if (this.courseModel.courseID != "" && this.courseModel.courseTitle.length > 0) {
      let matchEdu = Boolean(this.eduList.find((idFind) => {
        if ((idFind.EduID == this.courseModel.courseID)) {
          return true;
        }
        else {
          return false;
        }
      }));

      if (matchEdu == false) {
        this.eduList.push({ "EduID": this.courseModel.courseID });
        this.eduViewList.push({ "EduID": this.courseModel.courseID, "title": this.courseModel.courseTitle });
        this.isEduShow = false;
        this.courseModel.courseID = "";
        this.courseModel.courseTitle = "";
        this.eduField = true;
        this.isEduEdit = false;
        this.eduExists = false;
      }
      else {
        this.eduExists = true;
        this.eduAddErr = "This course already exists!";
        this.eduField = false;
      }

    }
    else if (this.courseModel.courseID == "0" || this.courseModel.courseID == "") {
      this.eduErr = true;
      this.eduSelectErr = "Select Education.";
    }
    else {
      this.eduErr = true;
    }
  }
  fnEduSkill() {
    this.eduField = false;
    this.isEduShow = true;
    this.eduErr = false;
    this.courseModel.courseID = "";
    this.courseModel.courseTitle = "";
    this.isEduEdit = false;
  }
  fnEduCancel() {
    this.eduField = true;
    this.isEduShow = false;
    this.eduErr = false;
    this.courseModel.courseID = "";
    this.courseModel.courseTitle = "";
    this.isEduEdit = false;
    this.eduExists = false;
  }
  fnEditEdu(eduIndex) {
    this.eduField = false;
    this.isEduShow = false;
    this.isEduEdit = true;
    let eduInfo = this.eduViewList[eduIndex];
    this.courseModel.courseID = eduInfo.EduID;
    this.courseModel.courseTitle = eduInfo.title;
    this.eduViewList.splice(eduIndex, 1);
    this.eduList.splice(eduIndex, 1);
  }

  deleteEduIndex: any;
  fnDeleteEducation(eduIndex) {
    this.cnfDeleteEdu = true;
    this.deleteEduIndex = eduIndex;
  }

  fnCNFEduDelete(val: boolean) {
    if (val) {
      this.eduViewList.splice(this.deleteEduIndex, 1);
      this.eduList.splice(this.deleteEduIndex, 1);
      this.cnfDeleteEdu = false;
      if (this.eduViewList.length == 0) {
        this.eduField = false;
      }
      else {
        this.eduField = true;
      }
    }
  }
}
