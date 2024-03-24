import PinataClient from "@pinata/sdk";
import dotenv from "dotenv";
dotenv.config();

export const pinata = new PinataClient({ pinataJWTKey: process.env.PINATE_JWT });