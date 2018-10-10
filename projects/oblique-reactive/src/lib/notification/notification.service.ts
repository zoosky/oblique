import {Injectable, EventEmitter} from '@angular/core';
import {Notification, NotificationEvent, KeyWithParams, NotificationType} from './notification.interfaces';
import {NotificationConfig} from './notification.config';

/**
 * Service for the `NotificationComponent`. Can be configured using `NotificationConfig`.
 *
 * @see NotificationComponent
 * @see NotificationConfig
 */
@Injectable()
export class NotificationService {

	public events: EventEmitter<NotificationEvent> = new EventEmitter<NotificationEvent>();

	private currentId = 0;

	constructor(public config: NotificationConfig) {
	}

	/**
	 * Broadcasts a notification to the specified `channel`.
	 */
	public broadcast(channel = this.config.channel, notification: Notification): Notification {
		if (!notification.id) {
			notification.id = this.currentId++;
		}

		this.events.emit({
			channel: channel,
			notification: notification
		});

		return notification;
	}

	/**
	 * Sends a notification of the specified `type` and with provided `title` and `messageKey`.
	 * An additional `NotificationConfig` can also be provided.
	 */
	public send(message: string | KeyWithParams,
				title: string | KeyWithParams = '',
				type = NotificationType.DEFAULT,
				config = this.config): Notification {
		return this.broadcast(config.channel, {
			messageKey: (<KeyWithParams>message).key || <string>message,
			messageParams: (<KeyWithParams>message).params,
			sticky: config.sticky,
			timeout: config.timeout,
			titleKey: (<KeyWithParams>title).key || title,
			titleParams: (<KeyWithParams>title).params,
			type: type
		} as Notification);
	}

	/**
	 * Sends a _default_ notification.
	 */
	public default(message: string | KeyWithParams, title: string | KeyWithParams = '', config = this.config): Notification {
		return this.send(message, title, NotificationType.DEFAULT, config);
	}

	/**
	 * Sends an _info_ notification.
	 */
	public info(message: string | KeyWithParams, title: string | KeyWithParams = '', config = this.config): Notification {
		return this.send(message, title, NotificationType.INFO, config);
	}

	/**
	 * Sends a _success_ notification.
	 */
	public success(message: string | KeyWithParams, title: string | KeyWithParams = '', config = this.config): Notification {
		return this.send(message, title, NotificationType.SUCCESS, config);
	}

	/**
	 * Sends a _warning_ notification.
	 */
	public warning(message: string | KeyWithParams, title: string | KeyWithParams = '', config = this.config): Notification {
		return this.send(message, title, NotificationType.WARNING, config);
	}

	/**
	 * Sends an _error_ notification.
	 */
	public error(message: string | KeyWithParams, title: string | KeyWithParams = '', config = this.config): Notification {
		return this.send(message, title, NotificationType.ERROR, config);
	}

	/**
	 * Broadcasts an event to clear all notifications from specified `channel`.
	 */
	public clear(channel = this.config.channel) {
		this.events.emit({
			channel: channel
		});
	}

	/**
	 * Broadcasts an event to clear all notifications from any available.
	 */
	public clearAll() {
		this.events.emit(null);
	}
}