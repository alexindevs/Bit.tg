import shortcode from "short-uuid";
import { RequestModel, URLModel } from "./db";

export const shortenUrl = (url: string, userId: number): string => {
    const shortCode = shortcode.generate();
    const newUrl = new URLModel({
        originalUrl: url,
        shortCode: shortCode,
        userId: userId
    });
    newUrl.save();

    return `${process.env.BASE_URL}/${shortCode}`;
}


export const isValidUrl = (url: string): boolean => {
    // Implement your URL validation logic here
    // For simplicity, you can use a regular expression
    const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return urlRegex.test(url);
}

export const getShortenRequest = async (userId: number): Promise<boolean> => {
    const request = await RequestModel.findOne({ userId: userId });
    if (request) {
        return true;
    }
    return false;
}

export const getOriginalUrl = async (userId: number, shortCode: string): Promise<string> => {
    const url = await URLModel.findOne({ userId: userId, shortCode: shortCode });
    if (url) {
        return url.originalUrl;
    }
    return "";
}

export const getAllUrls = async (userId: number): Promise<any> => {
    const urls = await URLModel.find({ userId: userId });
    return urls;
}

export const addShortenRequest = async (userId: number): Promise<void> => {
    const newRequest = new RequestModel({
        userId: userId
    });
    await newRequest.save();
}

export const deleteShortenRequest = async (userId: number): Promise<void> => {
    await RequestModel.deleteOne({ userId: userId });
}