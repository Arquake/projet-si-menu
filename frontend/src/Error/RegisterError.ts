export default class RegisterError extends Error {

    data: object;

    constructor(errorData: object){
        super('An error occured while fetching data');
        this.data = errorData;
    }

    getData() {
        return this.data;
    }
}