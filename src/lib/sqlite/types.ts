export enum WorkerMessageType {
	INIT_DB,
	INIT_DB_RESPONSE
}

export type WorkerMessage = {
	type: WorkerMessageType;
};
