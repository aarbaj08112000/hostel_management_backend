import { UserBase } from './base-user.entity';
export declare class MetadataEntity extends UserBase {
    metaMasterId: number;
    entityType: string;
    entityId: number;
    entityCode?: string;
    metaJson?: object;
    twitterJson?: object;
    ogJson?: object;
    otherMeta?: object;
    otherScript?: object;
    otherLink?: object;
}
//# sourceMappingURL=meta.entity.d.ts.map