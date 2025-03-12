import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

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

    it('it should retrieve all courses', () => {

    });

});