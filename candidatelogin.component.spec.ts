import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateloginComponent } from './candidatelogin.component';

describe('CandidateloginComponent', () => {
  let component: CandidateloginComponent;
  let fixture: ComponentFixture<CandidateloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
