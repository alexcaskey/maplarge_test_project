export interface DirectoryBrowseResult {
    path: string;
    folders: { name: string; }[]
    files: { name: string; size?: number }[];
    totalFileCount: number;
    totalFolderCount: number;
    totalSize: number;
}