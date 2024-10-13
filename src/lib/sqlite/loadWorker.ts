import { WorkerMessageType, type WorkerMessage } from './types';

const workerImp = await import('./worker/worker.ts?worker');
const initWorker = () => {
	const worker = new workerImp.default();

	const msg: WorkerMessage = {
		type: WorkerMessageType.INIT_DB
	};
	worker.postMessage(msg);

	// worker.addEventListener('message', async ({ data }: { data: WorkerMessage }) => {});
};
export default initWorker;
