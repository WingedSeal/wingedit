import { WorkerMessageType, type WorkerMessage } from '../types';
import { initDB } from './initDB';

(async () => {
	addEventListener('message', async ({ data }: { data: WorkerMessage }) => {
		switch (data.type) {
			case WorkerMessageType.INIT_DB:
				// @ts-ignore
				await import('../jswasm/sqlite3.mjs');

				await initDB();
				const res: WorkerMessage = { type: WorkerMessageType.INIT_DB_RESPONSE };
				postMessage(res);
				break;
			default:
				throw new Error(`Unknown message type: ${data.type}`);
		}
	});
})();
