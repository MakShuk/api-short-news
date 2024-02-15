export interface ResponseData<T> {
	content: string;
	error: boolean;
	data?: T;
}
