declare enum STATUS {
    PENDING = "Pending",
    EXECUTED = "Executed",
    FAILED = "Failed",
    DBERROR = "DBError",
    INPROCESS = "Inprocess"
}
declare enum NOTIFY_TYPE {
    TIME = "Time",
    OPERATION = "Operation"
}
declare enum OPERATION {
    INSERT = "Insert",
    UPDATE = "Update",
    DELETE = "Delete"
}
export declare class NotifyScheduleEntity {
    id: number;
    notifyName: string;
    notifyType: NOTIFY_TYPE;
    operation: OPERATION;
    success: string;
    message: string;
    outputJson: JSON;
    exeDateTime: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export {};
//# sourceMappingURL=notify-schedule.entity.d.ts.map