import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // the waitForAsync does just what the name suggests as it waits for the async beforeEach to complete before running the tests
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CoursesModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    // the detectChanges() method is called to trigger the change detection cycle. it functions synchonously. without it, the updated courses data will not be rendered in the template and the test expect(cards.length) test will fail
    fixture.detectChanges();
    console.log(el.nativeElement.outerHTML);
    const cards = el.queryAll(By.css(".course-card"));
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child"));
    expect(card).toBeTruthy("Could not find the course card");

    const title = card.query(By.css("mat-card-title"));
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    const image = card.query(By.css("img"));
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


