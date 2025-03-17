import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {

    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CoursesService]
        });
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses().
            subscribe(courses => {
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, "incorrect number of courses");
                const course = courses.find(c => c.id == 12);
                expect(course.titles.description).toBe("Angular Testing Course");
            });
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        // the req.flush() method is needed for the expect() statements inside the subscribe method to be evaluted. see next note for more detail
        // the above coursesService.findAllCourses() method call will trigger an http request to the /api/courses endpoint, however the subscribe method will not be called until the req.flush() method is called as it is what emits response data and completes the request. to put it another way, the req.flush method simulates the server response
        req.flush({payload: Object.values(COURSES)});
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(12).
            subscribe(course => {
                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[12]);
    });

    it('should save the course data', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
        const courseId: number = 12;
        coursesService.saveCourse(courseId, changes).
            subscribe(course => {
                expect(course.id).toBe(courseId);
            });
        const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        // simulates a response from the backend. it merges the existing course data with the changes object. the updated course data is then returned to the subscribe method
        req.flush({
            ...COURSES[courseId],
            ...changes
        });
    });

    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
        const courseId: number = 12;
        coursesService.saveCourse(courseId, changes).
            subscribe(
                () => fail('the save course operation should have failed'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }
            );
        const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
        expect(req.request.method).toEqual('PUT');
        req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
    });

    it('should find a list of lessons', () => {
        const courseId: number = 12;
        coursesService.findLessons(courseId).
            subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            });
        // included a predicate function in the expectOne method to filter the request based on the url. this is because the findLessons method constructs the url with query parameters
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual(courseId.toString());
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');
        req.flush({
            payload: findLessonsForCourse(courseId).slice(0, 3)
        });
    });

    afterEach(() => {
        // the httpTestingController.verify() method is used to assert that there are no outstanding requests that have not been handled. it is a good practice to call this method at the end of each test to ensure that all requests have been handled
        httpTestingController.verify();
    });

});