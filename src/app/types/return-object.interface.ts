

export interface ReturnObject {
    status: number;
    message?: string;
    error?: NodeJS.ErrnoException;
    payload?: { imageName: string }
}