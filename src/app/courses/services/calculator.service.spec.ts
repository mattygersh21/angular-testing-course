import { CalculatorService } from "./calculator.service";

describe('CalculatorService', () => {

    let calculator: CalculatorService;
    let loggerSpy: any;

    beforeEach(() => {
        // creates a spy object that is a mock of the LoggerService that has a method called log. this jasmine object keeps track of how many times the log method is called, which is why we can use the toHaveBeenCalledTimes method to assert that the log method was called once below
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
        calculator = new CalculatorService(loggerSpy);
    });

    it('should add two numbers', () => {
        const result = calculator.add(2, 2);
        expect(result).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })

    it('should subtract two numbers', () => {
        const result = calculator.subtract(2, 2);
        expect(result).toBe(0, "Unexpected subtraction result");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })
});