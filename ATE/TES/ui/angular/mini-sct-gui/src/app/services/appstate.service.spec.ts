import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';
import { MockServerService } from './mockserver.service';

import * as constants from 'src/app/services/mockserver-constants';
import { expectWaitUntil } from '../test-stuff/auxillary-test-functions';
import { MessageTypes, AppstateService } from './appstate.service';
import { statusReducer } from 'src/app/reducers/status.reducer';
import { resultReducer } from 'src/app/reducers/result.reducer';
import { consoleReducer } from 'src/app/reducers/console.reducer';
import { userSettingsReducer } from 'src/app/reducers/usersettings.reducer';
import { StoreModule } from '@ngrx/store';

describe('AppstateService', () => {

  let service: AppstateService;
  let communicationService: CommunicationService;
  let mockServerService: MockServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [
        StoreModule.forRoot({
          systemStatus: statusReducer, // key must be equal to the key define in interface AppState, i.e. systemStatus
          results: resultReducer, // key must be equal to the key define in interface AppState, i.e. results
          consoleEntries: consoleReducer, // key must be equal to the key define in interface AppState, i.e. consoleEntries
          userSettings: userSettingsReducer // key must be equal to the key define in interface AppState, i.e. userSettings
        })
      ],
      declarations: [],
    });
    mockServerService = TestBed.inject(MockServerService);
    communicationService = TestBed.inject(CommunicationService);
    service = TestBed.inject(AppstateService);
  });

  afterAll( () => {
    document.getElementById(constants.MOCK_SEVER_SERVICE_NEVER_REMOVABLE_ID)?.remove();
  });

  describe(MessageTypes.Testresults, () => {
    it('should set/snyc all stored test results to the received results', async () => {
      mockServerService.setMessages([
        constants.TEST_RESULTS_SITE_1_AND_2,
        {}
      ]);

      await expectWaitUntil (
        null,
        () => service.stdfRecords.length === constants.TEST_RESULTS_SITE_1_AND_2
        .payload.map(e => e.length).reduce( (a,c) => a + c, 0),
        'Number of records are not equal to the number of received records'
      );

      mockServerService.setMessages([
        {
          type: 'testresults',
          payload: []
        },
        {}
      ]);

      await expectWaitUntil (
        null,
        () => service.stdfRecords.length === 0,
        'Number of records are not equal to the number of received records'
      );
    });
  });
});
