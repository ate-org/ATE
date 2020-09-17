import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemBinStatusComponent } from './system-bin-status.component';
import { SiteBinInformationComponent } from '../site-bin-information/site-bin-information.component';
import { CardComponent } from './../basic-ui-elements/card/card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockServerService } from '../services/mockserver.service';
import * as constants from './../services/mockserver-constants';
import { StoreModule } from '@ngrx/store';
import { statusReducer } from '../reducers/status.reducer';
import { resultReducer } from '../reducers/result.reducer';
import { consoleReducer } from '../reducers/console.reducer';
import { AppstateService } from '../services/appstate.service';
import { expectWaitUntil } from '../test-stuff/auxillary-test-functions';
import { userSettingsReducer } from 'src/app/reducers/usersettings.reducer';

describe('SystemBinStatusComponent', () => {
  let component: SystemBinStatusComponent;
  let fixture: ComponentFixture<SystemBinStatusComponent>;
  let debugElement: DebugElement;
  let mockServerService: MockServerService;
  let appStateService: AppstateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemBinStatusComponent,
        SiteBinInformationComponent,
        CardComponent
      ],
      providers: [ ],
      imports: [
        StoreModule.forRoot({
          systemStatus: statusReducer, // key must be equal to the key define in interface AppState, i.e. systemStatus
          results: resultReducer, // key must be equal to the key define in interface AppState, i.e. results
          consoleEntries: consoleReducer, // key must be equal to the key define in interface AppState, i.e. consoleEntries
          userSettings: userSettingsReducer // key must be equal to the key define in interface AppState, i.e. userSettings
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockServerService = TestBed.inject(MockServerService);
    appStateService = TestBed.inject(AppstateService);

    fixture = TestBed.createComponent(SystemBinStatusComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterAll(() => {
    document.getElementById(constants.MOCK_SEVER_SERVICE_NEVER_REMOVABLE_ID)?.remove();
  });

  it('should create system-bin-status component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 app-card tag', () => {
    let componentElement = debugElement.nativeElement.querySelectorAll('app-card');
    expect(componentElement).not.toEqual(null);
    expect(componentElement.length).toEqual(2);
  });

  let labelText = 'System BIN Status';
  it('should show label containing text: ' + labelText, () => {

    expect(debugElement.query(By.css('hr + app-card'))
      .nativeElement.textContent).toBe(labelText);
  });
  it('should show empty string for lable text of inner app-card element', () => {
    expect(debugElement.query(By.css('app-card app-card'))
      .nativeElement.textContent).toEqual('');
  });

  describe('number of app-site-bin-information components', () => {
    it('should be 0 on initialization', () => {
      expect(debugElement.queryAll(By.css('app-site-bin-information')).length).toEqual(0);
    });

    it('should be greater than 0 in case that there is any site', async () => {
      // mock server message by using the mock server service
      mockServerService.setMessages([
        constants.MESSAGE_WHEN_SYSTEM_STATUS_READY
      ]);

      let waitUntilCondition = function foundLabeTexts(): boolean {
        let element = debugElement.queryAll(By.css('app-site-bin-information'));
          if (element.length > 0) {
            return true;
          }
          return false;
       };

      let updateFixture = () => {
        fixture.detectChanges();
      };

      await expectWaitUntil(
        updateFixture,
        waitUntilCondition,
        'No app-site-bin-information elements displayed'
      );
    });
  });
});
