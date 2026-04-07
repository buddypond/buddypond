export default async function getCloudFiles(prefix, depth) {

    // users can query their cloud files by glob
    // users can only modify files in their home directory ( /buddyname )

    // console.log('this.bp getting cloud files', this.bp);
    // console.log("using prefix", prefix, 'at depth', depth);
    let userFiles = await this.fileExplorerInstance.client.listFiles(prefix, depth);

    // console.log('userFiles', userFiles);
    return userFiles;

}