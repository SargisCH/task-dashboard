export enum Status {
    ToDo = 'ToDo',
    InProgress = 'InProgress',
    Testing = 'Testing',
    Done = 'Done',
}

export const statusOptions = Object.keys(Status).map((key) => ({
    label: key,
    value: Status[key as keyof typeof Status],
}));
