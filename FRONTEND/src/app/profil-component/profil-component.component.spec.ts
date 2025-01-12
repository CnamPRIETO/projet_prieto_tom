import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilComponentComponent } from './profil-component.component';

describe('ProfilComponentComponent', () => {
  let component: ProfilComponentComponent;
  let fixture: ComponentFixture<ProfilComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
