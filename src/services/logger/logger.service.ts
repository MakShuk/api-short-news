import { Injectable } from '@nestjs/common';

import { Logger, ILogObj } from 'tslog';

@Injectable()
export class LoggerService {
	private logger: Logger<ILogObj>;

	constructor(name?: string) {
		this.logger = new Logger({
			hideLogPositionForProduction: true,
			type: 'pretty',
			name: name ? `[${name}]` : undefined,
		});
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	info(...args: unknown[]): void {
		this.logger.info(...args);
	}

	trace(...args: unknown[]): void {
		this.logger.trace(...args);
	}

	async measureExecutionTime(callback: () => Promise<void>): Promise<any> {
		const start = performance.now();
		const result = await callback();
		const end = performance.now();
		this.trace(this.formatTime(end - start));
		return result;
	}

	private formatTime(milliseconds: number): string {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60)
			.toString()
			.padStart(2, '0');
		const seconds = (totalSeconds % 60).toString().padStart(2, '0');
		return `Время выполнения скрипта: ${minutes}:${seconds}`;
	}
}
