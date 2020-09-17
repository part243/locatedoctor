import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProbandoPage } from './probando.page';

describe('ProbandoPage', () => {
  let component: ProbandoPage;
  let fixture: ComponentFixture<ProbandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbandoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProbandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
