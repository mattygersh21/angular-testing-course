import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService', () => {

    it('should add two numbers', () => {
        // creates a spy object that is a mock of the LoggerService that has a method called log. this jasmine object keeps track of how many times the log method is called, which is why we can use the toHaveBeenCalledTimes method to assert that the log method was called once below
        const logger = jasmine.createSpyObj('LoggerService', ['log']);
        const calculator = new CalculatorService(logger);
        const result = calculator.add(2, 2);
        expect(result).toBe(4);
        expect(logger.log).toHaveBeenCalledTimes(1);
    })

    it('should subtract two numbers', () => {
        const calculator = new CalculatorService(new LoggerService());
        const result = calculator.subtract(2, 2);
        expect(result).toBe(0, "Unexpected subtraction result");
    })
});