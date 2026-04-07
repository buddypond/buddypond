    export default async function getUsage() {

        // get initial file usage
        let currentUsage = await this.client.getFileUsage();

        // console.log('currentUsage', currentUsage);
        this.currentStorageUsage = currentUsage.usage;
        console.log('got back currentUsage', currentUsage);
        let storageLimit = currentUsage.storageLimit || 10000000; // 10mb
        let storageRemaining = storageLimit - currentUsage.usage;
        this.currentStorageRemaining = storageRemaining;

        $('.storageUsed', this.content).text(this.bytes(currentUsage.usage));
        $('.storageRemaining', this.content).text(this.bytes(storageRemaining));
    }
