import { Injectable, Scope } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { Interval } from '@nestjs/schedule';

// Scope.DEFAULT means it's a singleton
@Injectable({ scope: Scope.DEFAULT })
export class NotificationsService {
    private expo = new Expo();
    private notifications: ExpoPushMessage[] = [];
    private receipts: string[] = [];

    queueNotification(expoPushToken: string, message: string) {
        if (!Expo.isExpoPushToken(expoPushToken)) {
            return;
        }

        this.notifications.push({
            body: message,
            to: expoPushToken,
            sound: 'default',
            data: {},
        });
    }

    @Interval(1000)
    async sendNotifications() {
        const chunks = this.expo.chunkPushNotifications(this.notifications);
        this.notifications = [];
        for (const chunk of chunks) {
            try {
                const tickets = await this.expo.sendPushNotificationsAsync(
                    chunk,
                );
                for (const ticket of tickets) {
                    if (ticket.status === 'ok') {
                        this.receipts.push(ticket.id);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    @Interval(1500)
    async checkReceipts() {
        const chunks = this.expo.chunkPushNotificationReceiptIds(this.receipts);
        this.receipts = [];
        for (const chunk of chunks) {
            try {
                const receipts = await this.expo.getPushNotificationReceiptsAsync(
                    chunk,
                );
                for (const receiptId in receipts) {
                    const receipt = receipts[receiptId];
                    if (receipt.status === 'ok') {
                        continue;
                    }

                    console.log(
                        `Could not send notification: ${receipt.message}`,
                    );
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}
