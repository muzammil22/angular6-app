import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCampaignFormComponent } from './default-campaign-form.component';

describe('DefaultCampaignFormComponent', () => {
  let component: DefaultCampaignFormComponent;
  let fixture: ComponentFixture<DefaultCampaignFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultCampaignFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultCampaignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
