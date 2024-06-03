const metadataStorage: WeakMap<any, any> = new WeakMap();

export function getMetadata(target: any): any {
    let metadata = metadataStorage.get(target);
    if (!metadata) {
        metadata = {};
        metadataStorage.set(target, metadata);
    }
    return metadata;
}