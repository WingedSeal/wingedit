import { z } from 'zod';

export const mapPositionDeleteSchema = z.object({
	mapPositionID: z
		.number()
		.int()
		.default(null as unknown as number)
});
