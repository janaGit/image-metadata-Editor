import { FILE_NAMES_TO_IGNORE } from "./constants";

export function filterFilesToIgnore(fileName: string) {
        return FILE_NAMES_TO_IGNORE.indexOf(fileName) === -1;
}